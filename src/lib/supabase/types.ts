export type AssetClass = 'devices' | 'applications' | 'networks' | 'data' | 'users'
export type NistFunction = 'identify' | 'protect' | 'detect' | 'respond' | 'recover'
export type ProjectRole = 'owner' | 'editor' | 'viewer'
export type ImplementationStatus = 'planned' | 'in_progress' | 'implemented' | 'optimized'
export type ActionType = 'created' | 'updated' | 'deleted' | 'assessed' | 'mapped_tool' | 'unmapped_tool' | 'invited' | 'commented'
export type EntityType = 'project' | 'assessment' | 'tool_mapping' | 'comment' | 'member'
export type ContentType = 'overview' | 'best_practice' | 'example' | 'resource'
export type CostRange = 'free' | 'low' | 'medium' | 'high' | 'enterprise'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  industry: string | null
  company_size: string | null
  overall_score: number
  coverage_percentage: number
  is_template: boolean
  archived: boolean
  created_at: string
  updated_at: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: ProjectRole
  invited_by: string | null
  created_at: string
}

export interface CellAssessment {
  id: string
  project_id: string
  cell_row: AssetClass
  cell_column: NistFunction
  maturity_level: number
  justification: string | null
  assessed_by: string | null
  last_assessment_date: string
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  vendor_name: string
  product_name: string | null
  category: string | null
  description: string | null
  website_url: string | null
  logo_url: string | null
  cost_range: CostRange
  is_custom: boolean
  coverage_cells: Array<{ row: AssetClass; column: NistFunction }>
  popularity_rank: number
  key_products: string[]
  created_at: string
  updated_at: string
}

export interface ToolMapping {
  id: string
  project_id: string
  tool_id: string
  cell_row: AssetClass
  cell_column: NistFunction
  is_primary: boolean
  implementation_status: ImplementationStatus
  effectiveness_rating: number | null
  notes: string | null
  added_by: string | null
  created_at: string
  updated_at: string
  tool?: Tool
}

export interface Comment {
  id: string
  project_id: string
  cell_row: AssetClass | null
  cell_column: NistFunction | null
  user_id: string
  content: string
  parent_comment_id: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface ActivityLogEntry {
  id: string
  project_id: string
  user_id: string | null
  action_type: ActionType
  entity_type: EntityType
  entity_id: string | null
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
  profile?: Profile
}

export interface EducationalContent {
  id: string
  cell_row: AssetClass | null
  cell_column: NistFunction | null
  content_type: ContentType
  title: string
  content: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ChatConversation {
  id: string
  user_id: string
  project_id: string | null
  title: string | null
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  proposals: ChatProposal[] | null
  created_at: string
}

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
