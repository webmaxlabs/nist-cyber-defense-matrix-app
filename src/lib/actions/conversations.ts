import { createClient } from '@/lib/supabase/client'
import type { ChatProposal } from '@/lib/supabase/types'

export async function updateProposalStatus(
  messageId: string,
  proposalId: string,
  status: 'applied' | 'dismissed' | 'error',
  errorMessage?: string
) {
  const supabase = createClient()

  const { data: message, error: fetchError } = await supabase
    .from('chat_messages')
    .select('proposals')
    .eq('id', messageId)
    .single()

  if (fetchError) throw fetchError

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

  await supabase
    .from('chat_conversation_projects')
    .delete()
    .eq('conversation_id', conversationId)

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
