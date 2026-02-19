-- Enums for DefenseMatrix
CREATE TYPE asset_class AS ENUM ('devices', 'applications', 'networks', 'data', 'users');
CREATE TYPE nist_function AS ENUM ('identify', 'protect', 'detect', 'respond', 'recover');
CREATE TYPE maturity_level AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE project_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE implementation_status AS ENUM ('planned', 'in_progress', 'implemented', 'optimized');
CREATE TYPE action_type AS ENUM ('created', 'updated', 'deleted', 'assessed', 'mapped_tool', 'unmapped_tool', 'invited', 'commented');
CREATE TYPE entity_type AS ENUM ('project', 'assessment', 'tool_mapping', 'comment', 'member');
CREATE TYPE content_type AS ENUM ('overview', 'best_practice', 'example', 'resource');
CREATE TYPE cost_range AS ENUM ('free', 'low', 'medium', 'high', 'enterprise');
