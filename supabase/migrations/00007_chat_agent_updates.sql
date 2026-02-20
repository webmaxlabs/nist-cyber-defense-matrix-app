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
