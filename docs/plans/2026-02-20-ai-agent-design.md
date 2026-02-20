# AI Security Advisor — Agent Design

**Date**: 2026-02-20
**Status**: Approved

## Overview

Upgrade the existing ephemeral chat widget into a persistent, tool-calling AI agent that can read and write the Cyber Defense Matrix. The agent queries project data server-side for reasoning, and emits mutation proposals as confirmation tiles that the user must explicitly approve before any changes are made.

## Architecture: Hybrid (Server Reads + Client Confirmations)

```
User types message
       │
       ▼
  Client sends POST /api/chat
  { messages, conversationId, activeProjectIds }
       │
       ▼
  ┌─ SERVER AGENTIC LOOP ──────────────────────┐
  │                                              │
  │  1. Build system prompt + project context    │
  │  2. Call Claude with tools defined           │
  │  3. If response has tool_use blocks:         │
  │     ├─ READ tools → execute Supabase query   │
  │     │   feed result back as tool_result      │
  │     │   → loop back to step 2               │
  │     │                                        │
  │     └─ WRITE tools → DON'T execute           │
  │         emit SSE "proposal" event to client  │
  │         feed "awaiting user confirmation"    │
  │         as tool_result → continue generation │
  │                                              │
  │  4. Stream text content as SSE data events   │
  │  5. On finish, save messages to Supabase     │
  └──────────────────────────────────────────────┘
       │
       ▼
  Client receives two types of SSE events:
  ├─ { type: "text", content: "..." }     → append to message
  └─ { type: "proposal", action: {...} }  → render confirmation tile
       │
       ▼
  User clicks [Apply] on tile
       │
       ▼
  Client calls existing server action
  (upsertAssessment / addToolMapping / removeToolMapping)
       │
       ▼
  TanStack Query cache invalidates → matrix UI updates
```

### Key Principles

- **Reads are invisible** — the agent queries data silently and uses it in its reasoning
- **Writes are visible** — every mutation surfaces as a confirmation tile
- **Existing mutation code is reused** — same `upsertAssessment()`, `addToolMapping()`, `removeToolMapping()` the matrix page uses
- **The agentic loop stays on the server** — the client is thin, renders text + tiles

## Agent Tools

### Read Tools (server executes immediately)

| Tool | Parameters | Returns | Purpose |
|------|-----------|---------|---------|
| `get_project_summary` | `project_id` | Name, industry, company size, overall score, coverage %, last updated | High-level project overview |
| `get_assessments` | `project_id`, optional `cell_row`, `cell_column` | Array of cell assessments (maturity level, justification, date) | Query specific cells or full matrix |
| `get_tool_mappings` | `project_id`, optional `cell_row`, `cell_column` | Array of tool mappings with tool details, status, effectiveness | See what tools are deployed where |
| `get_gap_analysis` | `project_id` | Unassessed cells, low-maturity cells (≤2), cells with no tools mapped | Find weaknesses |
| `compare_projects` | `project_ids[]` | Side-by-side maturity scores, coverage deltas, tool overlap | Cross-project trends |
| `search_tools` | `query`, optional `category`, `cost_range`, `cell_row`, `cell_column` | Matching tools from the catalog | Recommend tools to fill gaps |

### Write Tools (emitted as proposals → confirmation tiles)

| Tool | Parameters | Tile Shows | On Confirm |
|------|-----------|------------|------------|
| `update_assessment` | `project_id`, `cell_row`, `cell_column`, `maturity_level`, `justification` | Cell name, current → new level, justification | `upsertAssessment()` |
| `add_tool_mapping` | `project_id`, `tool_id`, `cell_row`, `cell_column`, `implementation_status`, `notes` | Tool name, target cell, status | `addToolMapping()` |
| `remove_tool_mapping` | `mapping_id`, `project_id` | Tool name, cell, "Remove?" | `removeToolMapping()` |

### Example Interaction

> **User**: "What are the biggest gaps in my AWS Migration project?"
>
> **Agent** (internally): calls `get_assessments(project_id)` → calls `get_gap_analysis(project_id)`
>
> **Agent** (to user): "Your biggest gaps are in Detect and Respond — 6 of 10 cells are unassessed or Level 1. Networks/Detect and Data/Detect have no tools and no assessment."
>
> **User**: "Set Networks/Detect to level 2 — we just deployed Zeek"
>
> **Agent**: calls `search_tools("zeek")`, then emits two proposal tiles:
> - `update_assessment`: Networks/Detect → Level 2, "Zeek deployed for network traffic analysis"
> - `add_tool_mapping`: Zeek → Networks/Detect, status: implemented

## Confirmation Tile System

### SSE Event Protocol

```typescript
// Text content
{ type: "text", content: "Here are the gaps I found..." }

// Mutation proposal
{
  type: "proposal",
  id: "prop_abc123",
  action: "update_assessment",
  params: {
    project_id: "...",
    cell_row: "networks",
    cell_column: "detect",
    maturity_level: 3,
    justification: "Zeek deployed across all segments"
  },
  display: {
    title: "Update Assessment",
    cell_label: "Networks / Detect",
    current_value: "Level 1 (Initial)",
    proposed_value: "Level 3 (Defined)",
    detail: "Zeek deployed across all segments"
  }
}
```

`display` is pre-computed server-side. `params` is passed to the server action on confirm.

### Tile Variants

Assessment update:
```
┌─────────────────────────────────────────────┐
│ ⚡ Update Assessment                         │
│                                              │
│ Networks / Detect                            │
│ ██░░░ Level 1 (Initial)  →  █████ Level 3   │
│                              (Defined)       │
│                                              │
│ "Zeek deployed across all segments"          │
│                                              │
│  [✓ Apply]                    [✗ Dismiss]    │
└─────────────────────────────────────────────┘
```

Tool mapping:
```
┌─────────────────────────────────────────────┐
│ 🔧 Add Tool Mapping                         │
│                                              │
│ Zeek  →  Networks / Detect                   │
│ Status: Implemented                          │
│                                              │
│  [✓ Apply]                    [✗ Dismiss]    │
└─────────────────────────────────────────────┘
```

### Tile States

| State | Visual | Behavior |
|-------|--------|----------|
| **Pending** | Cyan border, buttons active | User can apply or dismiss |
| **Applied** | Green border, checkmark, "Applied" label | Buttons removed, mutation executed |
| **Dismissed** | Muted/faded, "Dismissed" label | No action taken |
| **Error** | Red border, error message, retry button | Mutation failed |

### On Confirm Flow

1. User clicks "Apply" → tile transitions to loading state
2. Client calls matching server action (e.g. `upsertAssessment(params)`)
3. Success → tile goes green, TanStack Query invalidates → matrix UI updates live
4. Error → tile shows error state with retry
5. Proposal status (applied/dismissed) persisted in conversation message JSONB

### On Dismiss

No mutation. Tile goes muted. Agent is not notified — silent rejection.

## Conversation Persistence

### Schema Changes

**`chat_conversations`** — no changes. Existing `project_id` column kept for backwards compat but not primary mechanism.

**New table: `chat_conversation_projects`** (junction table for multi-project tagging)

| Column | Type | Notes |
|--------|------|-------|
| `conversation_id` | UUID FK → chat_conversations | |
| `project_id` | UUID FK → projects | |
| Primary key: `(conversation_id, project_id)` | | |

**`chat_messages`** — add column:

| Column | Type | Purpose |
|--------|------|---------|
| `proposals` | JSONB, nullable | Array of proposal objects with status tracking |

Proposal JSONB structure:
```json
[
  {
    "id": "prop_abc123",
    "action": "update_assessment",
    "params": { ... },
    "display": { ... },
    "status": "applied",
    "applied_at": "2026-02-20T..."
  }
]
```

### Persistence Flow

1. **Conversation start**: Create `chat_conversations` row + link projects via junction table
2. **User message**: Insert `chat_messages` (role: 'user')
3. **Assistant response complete**: Insert `chat_messages` (role: 'assistant', proposals JSONB if any)
4. **Tile apply/dismiss**: Update `proposals` JSONB in the relevant message row
5. **Auto-title**: After first exchange, lightweight LLM call (Haiku) generates conversation title

### Conversation Scope

- Global list per user, tagged with projects
- Conversations appear in one unified list regardless of which project spawned them
- Filter/search by project tag

## Chat UX

### Two Modes

**Floating Widget** (current, enhanced):
- Cyan pill button, bottom-right
- ~400px tall, ~360px wide panel
- No conversation history — just active chat
- New "expand" button in header → transitions to sidebar

**Expandable Sidebar** (new):
- Slides in from right, ~420px wide, full viewport height
- Main content area reflows (margin transition, not overlay)
- Three sections: project selector, conversation list, active chat

```
┌──────────────────────────────┐
│ ◀ Collapse    AI Advisor   + │  header
├──────────────────────────────┤
│ Project Context          [✎] │  project selector
│ ┌──────────┐ ┌──────────┐   │
│ │ AWS Migr │ │ HQ Audit │   │  selected project badges
│ └──────────┘ └──────────┘   │
├──────────────────────────────┤
│ Today                        │
│  ├ "Gap analysis for AWS"    │  conversation list
│  └ "Tool recs for Detect"   │
│ Yesterday                    │
│  └ "Compare Q3 vs Q4"       │
├──────────────────────────────┤
│                              │
│  (active conversation)       │  messages + confirmation tiles
│                              │
├──────────────────────────────┤
│ Ask about your matrix...     │  input
└──────────────────────────────┘
```

### State

- `chatMode`: `'widget' | 'sidebar'` — localStorage persisted
- `isOpen`: boolean
- `activeConversationId`: string | null
- `selectedProjectIds`: string[]

### Dashboard Layout

```tsx
<div className="flex h-screen">
  <main className={cn("flex-1 transition-all", sidebarOpen && "mr-[420px]")}>
    {children}
  </main>
  {sidebarOpen && <ChatSidebar />}
</div>
```

### Mode Transitions

| From → To | Animation |
|-----------|-----------|
| Closed → Widget | Scale up from bottom-right |
| Widget → Sidebar | Expands rightward to full height |
| Sidebar → Widget | Shrinks back to floating panel |
| Sidebar → Closed | Slides out right |

### Project Selector

- Shows badges for selected projects in sidebar header
- Click edit to open dropdown of all user's projects
- Add/remove projects updates agent context for active conversation
- Changes persisted to `chat_conversation_projects`

## LLM Provider Abstraction

### Interface

```typescript
interface LLMProvider {
  createAgentStream(params: {
    systemPrompt: string
    messages: ConversationMessage[]
    tools: ToolDefinition[]
  }): AsyncGenerator<AgentEvent>
}

type AgentEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'done'; usage: { inputTokens: number; outputTokens: number } }
```

### Providers

**Anthropic (primary)**:
- `@anthropic-ai/sdk` with native `tool_use` content blocks
- Streaming via `client.messages.stream()`
- Env: `ANTHROPIC_API_KEY`

**OpenRouter (fallback)**:
- Raw `fetch` to `openrouter.ai/api/v1/chat/completions`
- OpenAI-format function calling, translated to common `AgentEvent` type
- Env: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`

### Selection

```typescript
function getProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) return new AnthropicProvider()
  if (process.env.OPENROUTER_API_KEY) return new OpenRouterProvider()
  throw new Error('No LLM provider configured')
}
```

Priority: Anthropic if key exists, else OpenRouter. No runtime switching.

### File Structure

```
src/lib/ai/
├── providers/
│   ├── types.ts          # LLMProvider interface, AgentEvent types
│   ├── anthropic.ts      # Anthropic SDK implementation
│   └── openrouter.ts     # OpenRouter fetch implementation
├── tools/
│   ├── definitions.ts    # Tool schemas (shared format, converted per-provider)
│   ├── read-tools.ts     # Server-side executors for read tools
│   └── write-tools.ts    # Proposal emitters for write tools
├── agent-loop.ts         # Core loop: stream → tool_use → execute/propose → continue
└── context-builder.ts    # Builds system prompt + project context
```

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cross-project scope | User-selected subset | Keeps context focused, avoids payload bloat |
| Confirmation UX | Diff-style cards | Clear current→proposed visualization |
| Agent capabilities | Assessments + tool mappings | Both server actions already exist |
| LLM backend | Anthropic primary, OpenRouter fallback | Native tool_use + open-source flexibility |
| Chat UX | Floating widget ↔ expandable sidebar | Quick questions + deep work modes |
| Conversation scope | Global list, project-tagged | Flexible for cross-project analysis |
| Architecture | Hybrid server reads + client confirmations | Real data access for reasoning, user control over mutations |
