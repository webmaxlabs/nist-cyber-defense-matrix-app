-- Fix infinite recursion in RLS policies.
-- projects SELECT policy → queries project_members → project_members SELECT policy
-- → queries projects → projects SELECT policy → infinite loop.
--
-- Solution: SECURITY DEFINER helper functions that bypass RLS when checking
-- project membership, breaking the circular dependency.

-- Helper: check if current user has any access to a project (owner or member)
CREATE OR REPLACE FUNCTION public.user_has_project_access(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects WHERE id = p_project_id AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.project_members WHERE project_id = p_project_id AND user_id = auth.uid()
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if current user has edit access (owner or editor role)
CREATE OR REPLACE FUNCTION public.user_has_project_edit_access(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects WHERE id = p_project_id AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id AND user_id = auth.uid() AND role IN ('owner', 'editor')
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── projects ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Project members can view projects" ON projects;
CREATE POLICY "Project members can view projects" ON projects
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(id));

-- INSERT/UPDATE/DELETE only check owner_id = auth.uid(), no recursion — leave as-is.

-- ── project_members ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members can view project members" ON project_members;
CREATE POLICY "Members can view project members" ON project_members
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Project owners can manage members" ON project_members;
CREATE POLICY "Project owners can manage members" ON project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Project owners can update members" ON project_members;
CREATE POLICY "Project owners can update members" ON project_members
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid()));

DROP POLICY IF EXISTS "Project owners can remove members" ON project_members;
CREATE POLICY "Project owners can remove members" ON project_members
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND owner_id = auth.uid())
    OR user_id = auth.uid()
  );

-- ── cell_assessments ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Project members can view assessments" ON cell_assessments;
CREATE POLICY "Project members can view assessments" ON cell_assessments
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Project editors can create assessments" ON cell_assessments;
CREATE POLICY "Project editors can create assessments" ON cell_assessments
  FOR INSERT TO authenticated
  WITH CHECK (public.user_has_project_edit_access(project_id));

DROP POLICY IF EXISTS "Project editors can update assessments" ON cell_assessments;
CREATE POLICY "Project editors can update assessments" ON cell_assessments
  FOR UPDATE TO authenticated
  USING (public.user_has_project_edit_access(project_id));

-- ── tool_mappings ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Project members can view tool mappings" ON tool_mappings;
CREATE POLICY "Project members can view tool mappings" ON tool_mappings
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

DROP POLICY IF EXISTS "Project editors can create tool mappings" ON tool_mappings;
CREATE POLICY "Project editors can create tool mappings" ON tool_mappings
  FOR INSERT TO authenticated
  WITH CHECK (public.user_has_project_edit_access(project_id));

DROP POLICY IF EXISTS "Project editors can update tool mappings" ON tool_mappings;
CREATE POLICY "Project editors can update tool mappings" ON tool_mappings
  FOR UPDATE TO authenticated
  USING (public.user_has_project_edit_access(project_id));

DROP POLICY IF EXISTS "Project editors can delete tool mappings" ON tool_mappings;
CREATE POLICY "Project editors can delete tool mappings" ON tool_mappings
  FOR DELETE TO authenticated
  USING (public.user_has_project_edit_access(project_id));

-- ── comments ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Project members can view comments" ON comments;
CREATE POLICY "Project members can view comments" ON comments
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

-- INSERT/UPDATE/DELETE on comments only check user_id = auth.uid() — no recursion, leave as-is.

-- ── activity_log ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Project members can view activity" ON activity_log;
CREATE POLICY "Project members can view activity" ON activity_log
  FOR SELECT TO authenticated
  USING (public.user_has_project_access(project_id));

-- INSERT on activity_log uses WITH CHECK (true) — no recursion, leave as-is.
