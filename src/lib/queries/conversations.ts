import { createClient } from '@/lib/supabase/client'
import type { ChatConversation, ChatMessage } from '@/lib/supabase/types'

export interface ConversationWithProjects extends ChatConversation {
  projects: Array<{ project_id: string; project_name: string }>
}

export async function getConversations(): Promise<ConversationWithProjects[]> {
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
    projects: ((conv as unknown as { chat_conversation_projects: Array<{ project_id: string; projects: { name: string } }> }).chat_conversation_projects || []).map(
      (cp) => ({
        project_id: cp.project_id,
        project_name: cp.projects?.name || 'Unknown',
      })
    ),
  }))
}

export async function getConversationWithProjects(conversationId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (error) throw error

  // Get linked projects
  const { data: links } = await supabase
    .from('chat_conversation_projects')
    .select('project_id')
    .eq('conversation_id', conversationId)

  return {
    ...data,
    projectIds: (links || []).map((l: { project_id: string }) => l.project_id),
  }
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
