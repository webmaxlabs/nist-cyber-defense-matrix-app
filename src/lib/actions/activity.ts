import { createClient } from '@/lib/supabase/client'
import type { ActionType, EntityType } from '@/lib/supabase/types'

export async function logActivity({
  projectId,
  actionType,
  entityType,
  entityId,
  description,
  metadata,
}: {
  projectId: string
  actionType: ActionType
  entityType: EntityType
  entityId?: string
  description?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  await supabase.from('activity_log').insert({
    project_id: projectId,
    user_id: session?.user?.id,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    description,
    metadata: metadata || {},
  })
}
