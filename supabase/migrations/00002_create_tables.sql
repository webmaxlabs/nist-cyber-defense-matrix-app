-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  industry TEXT,
  company_size TEXT,
  overall_score NUMERIC(5,2) DEFAULT 0,
  coverage_percentage NUMERIC(5,2) DEFAULT 0,
  is_template BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role project_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Cell assessments
CREATE TABLE cell_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cell_row asset_class NOT NULL,
  cell_column nist_function NOT NULL,
  maturity_level INTEGER NOT NULL CHECK (maturity_level BETWEEN 1 AND 5),
  justification TEXT,
  assessed_by UUID REFERENCES profiles(id),
  last_assessment_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, cell_row, cell_column)
);

-- Tools (global catalog)
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT NOT NULL,
  product_name TEXT,
  category TEXT,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  cost_range cost_range DEFAULT 'medium',
  is_custom BOOLEAN DEFAULT false,
  coverage_cells JSONB DEFAULT '[]'::jsonb,
  popularity_rank INTEGER DEFAULT 999,
  key_products TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tool mappings (per project)
CREATE TABLE tool_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  cell_row asset_class NOT NULL,
  cell_column nist_function NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  implementation_status implementation_status DEFAULT 'planned',
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
  notes TEXT,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, tool_id, cell_row, cell_column)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cell_row asset_class,
  cell_column nist_function,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action_type action_type NOT NULL,
  entity_type entity_type NOT NULL,
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Educational content
CREATE TABLE educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cell_row asset_class,
  cell_column nist_function,
  content_type content_type NOT NULL DEFAULT 'overview',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
