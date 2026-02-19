-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Projects: members can access
CREATE POLICY "Project members can view projects" ON projects
  FOR SELECT TO authenticated
  USING (
    owner_id = auth.uid() OR
    id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Project owners can update" ON projects
  FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Project owners can delete" ON projects
  FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- Project members
CREATE POLICY "Members can view project members" ON project_members
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Project owners can manage members" ON project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid())
  );
CREATE POLICY "Project owners can update members" ON project_members
  FOR UPDATE TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));
CREATE POLICY "Project owners can remove members" ON project_members
  FOR DELETE TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()) OR user_id = auth.uid());

-- Cell assessments: project members can access
CREATE POLICY "Project members can view assessments" ON cell_assessments
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Project editors can create assessments" ON cell_assessments
  FOR INSERT TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );
CREATE POLICY "Project editors can update assessments" ON cell_assessments
  FOR UPDATE TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- Tools: globally readable
CREATE POLICY "Tools are publicly readable" ON tools
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create custom tools" ON tools
  FOR INSERT TO authenticated WITH CHECK (is_custom = true);

-- Tool mappings: project members
CREATE POLICY "Project members can view tool mappings" ON tool_mappings
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Project editors can create tool mappings" ON tool_mappings
  FOR INSERT TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );
CREATE POLICY "Project editors can update tool mappings" ON tool_mappings
  FOR UPDATE TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );
CREATE POLICY "Project editors can delete tool mappings" ON tool_mappings
  FOR DELETE TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

-- Comments
CREATE POLICY "Project members can view comments" ON comments
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Project members can create comments" ON comments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Activity log
CREATE POLICY "Project members can view activity" ON activity_log
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Authenticated users can create activity" ON activity_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- Educational content: public read
CREATE POLICY "Educational content is publicly readable" ON educational_content
  FOR SELECT USING (true);

-- Chat conversations: own only
CREATE POLICY "Users can view own conversations" ON chat_conversations
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create conversations" ON chat_conversations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own conversations" ON chat_conversations
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Chat messages: via conversation ownership
CREATE POLICY "Users can view own conversation messages" ON chat_messages
  FOR SELECT TO authenticated
  USING (conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can create messages in own conversations" ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = auth.uid()));
