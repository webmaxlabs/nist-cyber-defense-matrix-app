# AI Security Advisor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the ephemeral chat widget into a persistent, tool-calling AI agent that can query and modify the Cyber Defense Matrix with user confirmation.

**Architecture:** Hybrid — server-side agentic tool loop for reads (Supabase queries executed invisibly), client-side confirmation tiles for writes (proposals rendered as diff cards, mutations triggered by user click via existing server actions). Anthropic SDK as primary provider with OpenRouter fallback.

**Tech Stack:** Next.js 16.1.6, Anthropic SDK, Supabase, TanStack Query v5, Framer Motion 12, Zod v4

**Design Doc:** `docs/plans/2026-02-20-ai-agent-design.md`

---

## Phase 1: Foundation

### Task 1: Install Anthropic SDK

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `npm install @anthropic-ai/sdk`

**Step 2: Verify install**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk dependency"
```

---

### Task 2: Database Migration

**Files:**
- Create: `supabase/migrations/00007_chat_agent_updates.sql`

**Step 1: Write the migration**

```sql
-- Junction table for multi-project conversation tagging
CREATE TABLE chat_conversation_projects (
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, project_id)
);

-- Add proposals column to chat_messages for storing confirmation tile state
ALTER TABLE chat_messages ADD COLUMN proposals JSONB;

-- RLS for chat_conversation_projects
ALTER TABLE chat_conversation_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversation projects"
  ON chat_conversation_projects FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM chat_conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their conversation projects"
  ON chat_conversation_projects FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM chat_conversations WHERE user_id = auth.uid()
    )
  );

-- Index for fast lookup
CREATE INDEX idx_chat_conversation_projects_project
  ON chat_conversation_projects(project_id);
```

**Step 2: Verify SQL syntax**

Review the migration file. Cross-reference with existing tables in `00002_create_tables.sql` to confirm FK references match.

**Step 3: Update TypeScript types**

Modify `src/lib/supabase/types.ts` — add the new interface and update `ChatMessage`:

```typescript
// Add to ChatMessage interface:
export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  proposals: ChatProposal[] | null  // NEW
  created_at: string
}

// Add new interfaces:
export interface ChatProposal {
  id: string
  action: 'update_assessment' | 'add_tool_mapping' | 'remove_tool_mapping'
  params: Record<string, unknown>
  display: ChatProposalDisplay
  status: 'pending' | 'applied' | 'dismissed' | 'error'
  applied_at: string | null
  error_message: string | null
}

export interface ChatProposalDisplay {
  title: string
  cell_label: string | null
  current_value: string | null
  proposed_value: string | null
  tool_name: string | null
  detail: string | null
}

export interface ChatConversationProject {
  conversation_id: string
  project_id: string
}
```

**Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No type errors.

**Step 5: Commit**

```bash
git add supabase/migrations/00007_chat_agent_updates.sql src/lib/supabase/types.ts
git commit -m "feat: add chat agent DB migration and TypeScript types"
```

---

### Task 3: LLM Provider Types & Interface

**Files:**
- Create: `src/lib/ai/providers/types.ts`

**Step 1: Write the provider interface**

```typescript
export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  tool_calls?: ToolCall[]
  tool_results?: ToolResult[]
}

export interface ToolDefinition {
  name: string
  description: string
  input_schema: Record<string, unknown>  // JSON Schema
}

export interface ToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface ToolResult {
  tool_use_id: string
  content: string
  is_error?: boolean
}

export type AgentEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'done'; usage: { input_tokens: number; output_tokens: number } }
  | { type: 'error'; message: string }

export interface LLMProvider {
  createAgentStream(params: {
    systemPrompt: string
    messages: ConversationMessage[]
    tools: ToolDefinition[]
  }): AsyncGenerator<AgentEvent>
}

export interface AgentStreamParams {
  systemPrompt: string
  messages: ConversationMessage[]
  tools: ToolDefinition[]
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/providers/types.ts
git commit -m "feat: add LLM provider interface and agent event types"
```

---

## Phase 2: LLM Providers

### Task 4: Anthropic Provider

**Files:**
- Create: `src/lib/ai/providers/anthropic.ts`

**Step 1: Implement the provider**

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider, AgentEvent, AgentStreamParams, ToolDefinition } from './types'

function toAnthropicTools(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }))
}

function toAnthropicMessages(messages: AgentStreamParams['messages']) {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const content: Anthropic.ContentBlockParam[] = []

      if (m.content) {
        content.push({ type: 'text' as const, text: m.content })
      }

      if (m.tool_calls) {
        for (const tc of m.tool_calls) {
          content.push({
            type: 'tool_use' as const,
            id: tc.id,
            name: tc.name,
            input: tc.input,
          })
        }
      }

      if (m.tool_results) {
        for (const tr of m.tool_results) {
          content.push({
            type: 'tool_result' as const,
            tool_use_id: tr.tool_use_id,
            content: tr.content,
            is_error: tr.is_error,
          })
        }
      }

      return {
        role: m.role as 'user' | 'assistant',
        content,
      }
    })
}

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  }

  async *createAgentStream(params: AgentStreamParams): AsyncGenerator<AgentEvent> {
    const stream = this.client.messages.stream({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: params.systemPrompt,
      messages: toAnthropicMessages(params.messages),
      tools: toAnthropicTools(params.tools),
    })

    let inputTokens = 0
    let outputTokens = 0

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield { type: 'text', content: event.delta.text }
        }
      } else if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          // Tool use blocks arrive as start + deltas + stop.
          // We need to accumulate the JSON input from deltas.
          // The SDK handles this — we catch it at message_stop.
        }
      } else if (event.type === 'message_delta') {
        if (event.usage) {
          outputTokens = event.usage.output_tokens
        }
      } else if (event.type === 'message_start') {
        if (event.message.usage) {
          inputTokens = event.message.usage.input_tokens
        }
      }
    }

    // After stream ends, get the final message for any tool_use blocks
    const finalMessage = await stream.finalMessage()
    for (const block of finalMessage.content) {
      if (block.type === 'tool_use') {
        yield {
          type: 'tool_use',
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        }
      }
    }

    yield {
      type: 'done',
      usage: { input_tokens: inputTokens, output_tokens: outputTokens },
    }
  }
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors. (Will not run without `ANTHROPIC_API_KEY` — that's fine.)

**Step 3: Commit**

```bash
git add src/lib/ai/providers/anthropic.ts
git commit -m "feat: add Anthropic LLM provider with native tool_use streaming"
```

---

### Task 5: OpenRouter Provider

**Files:**
- Create: `src/lib/ai/providers/openrouter.ts`

**Step 1: Implement the provider**

Refactors the existing `fetch`-based OpenRouter logic from `src/app/api/chat/route.ts` into the provider interface. Maps OpenAI-format function calling to/from the common `AgentEvent` type.

```typescript
import type { LLMProvider, AgentEvent, AgentStreamParams, ToolDefinition } from './types'

function toOpenAITools(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }))
}

function toOpenAIMessages(systemPrompt: string, messages: AgentStreamParams['messages']) {
  const result: Array<Record<string, unknown>> = [
    { role: 'system', content: systemPrompt },
  ]

  for (const m of messages) {
    if (m.role === 'system') continue

    if (m.tool_results) {
      for (const tr of m.tool_results) {
        result.push({
          role: 'tool',
          tool_call_id: tr.tool_use_id,
          content: tr.content,
        })
      }
      continue
    }

    const msg: Record<string, unknown> = { role: m.role, content: m.content }

    if (m.tool_calls) {
      msg.tool_calls = m.tool_calls.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.name, arguments: JSON.stringify(tc.input) },
      }))
    }

    result.push(msg)
  }

  return result
}

export class OpenRouterProvider implements LLMProvider {
  async *createAgentStream(params: AgentStreamParams): AsyncGenerator<AgentEvent> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'DefenseMatrix',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4',
        messages: toOpenAIMessages(params.systemPrompt, params.messages),
        tools: toOpenAITools(params.tools),
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      yield { type: 'error', message: `OpenRouter API error: ${error}` }
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      yield { type: 'error', message: 'No response body' }
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''
    // Accumulate tool calls across stream chunks
    const toolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta

            if (delta?.content) {
              yield { type: 'text', content: delta.content }
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0
                if (!toolCalls.has(idx)) {
                  toolCalls.set(idx, { id: tc.id || '', name: tc.function?.name || '', arguments: '' })
                }
                const existing = toolCalls.get(idx)!
                if (tc.id) existing.id = tc.id
                if (tc.function?.name) existing.name = tc.function.name
                if (tc.function?.arguments) existing.arguments += tc.function.arguments
              }
            }

            // Check for usage in the final chunk
            if (parsed.usage) {
              // Will be emitted after tool calls
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    // Emit accumulated tool calls
    for (const [, tc] of toolCalls) {
      let input: Record<string, unknown> = {}
      try {
        input = JSON.parse(tc.arguments)
      } catch {
        // Malformed tool arguments
      }
      yield { type: 'tool_use', id: tc.id, name: tc.name, input }
    }

    yield { type: 'done', usage: { input_tokens: 0, output_tokens: 0 } }
  }
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/providers/openrouter.ts
git commit -m "feat: add OpenRouter LLM provider with function calling support"
```

---

### Task 6: Provider Factory

**Files:**
- Create: `src/lib/ai/providers/index.ts`

**Step 1: Write the factory**

```typescript
import type { LLMProvider } from './types'
import { AnthropicProvider } from './anthropic'
import { OpenRouterProvider } from './openrouter'

export function getProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider()
  }
  if (process.env.OPENROUTER_API_KEY) {
    return new OpenRouterProvider()
  }
  throw new Error(
    'No LLM provider configured. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY.'
  )
}

export type { LLMProvider, AgentEvent, AgentStreamParams, ToolDefinition, ConversationMessage, ToolCall, ToolResult } from './types'
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/providers/index.ts
git commit -m "feat: add LLM provider factory with Anthropic/OpenRouter selection"
```

---

## Phase 3: Agent Tools

### Task 7: Tool Definitions

**Files:**
- Create: `src/lib/ai/tools/definitions.ts`

**Step 1: Define all tool schemas**

Each tool gets a name, description, and JSON Schema for its input. These are passed to the LLM.

```typescript
import type { ToolDefinition } from '../providers/types'

export const READ_TOOLS: ToolDefinition[] = [
  {
    name: 'get_project_summary',
    description: 'Get a high-level summary of a project including name, industry, company size, overall maturity score, coverage percentage, and last updated date.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'get_assessments',
    description: 'Get cell assessment data for a project. Returns maturity levels, justifications, and assessment dates. Can filter to a specific cell by providing cell_row and/or cell_column.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
        cell_row: {
          type: 'string',
          enum: ['devices', 'applications', 'networks', 'data', 'users'],
          description: 'Optional: filter by asset class row',
        },
        cell_column: {
          type: 'string',
          enum: ['identify', 'protect', 'detect', 'respond', 'recover'],
          description: 'Optional: filter by NIST function column',
        },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'get_tool_mappings',
    description: 'Get security tools mapped to a project. Returns tool details, implementation status, effectiveness ratings, and which cells they cover. Can filter by cell.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
        cell_row: {
          type: 'string',
          enum: ['devices', 'applications', 'networks', 'data', 'users'],
          description: 'Optional: filter by asset class row',
        },
        cell_column: {
          type: 'string',
          enum: ['identify', 'protect', 'detect', 'respond', 'recover'],
          description: 'Optional: filter by NIST function column',
        },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'get_gap_analysis',
    description: 'Analyze a project for security gaps. Returns: unassessed cells (no maturity level set), low-maturity cells (level 1-2), and cells with no tools mapped.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
      },
      required: ['project_id'],
    },
  },
  {
    name: 'compare_projects',
    description: 'Compare 2 or more projects side-by-side. Returns maturity scores per cell for each project, coverage deltas, and tool overlap.',
    input_schema: {
      type: 'object',
      properties: {
        project_ids: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          description: 'Array of project UUIDs to compare',
        },
      },
      required: ['project_ids'],
    },
  },
  {
    name: 'search_tools',
    description: 'Search the security tools catalog (100+ tools). Filter by keyword, category, cost range, or target cell. Returns tool name, description, coverage cells, cost, and popularity rank.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword (tool name, category, description)' },
        category: { type: 'string', description: 'Optional: filter by category (e.g. "Endpoint Security", "SIEM")' },
        cost_range: {
          type: 'string',
          enum: ['free', 'low', 'medium', 'high', 'enterprise'],
          description: 'Optional: filter by cost range',
        },
        cell_row: {
          type: 'string',
          enum: ['devices', 'applications', 'networks', 'data', 'users'],
          description: 'Optional: filter tools that cover this asset class',
        },
        cell_column: {
          type: 'string',
          enum: ['identify', 'protect', 'detect', 'respond', 'recover'],
          description: 'Optional: filter tools that cover this NIST function',
        },
      },
      required: [],
    },
  },
]

export const WRITE_TOOLS: ToolDefinition[] = [
  {
    name: 'update_assessment',
    description: 'Propose updating a cell maturity assessment. This creates a confirmation tile for the user — the change is NOT applied until the user clicks Apply.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
        cell_row: {
          type: 'string',
          enum: ['devices', 'applications', 'networks', 'data', 'users'],
        },
        cell_column: {
          type: 'string',
          enum: ['identify', 'protect', 'detect', 'respond', 'recover'],
        },
        maturity_level: { type: 'number', minimum: 1, maximum: 5, description: 'Target maturity level (1-5)' },
        justification: { type: 'string', description: 'Reason for this maturity level' },
      },
      required: ['project_id', 'cell_row', 'cell_column', 'maturity_level', 'justification'],
    },
  },
  {
    name: 'add_tool_mapping',
    description: 'Propose mapping a security tool to a cell. Creates a confirmation tile for the user.',
    input_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'The UUID of the project' },
        tool_id: { type: 'string', description: 'The UUID of the tool from the catalog' },
        cell_row: {
          type: 'string',
          enum: ['devices', 'applications', 'networks', 'data', 'users'],
        },
        cell_column: {
          type: 'string',
          enum: ['identify', 'protect', 'detect', 'respond', 'recover'],
        },
        implementation_status: {
          type: 'string',
          enum: ['planned', 'in_progress', 'implemented', 'optimized'],
          description: 'Current implementation status',
        },
        notes: { type: 'string', description: 'Optional notes about the mapping' },
      },
      required: ['project_id', 'tool_id', 'cell_row', 'cell_column'],
    },
  },
  {
    name: 'remove_tool_mapping',
    description: 'Propose removing a tool mapping from a cell. Creates a confirmation tile for the user.',
    input_schema: {
      type: 'object',
      properties: {
        mapping_id: { type: 'string', description: 'The UUID of the tool mapping to remove' },
        project_id: { type: 'string', description: 'The UUID of the project' },
      },
      required: ['mapping_id', 'project_id'],
    },
  },
]

export const ALL_TOOLS = [...READ_TOOLS, ...WRITE_TOOLS]

export const WRITE_TOOL_NAMES = new Set(WRITE_TOOLS.map((t) => t.name))
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/tools/definitions.ts
git commit -m "feat: define agent tool schemas for read and write operations"
```

---

### Task 8: Read Tool Executors

**Files:**
- Create: `src/lib/ai/tools/read-tools.ts`

**Step 1: Implement server-side executors**

These run on the server inside the agentic loop. They use the server Supabase client (from `@/lib/supabase/server`) since they execute within a Next.js API route.

```typescript
import { createClient } from '@/lib/supabase/server'
import { ASSET_CLASSES, NIST_FUNCTIONS, ASSET_LABELS, NIST_LABELS, MATURITY_COLORS } from '@/lib/constants/matrix'
import { SECURITY_TOOLS } from '@/lib/data/security-tools'
import type { AssetClass, NistFunction } from '@/lib/supabase/types'

export async function executeReadTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'get_project_summary':
      return getProjectSummary(input.project_id as string)
    case 'get_assessments':
      return getAssessments(
        input.project_id as string,
        input.cell_row as AssetClass | undefined,
        input.cell_column as NistFunction | undefined
      )
    case 'get_tool_mappings':
      return getToolMappings(
        input.project_id as string,
        input.cell_row as AssetClass | undefined,
        input.cell_column as NistFunction | undefined
      )
    case 'get_gap_analysis':
      return getGapAnalysis(input.project_id as string)
    case 'compare_projects':
      return compareProjects(input.project_ids as string[])
    case 'search_tools':
      return searchToolsCatalog(input)
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` })
  }
}

async function getProjectSummary(projectId: string): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) return JSON.stringify({ error: error.message })

  return JSON.stringify({
    name: data.name,
    description: data.description,
    industry: data.industry,
    company_size: data.company_size,
    overall_score: data.overall_score,
    coverage_percentage: data.coverage_percentage,
    is_template: data.is_template,
    created_at: data.created_at,
    updated_at: data.updated_at,
  })
}

async function getAssessments(
  projectId: string,
  cellRow?: AssetClass,
  cellColumn?: NistFunction
): Promise<string> {
  const supabase = await createClient()
  let query = supabase
    .from('cell_assessments')
    .select('*')
    .eq('project_id', projectId)

  if (cellRow) query = query.eq('cell_row', cellRow)
  if (cellColumn) query = query.eq('cell_column', cellColumn)

  const { data, error } = await query
  if (error) return JSON.stringify({ error: error.message })

  const formatted = (data || []).map((a) => ({
    cell: `${ASSET_LABELS[a.cell_row as AssetClass]} / ${NIST_LABELS[a.cell_column as NistFunction]}`,
    cell_row: a.cell_row,
    cell_column: a.cell_column,
    maturity_level: a.maturity_level,
    maturity_label: MATURITY_COLORS[a.maturity_level]?.label || 'Unknown',
    justification: a.justification,
    last_assessment_date: a.last_assessment_date,
  }))

  return JSON.stringify({ assessments: formatted, count: formatted.length })
}

async function getToolMappings(
  projectId: string,
  cellRow?: AssetClass,
  cellColumn?: NistFunction
): Promise<string> {
  const supabase = await createClient()
  let query = supabase
    .from('tool_mappings')
    .select('*, tool:tools(*)')
    .eq('project_id', projectId)

  if (cellRow) query = query.eq('cell_row', cellRow)
  if (cellColumn) query = query.eq('cell_column', cellColumn)

  const { data, error } = await query
  if (error) return JSON.stringify({ error: error.message })

  const formatted = (data || []).map((m) => ({
    mapping_id: m.id,
    cell: `${ASSET_LABELS[m.cell_row as AssetClass]} / ${NIST_LABELS[m.cell_column as NistFunction]}`,
    cell_row: m.cell_row,
    cell_column: m.cell_column,
    tool_name: m.tool?.vendor_name || 'Unknown',
    tool_id: m.tool_id,
    tool_category: m.tool?.category,
    implementation_status: m.implementation_status,
    effectiveness_rating: m.effectiveness_rating,
    is_primary: m.is_primary,
    notes: m.notes,
  }))

  return JSON.stringify({ tool_mappings: formatted, count: formatted.length })
}

async function getGapAnalysis(projectId: string): Promise<string> {
  const supabase = await createClient()

  // Get all assessments
  const { data: assessments } = await supabase
    .from('cell_assessments')
    .select('cell_row, cell_column, maturity_level')
    .eq('project_id', projectId)

  // Get all tool mappings
  const { data: mappings } = await supabase
    .from('tool_mappings')
    .select('cell_row, cell_column')
    .eq('project_id', projectId)

  const assessedCells = new Set(
    (assessments || []).map((a) => `${a.cell_row}:${a.cell_column}`)
  )
  const mappedCells = new Set(
    (mappings || []).map((m) => `${m.cell_row}:${m.cell_column}`)
  )

  const unassessed: string[] = []
  const lowMaturity: Array<{ cell: string; level: number; label: string }> = []
  const noTools: string[] = []

  for (const row of ASSET_CLASSES) {
    for (const col of NIST_FUNCTIONS) {
      const key = `${row}:${col}`
      const label = `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`

      if (!assessedCells.has(key)) {
        unassessed.push(label)
      } else {
        const assessment = (assessments || []).find(
          (a) => a.cell_row === row && a.cell_column === col
        )
        if (assessment && assessment.maturity_level <= 2) {
          lowMaturity.push({
            cell: label,
            level: assessment.maturity_level,
            label: MATURITY_COLORS[assessment.maturity_level]?.label || 'Unknown',
          })
        }
      }

      if (!mappedCells.has(key)) {
        noTools.push(label)
      }
    }
  }

  return JSON.stringify({
    total_cells: 25,
    assessed_cells: assessedCells.size,
    unassessed_cells: unassessed,
    low_maturity_cells: lowMaturity,
    cells_without_tools: noTools,
  })
}

async function compareProjects(projectIds: string[]): Promise<string> {
  const supabase = await createClient()

  const results: Array<{
    project_id: string
    project_name: string
    overall_score: number
    coverage_percentage: number
    cells: Record<string, number>
  }> = []

  for (const id of projectIds) {
    const { data: project } = await supabase
      .from('projects')
      .select('name, overall_score, coverage_percentage')
      .eq('id', id)
      .single()

    const { data: assessments } = await supabase
      .from('cell_assessments')
      .select('cell_row, cell_column, maturity_level')
      .eq('project_id', id)

    const cells: Record<string, number> = {}
    for (const a of assessments || []) {
      cells[`${ASSET_LABELS[a.cell_row as AssetClass]} / ${NIST_LABELS[a.cell_column as NistFunction]}`] = a.maturity_level
    }

    results.push({
      project_id: id,
      project_name: project?.name || 'Unknown',
      overall_score: project?.overall_score || 0,
      coverage_percentage: project?.coverage_percentage || 0,
      cells,
    })
  }

  return JSON.stringify({ comparison: results })
}

function searchToolsCatalog(input: Record<string, unknown>): string {
  let results = [...SECURITY_TOOLS]

  const query = (input.query as string || '').toLowerCase()
  if (query) {
    results = results.filter(
      (t) =>
        t.vendorName.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.keyProducts.some((p) => p.toLowerCase().includes(query))
    )
  }

  if (input.category) {
    const cat = (input.category as string).toLowerCase()
    results = results.filter((t) => t.category.toLowerCase().includes(cat))
  }

  if (input.cost_range) {
    results = results.filter((t) => t.costRange === input.cost_range)
  }

  if (input.cell_row || input.cell_column) {
    results = results.filter((t) =>
      t.coverageCells.some(
        (c) =>
          (!input.cell_row || c.row === input.cell_row) &&
          (!input.cell_column || c.column === input.cell_column)
      )
    )
  }

  const formatted = results.slice(0, 15).map((t) => ({
    id: t.id,
    name: t.vendorName,
    category: t.category,
    description: t.description,
    key_products: t.keyProducts,
    coverage_cells: t.coverageCells.map(
      (c) => `${ASSET_LABELS[c.row]} / ${NIST_LABELS[c.column]}`
    ),
    cost_range: t.costRange,
    popularity_rank: t.popularityRank,
  }))

  return JSON.stringify({ tools: formatted, total_matches: results.length })
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/tools/read-tools.ts
git commit -m "feat: implement server-side read tool executors for agent"
```

---

### Task 9: Write Tool Proposal Emitters

**Files:**
- Create: `src/lib/ai/tools/write-tools.ts`

**Step 1: Implement proposal builders**

Write tools don't execute mutations. They build structured proposal objects that get emitted to the client as SSE events.

```typescript
import { createClient } from '@/lib/supabase/server'
import { ASSET_LABELS, NIST_LABELS, MATURITY_COLORS } from '@/lib/constants/matrix'
import type { AssetClass, NistFunction, ChatProposal, ChatProposalDisplay } from '@/lib/supabase/types'

export async function buildWriteProposal(
  name: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const id = `prop_${crypto.randomUUID().slice(0, 12)}`

  switch (name) {
    case 'update_assessment':
      return buildAssessmentProposal(id, input)
    case 'add_tool_mapping':
      return buildToolMappingProposal(id, input)
    case 'remove_tool_mapping':
      return buildRemoveToolMappingProposal(id, input)
    default:
      throw new Error(`Unknown write tool: ${name}`)
  }
}

async function buildAssessmentProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const row = input.cell_row as AssetClass
  const col = input.cell_column as NistFunction
  const newLevel = input.maturity_level as number
  const justification = input.justification as string

  // Look up current value
  const supabase = await createClient()
  const { data: current } = await supabase
    .from('cell_assessments')
    .select('maturity_level')
    .eq('project_id', input.project_id as string)
    .eq('cell_row', row)
    .eq('cell_column', col)
    .single()

  const currentLevel = current?.maturity_level ?? 0
  const currentLabel = MATURITY_COLORS[currentLevel]?.label || 'Not Assessed'
  const newLabel = MATURITY_COLORS[newLevel]?.label || 'Unknown'

  const display: ChatProposalDisplay = {
    title: 'Update Assessment',
    cell_label: `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`,
    current_value: `Level ${currentLevel} (${currentLabel})`,
    proposed_value: `Level ${newLevel} (${newLabel})`,
    tool_name: null,
    detail: justification,
  }

  return {
    id,
    action: 'update_assessment',
    params: {
      project_id: input.project_id,
      cell_row: row,
      cell_column: col,
      maturity_level: newLevel,
      justification,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}

async function buildToolMappingProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const row = input.cell_row as AssetClass
  const col = input.cell_column as NistFunction

  // Look up tool name
  const supabase = await createClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('vendor_name')
    .eq('id', input.tool_id as string)
    .single()

  const display: ChatProposalDisplay = {
    title: 'Add Tool Mapping',
    cell_label: `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`,
    current_value: null,
    proposed_value: input.implementation_status as string || 'planned',
    tool_name: tool?.vendor_name || 'Unknown Tool',
    detail: input.notes as string || null,
  }

  return {
    id,
    action: 'add_tool_mapping',
    params: {
      project_id: input.project_id,
      tool_id: input.tool_id,
      cell_row: row,
      cell_column: col,
      implementation_status: input.implementation_status || 'planned',
      notes: input.notes || null,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}

async function buildRemoveToolMappingProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const supabase = await createClient()
  const { data: mapping } = await supabase
    .from('tool_mappings')
    .select('*, tool:tools(vendor_name)')
    .eq('id', input.mapping_id as string)
    .single()

  const display: ChatProposalDisplay = {
    title: 'Remove Tool Mapping',
    cell_label: mapping
      ? `${ASSET_LABELS[mapping.cell_row as AssetClass]} / ${NIST_LABELS[mapping.cell_column as NistFunction]}`
      : null,
    current_value: mapping?.tool?.vendor_name || 'Unknown Tool',
    proposed_value: 'Remove',
    tool_name: mapping?.tool?.vendor_name || 'Unknown Tool',
    detail: null,
  }

  return {
    id,
    action: 'remove_tool_mapping',
    params: {
      mapping_id: input.mapping_id,
      project_id: input.project_id,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/tools/write-tools.ts
git commit -m "feat: implement write tool proposal emitters for confirmation tiles"
```

---

### Task 10: Context Builder

**Files:**
- Create: `src/lib/ai/context-builder.ts`

**Step 1: Implement the system prompt + context builder**

```typescript
import { createClient } from '@/lib/supabase/server'

const BASE_SYSTEM_PROMPT = `You are the DefenseMatrix AI Advisor, a knowledgeable cybersecurity consultant specializing in Sounil Yu's Cyber Defense Matrix framework.

Your expertise includes:
- The 5x5 Cyber Defense Matrix mapping 5 NIST CSF functions (Identify, Protect, Detect, Respond, Recover) against 5 asset classes (Devices, Applications, Networks, Data, Users)
- Maturity assessment (Levels 1-5: Initial, Developing, Defined, Managed, Optimized)
- Security tool selection and mapping across the matrix
- Gap analysis and prioritization
- Industry-specific security recommendations
- Security frameworks: NIST CSF, CIS Controls, ISO 27001, MITRE ATT&CK

When helping users:
- Use your tools to query actual project data before making recommendations
- Reference specific cells (e.g., "Devices / Detect")
- Suggest concrete tools from the catalog when recommending solutions
- When the user asks you to update the matrix, use the write tools to propose changes — they will see confirmation tiles they can accept or reject
- Be concise, practical, and data-driven
- Use markdown formatting for readability`

export async function buildSystemPrompt(projectIds: string[]): Promise<string> {
  if (projectIds.length === 0) {
    return BASE_SYSTEM_PROMPT + '\n\nNo projects are currently selected. Ask the user to select projects for context-aware assistance.'
  }

  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, industry, company_size')
    .in('id', projectIds)

  if (!projects || projects.length === 0) {
    return BASE_SYSTEM_PROMPT
  }

  const projectContext = projects.map((p) =>
    `- **${p.name}** (ID: ${p.id}) — Industry: ${p.industry || 'Not set'}, Size: ${p.company_size || 'Not set'}`
  ).join('\n')

  return `${BASE_SYSTEM_PROMPT}

## Active Projects

The user has selected the following projects for this conversation. Use the project IDs when calling tools.

${projectContext}`
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/context-builder.ts
git commit -m "feat: add context builder for agent system prompt"
```

---

## Phase 4: Agent Core

### Task 11: Agent Loop

**Files:**
- Create: `src/lib/ai/agent-loop.ts`

**Step 1: Implement the agentic loop**

This is the core. It streams from the LLM, handles tool calls (executing reads, emitting proposals for writes), and loops until the model stops calling tools.

```typescript
import { getProvider } from './providers'
import type { ConversationMessage, ToolCall } from './providers/types'
import { ALL_TOOLS, WRITE_TOOL_NAMES } from './tools/definitions'
import { executeReadTool } from './tools/read-tools'
import { buildWriteProposal } from './tools/write-tools'
import { buildSystemPrompt } from './context-builder'
import type { ChatProposal } from '@/lib/supabase/types'

const MAX_TOOL_ROUNDS = 10

export type StreamEvent =
  | { type: 'text'; content: string }
  | { type: 'proposal'; proposal: ChatProposal }
  | { type: 'done' }
  | { type: 'error'; message: string }

export async function* runAgentLoop(params: {
  messages: ConversationMessage[]
  projectIds: string[]
}): AsyncGenerator<StreamEvent> {
  const provider = getProvider()
  const systemPrompt = await buildSystemPrompt(params.projectIds)

  let messages = [...params.messages]
  let rounds = 0

  while (rounds < MAX_TOOL_ROUNDS) {
    rounds++

    const pendingToolCalls: ToolCall[] = []
    let hasText = false

    for await (const event of provider.createAgentStream({
      systemPrompt,
      messages,
      tools: ALL_TOOLS,
    })) {
      if (event.type === 'text') {
        hasText = true
        yield { type: 'text', content: event.content }
      } else if (event.type === 'tool_use') {
        pendingToolCalls.push({
          id: event.id,
          name: event.name,
          input: event.input,
        })
      } else if (event.type === 'error') {
        yield { type: 'error', message: event.message }
        return
      }
      // 'done' events from provider are handled after the loop
    }

    // No tool calls — model is done
    if (pendingToolCalls.length === 0) {
      break
    }

    // Process tool calls
    const toolResults: Array<{ tool_use_id: string; content: string; is_error?: boolean }> = []

    for (const tc of pendingToolCalls) {
      if (WRITE_TOOL_NAMES.has(tc.name)) {
        // Write tool — emit proposal, don't execute
        try {
          const proposal = await buildWriteProposal(tc.name, tc.input)
          yield { type: 'proposal', proposal }
          toolResults.push({
            tool_use_id: tc.id,
            content: `Confirmation tile shown to user for: ${proposal.display.title} — ${proposal.display.cell_label}. Awaiting user approval. Do not re-propose the same change.`,
          })
        } catch (err) {
          toolResults.push({
            tool_use_id: tc.id,
            content: `Error building proposal: ${(err as Error).message}`,
            is_error: true,
          })
        }
      } else {
        // Read tool — execute server-side
        try {
          const result = await executeReadTool(tc.name, tc.input)
          toolResults.push({
            tool_use_id: tc.id,
            content: result,
          })
        } catch (err) {
          toolResults.push({
            tool_use_id: tc.id,
            content: `Error: ${(err as Error).message}`,
            is_error: true,
          })
        }
      }
    }

    // Add assistant message with tool calls + tool results to conversation
    messages = [
      ...messages,
      {
        role: 'assistant' as const,
        content: '',
        tool_calls: pendingToolCalls,
      },
      {
        role: 'user' as const,
        content: '',
        tool_results: toolResults,
      },
    ]
  }

  yield { type: 'done' }
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/ai/agent-loop.ts
git commit -m "feat: implement agentic tool-calling loop with read/write dispatch"
```

---

### Task 12: Rewrite API Route

**Files:**
- Modify: `src/app/api/chat/route.ts` (full rewrite)

**Step 1: Rewrite the route to use the agent loop**

Replace the current simple OpenRouter streaming with the new agentic loop. The route now:
1. Authenticates the user
2. Runs the agent loop
3. Streams `text` and `proposal` events as SSE to the client
4. Saves messages to Supabase on completion

```typescript
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runAgentLoop } from '@/lib/ai/agent-loop'
import type { ConversationMessage } from '@/lib/ai/providers/types'
import type { ChatProposal } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()
  const {
    messages,
    conversationId,
    projectIds = [],
  }: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    conversationId: string | null
    projectIds: string[]
  } = body

  // Convert to ConversationMessage format
  const agentMessages: ConversationMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const encoder = new TextEncoder()
  const proposals: ChatProposal[] = []
  let fullText = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runAgentLoop({
          messages: agentMessages,
          projectIds,
        })) {
          if (event.type === 'text') {
            fullText += event.content
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: event.content })}\n\n`)
            )
          } else if (event.type === 'proposal') {
            proposals.push(event.proposal)
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'proposal', proposal: event.proposal })}\n\n`)
            )
          } else if (event.type === 'error') {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', message: event.message })}\n\n`)
            )
          } else if (event.type === 'done') {
            // Save messages to database
            try {
              await saveMessages(supabase, {
                conversationId,
                userId: user.id,
                projectIds,
                userMessage: messages[messages.length - 1]?.content || '',
                assistantMessage: fullText,
                proposals: proposals.length > 0 ? proposals : null,
              })
            } catch (err) {
              console.error('Failed to save messages:', err)
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: (err as Error).message })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function saveMessages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  params: {
    conversationId: string | null
    userId: string
    projectIds: string[]
    userMessage: string
    assistantMessage: string
    proposals: ChatProposal[] | null
  }
) {
  let convId = params.conversationId

  // Create conversation if needed
  if (!convId) {
    const { data: conv, error } = await supabase
      .from('chat_conversations')
      .insert({ user_id: params.userId })
      .select()
      .single()

    if (error) throw error
    convId = conv.id

    // Link projects
    if (params.projectIds.length > 0) {
      await supabase.from('chat_conversation_projects').insert(
        params.projectIds.map((pid) => ({
          conversation_id: convId!,
          project_id: pid,
        }))
      )
    }
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    conversation_id: convId,
    role: 'user',
    content: params.userMessage,
  })

  // Save assistant message with proposals
  await supabase.from('chat_messages').insert({
    conversation_id: convId,
    role: 'assistant',
    content: params.assistantMessage,
    proposals: params.proposals,
  })

  return convId
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build.

**Step 4: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: rewrite chat API route with agentic tool-calling loop"
```

---

## Phase 5: Conversation Persistence

### Task 13: Conversation Queries & Actions

**Files:**
- Create: `src/lib/queries/conversations.ts`
- Create: `src/lib/actions/conversations.ts`
- Create: `src/lib/hooks/use-conversations.ts`

**Step 1: Write queries**

```typescript
// src/lib/queries/conversations.ts
import { createClient } from '@/lib/supabase/client'
import type { ChatConversation, ChatMessage } from '@/lib/supabase/types'

export async function getConversations(): Promise<
  (ChatConversation & { projects: Array<{ project_id: string; project_name: string }> })[]
> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_conversations')
    .select(`
      *,
      chat_conversation_projects(
        project_id,
        projects(name)
      )
    `)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error) throw error

  return (data || []).map((conv) => ({
    ...conv,
    projects: (conv.chat_conversation_projects || []).map((cp: { project_id: string; projects: { name: string } }) => ({
      project_id: cp.project_id,
      project_name: cp.projects?.name || 'Unknown',
    })),
  }))
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}
```

**Step 2: Write actions**

```typescript
// src/lib/actions/conversations.ts
import { createClient } from '@/lib/supabase/client'
import type { ChatProposal } from '@/lib/supabase/types'

export async function updateProposalStatus(
  messageId: string,
  proposalId: string,
  status: 'applied' | 'dismissed' | 'error',
  errorMessage?: string
) {
  const supabase = createClient()

  // Fetch current proposals
  const { data: message, error: fetchError } = await supabase
    .from('chat_messages')
    .select('proposals')
    .eq('id', messageId)
    .single()

  if (fetchError) throw fetchError

  const proposals: ChatProposal[] = message?.proposals || []
  const updated = proposals.map((p) =>
    p.id === proposalId
      ? {
          ...p,
          status,
          applied_at: status === 'applied' ? new Date().toISOString() : p.applied_at,
          error_message: errorMessage || p.error_message,
        }
      : p
  )

  const { error } = await supabase
    .from('chat_messages')
    .update({ proposals: updated })
    .eq('id', messageId)

  if (error) throw error
}

export async function deleteConversation(conversationId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId)

  if (error) throw error
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('chat_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  if (error) throw error
}

export async function updateConversationProjects(
  conversationId: string,
  projectIds: string[]
) {
  const supabase = createClient()

  // Delete existing links
  await supabase
    .from('chat_conversation_projects')
    .delete()
    .eq('conversation_id', conversationId)

  // Insert new links
  if (projectIds.length > 0) {
    const { error } = await supabase
      .from('chat_conversation_projects')
      .insert(
        projectIds.map((pid) => ({
          conversation_id: conversationId,
          project_id: pid,
        }))
      )
    if (error) throw error
  }
}
```

**Step 3: Write hook**

```typescript
// src/lib/hooks/use-conversations.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConversations, getConversationMessages } from '@/lib/queries/conversations'
import { deleteConversation, updateConversationTitle } from '@/lib/actions/conversations'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useUpdateConversationTitle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateConversationTitle(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
```

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Commit**

```bash
git add src/lib/queries/conversations.ts src/lib/actions/conversations.ts src/lib/hooks/use-conversations.ts
git commit -m "feat: add conversation persistence queries, actions, and hooks"
```

---

### Task 14: Rewrite useChat Hook

**Files:**
- Modify: `src/lib/hooks/use-chat.ts` (full rewrite)

**Step 1: Rewrite with new SSE protocol and persistence**

The hook now:
- Handles both `text` and `proposal` SSE events
- Tracks proposals per message
- Sends `conversationId` and `projectIds` to the API
- Returns proposals for tile rendering

```typescript
'use client'

import { useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ChatProposal } from '@/lib/supabase/types'

export interface ChatMessageWithProposals {
  id: string
  role: 'user' | 'assistant'
  content: string
  proposals: ChatProposal[]
  db_message_id?: string  // For updating proposal status in DB
}

interface UseChatOptions {
  conversationId: string | null
  projectIds: string[]
  onConversationCreated?: (id: string) => void
}

export function useChat({ conversationId, projectIds, onConversationCreated }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessageWithProposals[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const queryClient = useQueryClient()

  const loadMessages = useCallback((
    dbMessages: Array<{ id: string; role: string; content: string; proposals: ChatProposal[] | null }>
  ) => {
    setMessages(
      dbMessages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          proposals: m.proposals || [],
          db_message_id: m.id,
        }))
    )
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessageWithProposals = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      proposals: [],
    }

    const assistantMessage: ChatMessageWithProposals = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      proposals: [],
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

    try {
      abortRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId,
          projectIds,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) throw new Error('Chat request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') {
            // Invalidate conversations list to pick up new/updated conversation
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
            continue
          }

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'text' && parsed.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              )
            } else if (parsed.type === 'proposal' && parsed.proposal) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, proposals: [...m.proposals, parsed.proposal] }
                    : m
                )
              )
            } else if (parsed.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + `\n\n*Error: ${parsed.message}*` }
                    : m
                )
              )
            } else if (parsed.conversationId && onConversationCreated) {
              // Server sends back the conversation ID after creation
              onConversationCreated(parsed.conversationId)
            }
          } catch {
            // Skip malformed
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
              : m
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, conversationId, projectIds, onConversationCreated, queryClient])

  const updateProposalLocally = useCallback((messageId: string, proposalId: string, status: ChatProposal['status']) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId || m.db_message_id === messageId
          ? {
              ...m,
              proposals: m.proposals.map((p) =>
                p.id === proposalId
                  ? { ...p, status, applied_at: status === 'applied' ? new Date().toISOString() : p.applied_at }
                  : p
              ),
            }
          : m
      )
    )
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    loadMessages,
    clearMessages,
    stopGeneration,
    updateProposalLocally,
  }
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/hooks/use-chat.ts
git commit -m "feat: rewrite useChat hook with proposal handling and persistence"
```

---

## Phase 6: Confirmation Tiles

### Task 15: ConfirmationTile Component

**Files:**
- Create: `src/components/chat/confirmation-tile.tsx`

**Step 1: Build the tile component**

Renders inline within assistant messages. Handles pending/applied/dismissed/error states. On apply, calls existing server actions and invalidates TanStack Query cache.

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Zap, Wrench, Trash2, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { upsertAssessment } from '@/lib/actions/assessments'
import { addToolMapping, removeToolMapping } from '@/lib/actions/tool-mappings'
import { updateProposalStatus } from '@/lib/actions/conversations'
import type { ChatProposal } from '@/lib/supabase/types'
import type { CellAssessmentInput, ToolMappingInput } from '@/lib/validators/assessment'

interface ConfirmationTileProps {
  proposal: ChatProposal
  messageId: string
  onStatusChange: (proposalId: string, status: ChatProposal['status']) => void
}

const ACTION_ICONS = {
  update_assessment: Zap,
  add_tool_mapping: Wrench,
  remove_tool_mapping: Trash2,
}

const STATUS_STYLES = {
  pending: 'border-cyan-500/30 bg-cyan-500/5',
  applied: 'border-emerald-500/30 bg-emerald-500/5',
  dismissed: 'border-slate-500/20 bg-slate-500/5 opacity-60',
  error: 'border-red-500/30 bg-red-500/5',
}

export function ConfirmationTile({ proposal, messageId, onStatusChange }: ConfirmationTileProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const Icon = ACTION_ICONS[proposal.action] || Zap
  const { display } = proposal

  async function handleApply() {
    setLoading(true)
    setError(null)

    try {
      // Execute the mutation via existing server actions
      if (proposal.action === 'update_assessment') {
        await upsertAssessment(proposal.params as unknown as CellAssessmentInput)
      } else if (proposal.action === 'add_tool_mapping') {
        await addToolMapping(proposal.params as unknown as ToolMappingInput)
      } else if (proposal.action === 'remove_tool_mapping') {
        await removeToolMapping(
          proposal.params.mapping_id as string,
          proposal.params.project_id as string
        )
      }

      // Update proposal status in DB
      if (messageId) {
        await updateProposalStatus(messageId, proposal.id, 'applied').catch(() => {
          // Non-critical — local state already updated
        })
      }

      // Invalidate relevant queries so matrix UI updates
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['tool-mappings'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      onStatusChange(proposal.id, 'applied')
    } catch (err) {
      const msg = (err as Error).message || 'Failed to apply change'
      setError(msg)
      onStatusChange(proposal.id, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDismiss() {
    if (messageId) {
      await updateProposalStatus(messageId, proposal.id, 'dismissed').catch(() => {})
    }
    onStatusChange(proposal.id, 'dismissed')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 my-2 transition-colors ${STATUS_STYLES[proposal.status]}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
          {proposal.status === 'applied' ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Icon className="h-3 w-3 text-cyan-400" />
          )}
        </div>
        <span className="text-xs font-display font-semibold text-foreground">
          {display.title}
        </span>
        {proposal.status === 'applied' && (
          <span className="text-xs text-emerald-400 ml-auto">Applied</span>
        )}
        {proposal.status === 'dismissed' && (
          <span className="text-xs text-slate-500 ml-auto">Dismissed</span>
        )}
      </div>

      {/* Cell label */}
      {display.cell_label && (
        <p className="text-sm font-medium text-foreground mb-1">{display.cell_label}</p>
      )}

      {/* Diff: current → proposed */}
      {display.current_value && display.proposed_value && proposal.action === 'update_assessment' && (
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">{display.current_value}</span>
          <span className="text-slate-500">→</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{display.proposed_value}</span>
        </div>
      )}

      {/* Tool mapping info */}
      {display.tool_name && proposal.action !== 'update_assessment' && (
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="font-medium text-foreground">{display.tool_name}</span>
          {display.proposed_value && proposal.action === 'add_tool_mapping' && (
            <>
              <span className="text-slate-500">→</span>
              <span className="text-slate-600 dark:text-slate-400">Status: {display.proposed_value}</span>
            </>
          )}
          {proposal.action === 'remove_tool_mapping' && (
            <span className="text-red-400">→ Remove</span>
          )}
        </div>
      )}

      {/* Justification / detail */}
      {display.detail && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
          &ldquo;{display.detail}&rdquo;
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}

      {/* Actions */}
      {proposal.status === 'pending' && (
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            className="h-7 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Check className="h-3 w-3 mr-1" />
            )}
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-slate-500 hover:text-slate-300"
            onClick={handleDismiss}
            disabled={loading}
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss
          </Button>
        </div>
      )}

      {/* Retry on error */}
      {proposal.status === 'error' && (
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            className="h-7 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            onClick={handleApply}
            disabled={loading}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </motion.div>
  )
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/chat/confirmation-tile.tsx
git commit -m "feat: add ConfirmationTile component for agent mutation proposals"
```

---

### Task 16: Integrate Tiles into Chat Messages

**Files:**
- Modify: `src/components/chat/chat-message.tsx`

**Step 1: Update ChatMessage to render proposals**

Add a `proposals` prop and render `ConfirmationTile` components after the message content.

Import `ConfirmationTile` and `ChatProposal` type. Add `proposals` and `messageId` and `onProposalStatusChange` to the props. After the markdown content, map over proposals and render a tile for each.

Refer to the current `chat-message.tsx` structure — it renders a `ReactMarkdown` block with `remark-gfm`. The proposals should render below the markdown, inside the same message bubble.

**Step 2: Verify in dev server**

Run: `npm run dev`
Navigate to the dashboard, open the chat, send a message. If the agent returns proposals, they should render as tiles.

**Step 3: Commit**

```bash
git add src/components/chat/chat-message.tsx
git commit -m "feat: render confirmation tiles inline in chat messages"
```

---

## Phase 7: Chat UX — Sidebar

### Task 17: Chat State Provider

**Files:**
- Create: `src/providers/chat-provider.tsx`

**Step 1: Create the chat state context**

Manages: open/closed, widget/sidebar mode, active conversation, selected projects. Persists mode to localStorage.

```typescript
'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type ChatMode = 'widget' | 'sidebar'

interface ChatContextType {
  isOpen: boolean
  mode: ChatMode
  activeConversationId: string | null
  selectedProjectIds: string[]
  openWidget: () => void
  openSidebar: () => void
  close: () => void
  toggleMode: () => void
  setActiveConversation: (id: string | null) => void
  setSelectedProjects: (ids: string[]) => void
  newConversation: () => void
}

const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  mode: 'widget',
  activeConversationId: null,
  selectedProjectIds: [],
  openWidget: () => {},
  openSidebar: () => {},
  close: () => {},
  toggleMode: () => {},
  setActiveConversation: () => {},
  setSelectedProjects: () => {},
  newConversation: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('widget')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])

  // Restore mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dm-chat-mode')
    if (saved === 'widget' || saved === 'sidebar') {
      setMode(saved)
    }
  }, [])

  const openWidget = useCallback(() => {
    setIsOpen(true)
    setMode('widget')
    localStorage.setItem('dm-chat-mode', 'widget')
  }, [])

  const openSidebar = useCallback(() => {
    setIsOpen(true)
    setMode('sidebar')
    localStorage.setItem('dm-chat-mode', 'sidebar')
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleMode = useCallback(() => {
    const next = mode === 'widget' ? 'sidebar' : 'widget'
    setMode(next)
    localStorage.setItem('dm-chat-mode', next)
  }, [mode])

  const newConversation = useCallback(() => {
    setActiveConversationId(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        mode,
        activeConversationId,
        selectedProjectIds,
        openWidget,
        openSidebar,
        close,
        toggleMode,
        setActiveConversation: setActiveConversationId,
        setSelectedProjects: setSelectedProjectIds,
        newConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
```

**Step 2: Wire into providers**

Add `<ChatProvider>` to the dashboard layout or the root providers. It should wrap the dashboard layout's children.

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/providers/chat-provider.tsx
git commit -m "feat: add ChatProvider for widget/sidebar state management"
```

---

### Task 18: ChatSidebar Component

**Files:**
- Create: `src/components/chat/chat-sidebar.tsx`

**Step 1: Build the sidebar shell**

Full-height sidebar with three sections: project selector, conversation list, and active chat. Uses `useChatContext` for state, `useConversations` for history, and the existing `ChatPanel` content for the chat area.

The sidebar should:
- Be 420px wide, fixed to the right side
- Have a header with collapse button, "AI Advisor" title, and new chat button
- Project selector section with badges for selected projects and an edit button
- Scrollable conversation list grouped by date
- The active chat area (messages + input) reusing existing components
- Smooth slide-in animation with Framer Motion

**Step 2: Verify in dev server**

Run: `npm run dev`
Open sidebar mode, verify layout.

**Step 3: Commit**

```bash
git add src/components/chat/chat-sidebar.tsx
git commit -m "feat: add ChatSidebar component with project selector and conversation list"
```

---

### Task 19: Project Selector

**Files:**
- Create: `src/components/chat/project-selector.tsx`

**Step 1: Build the project selector**

Shown at the top of the sidebar. Displays selected project badges (removable). Edit button opens a dropdown/popover listing all user projects with checkboxes. Changes update `selectedProjectIds` via `useChatContext`.

Uses `useProjects()` hook for the project list. Uses `useChatContext` for `selectedProjectIds` and `setSelectedProjects`.

**Step 2: Verify in dev server**

**Step 3: Commit**

```bash
git add src/components/chat/project-selector.tsx
git commit -m "feat: add project selector for chat agent context"
```

---

### Task 20: Conversation List

**Files:**
- Create: `src/components/chat/conversation-list.tsx`

**Step 1: Build the conversation list**

Scrollable list in the sidebar showing recent conversations grouped by date (Today, Yesterday, Previous 7 Days, Older). Each item shows:
- Title (or "New conversation" if null)
- Project badges (small colored dots)
- Relative timestamp

Click loads the conversation. Active conversation is highlighted. Uses `useConversations()` hook and `useChatContext`.

**Step 2: Verify in dev server**

**Step 3: Commit**

```bash
git add src/components/chat/conversation-list.tsx
git commit -m "feat: add conversation list component for chat sidebar"
```

---

### Task 21: Dashboard Layout Integration

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `src/components/chat/chat-widget.tsx`

**Step 1: Update dashboard layout**

Wrap with `ChatProvider`. Add sidebar conditionally. Main content gets margin when sidebar is open.

```typescript
import { TopNav } from '@/components/layout/top-nav'
import { ChatWidget } from '@/components/chat/chat-widget'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { ChatProvider } from '@/providers/chat-provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <TopNav />
      <DashboardContent>{children}</DashboardContent>
    </ChatProvider>
  )
}
```

Need a client component wrapper (`DashboardContent`) that reads `useChatContext` to apply the margin and conditionally render the sidebar.

**Step 2: Update ChatWidget**

Refactor to use `useChatContext` instead of local state. The widget button opens in widget mode. Add an "expand" button to the panel header that switches to sidebar mode via `toggleMode()`.

**Step 3: Verify in dev server**

Run: `npm run dev`
Test: Widget mode → Sidebar mode → back. Verify main content reflows.

**Step 4: Verify build**

Run: `npm run build`
Expected: Clean build.

**Step 5: Commit**

```bash
git add src/app/(dashboard)/layout.tsx src/components/chat/chat-widget.tsx
git commit -m "feat: integrate chat sidebar into dashboard layout with widget/sidebar toggle"
```

---

### Task 22: Update ChatPanel for Agent Integration

**Files:**
- Modify: `src/components/chat/chat-panel.tsx`

**Step 1: Connect ChatPanel to the new useChat hook**

Update `ChatPanel` to:
- Accept `conversationId`, `projectIds`, and `onConversationCreated` props
- Use the updated `useChat` hook with these params
- Pass `proposals` and `onProposalStatusChange` to `ChatMessage` components
- Load existing messages when opening a saved conversation via `useConversationMessages`

**Step 2: Verify in dev server**

Test the full flow:
1. Open chat
2. Send a message
3. Agent queries data and responds
4. If agent proposes a change, confirmation tile appears
5. Click Apply — tile goes green, matrix data updates

**Step 3: Commit**

```bash
git add src/components/chat/chat-panel.tsx
git commit -m "feat: connect ChatPanel to agent hooks with conversation loading"
```

---

## Phase 8: Final Integration

### Task 23: End-to-End Verification

**Step 1: Verify build**

Run: `npm run build`
Expected: Clean build, zero errors.

**Step 2: Manual test flow in dev server**

Run: `npm run dev`

Test cases:
1. **Basic chat**: Open widget, send "What is the Cyber Defense Matrix?" — should get a streaming text response
2. **Project context**: Select a project in sidebar, ask "What are the gaps in this project?" — agent should call `get_gap_analysis` and return real data
3. **Write proposal**: Ask "Set Devices/Detect to level 3 because we deployed EDR" — should see a confirmation tile with diff
4. **Apply change**: Click Apply on tile — tile turns green, relevant data refreshes
5. **Dismiss change**: Ask for another update, click Dismiss — tile fades out
6. **Conversation persistence**: Close chat, reopen — previous conversation loads with tiles in their final states
7. **Sidebar mode**: Expand to sidebar, verify conversation list, project selector, main content reflow
8. **Widget mode**: Collapse back to widget, verify it works
9. **Cross-project**: Select multiple projects, ask "Compare these projects" — agent calls `compare_projects`
10. **Tool search**: Ask "What tools help with network detection?" — agent calls `search_tools`

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete AI Security Advisor agent integration"
```

---

## Summary

| Phase | Tasks | What it builds |
|-------|-------|----------------|
| 1. Foundation | 1-3 | SDK install, DB migration, provider types |
| 2. LLM Providers | 4-6 | Anthropic + OpenRouter providers, factory |
| 3. Agent Tools | 7-10 | Tool schemas, read executors, write emitters, context builder |
| 4. Agent Core | 11-12 | Agentic loop, API route rewrite |
| 5. Persistence | 13-14 | Conversation CRUD, useChat rewrite |
| 6. Confirmation Tiles | 15-16 | Tile component, message integration |
| 7. Sidebar UX | 17-22 | State provider, sidebar, project selector, conversation list, layout |
| 8. Final | 23 | End-to-end verification |

**Total: 23 tasks across 8 phases.**
