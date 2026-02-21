'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  await admin.from('activity_log').insert({
    project_id: projectId,
    user_id: user?.id,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    description,
    metadata: metadata || {},
  })
}
