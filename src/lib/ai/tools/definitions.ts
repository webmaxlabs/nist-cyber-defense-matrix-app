import type { ToolDefinition } from '../providers/types'

export const READ_TOOLS: ToolDefinition[] = [
  {
    name: 'get_project_summary',
    description:
      'Get a high-level summary of a project including name, industry, company size, overall maturity score, coverage percentage, and last updated date.',
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
    description:
      'Get cell assessment data for a project. Returns maturity levels, justifications, and assessment dates. Can filter to a specific cell by providing cell_row and/or cell_column.',
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
    description:
      'Get security tools mapped to a project. Returns tool details, implementation status, effectiveness ratings, and which cells they cover. Can filter by cell.',
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
    description:
      'Analyze a project for security gaps. Returns: unassessed cells (no maturity level set), low-maturity cells (level 1-2), and cells with no tools mapped.',
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
    description:
      'Compare 2 or more projects side-by-side. Returns maturity scores per cell for each project, coverage deltas, and tool overlap.',
    input_schema: {
      type: 'object',
      properties: {
        project_ids: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 10,
          description: 'Array of project UUIDs to compare (max 10)',
        },
      },
      required: ['project_ids'],
    },
  },
  {
    name: 'search_tools',
    description:
      'Search the security tools catalog (100+ tools). Filter by keyword, category, cost range, or target cell. Returns tool name, description, coverage cells, cost, and popularity rank.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword (tool name, category, description)' },
        category: {
          type: 'string',
          description: 'Optional: filter by category (e.g. "Endpoint Security", "SIEM")',
        },
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
    description:
      'Propose updating a cell maturity assessment. This creates a confirmation tile for the user — the change is NOT applied until the user clicks Apply.',
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
        maturity_level: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          description: 'Target maturity level (1-5)',
        },
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
    description:
      'Propose removing a tool mapping from a cell. Creates a confirmation tile for the user.',
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
