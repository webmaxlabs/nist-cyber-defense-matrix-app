-- Performance indexes
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_archived ON projects(archived);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_cell_assessments_project ON cell_assessments(project_id);
CREATE INDEX idx_cell_assessments_cell ON cell_assessments(project_id, cell_row, cell_column);
CREATE INDEX idx_tool_mappings_project ON tool_mappings(project_id);
CREATE INDEX idx_tool_mappings_cell ON tool_mappings(project_id, cell_row, cell_column);
CREATE INDEX idx_tools_vendor ON tools(vendor_name);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_popularity ON tools(popularity_rank);
CREATE INDEX idx_comments_project ON comments(project_id);
CREATE INDEX idx_comments_cell ON comments(project_id, cell_row, cell_column);
CREATE INDEX idx_activity_log_project ON activity_log(project_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
CREATE INDEX idx_educational_content_cell ON educational_content(cell_row, cell_column);
CREATE INDEX idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
