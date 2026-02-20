-- Security hardening: add missing RLS policies for chat tables

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations" ON chat_conversations
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Users can update messages in their own conversations (e.g., edit proposals)
CREATE POLICY "Users can update own conversation messages" ON chat_messages
  FOR UPDATE TO authenticated
  USING (conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = auth.uid()));
