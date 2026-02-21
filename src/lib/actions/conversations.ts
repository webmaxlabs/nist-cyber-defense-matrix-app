'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ChatProposal } from '@/lib/supabase/types'

export async function updateProposalStatus(
  messageId: string,
  proposalId: string,
  status: 'applied' | 'dismissed' | 'error',
  errorMessage?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()

  const { data: message, error: fetchError } = await admin
    .from('chat_messages')
    .select('proposals')
    .eq('id', messageId)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const proposals: ChatProposal[] = (message?.proposals as ChatProposal[]) || []
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

  const { error } = await admin
    .from('chat_messages')
    .update({ proposals: updated })
    .eq('id', messageId)

  if (error) throw new Error(error.message)
}

export async function deleteConversation(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()
  const { error } = await admin
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()
  const { error } = await admin
    .from('chat_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}

export async function updateConversationProjects(
  conversationId: string,
  projectIds: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()

  const { error: deleteError } = await admin
    .from('chat_conversation_projects')
    .delete()
    .eq('conversation_id', conversationId)

  if (deleteError) throw new Error(deleteError.message)

  if (projectIds.length > 0) {
    const { error } = await admin
      .from('chat_conversation_projects')
      .insert(
        projectIds.map((pid) => ({
          conversation_id: conversationId,
          project_id: pid,
        }))
      )
    if (error) throw new Error(error.message)
  }
}
