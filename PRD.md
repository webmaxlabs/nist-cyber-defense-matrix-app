# DefenseMatrix — Product Requirements Document

## Vision
DefenseMatrix is a cybersecurity posture assessment platform that helps organizations visualize, assess, and improve their security coverage using the **Cyber Defense Matrix** framework by Sounil Yu. It transforms the abstract concept of security posture into an interactive, actionable 5x5 matrix.

## Target Users
- **CISOs and Security Directors** — strategic security posture overview
- **Security Engineers and Analysts** — detailed tool mapping and gap analysis
- **IT Managers** — understanding security coverage across asset classes
- **Consultants and Auditors** — client security assessment delivery

## Core Framework: Cyber Defense Matrix
A 5x5 grid combining:
- **Columns (NIST CSF Functions)**: Identify, Protect, Detect, Respond, Recover
- **Rows (Asset Classes)**: Devices, Applications, Networks, Data, Users
- **Each cell** gets a maturity level (1-5) and mapped security tools

The matrix provides a holistic view of security posture and highlights gaps.

---

## Feature Set

### 1. Authentication & User Management
- **Email/password** signup and login
- **Magic link** (passwordless) authentication
- **OAuth** (Google, GitHub) social login
- Session management via Supabase Auth + middleware
- User profiles with name and avatar

### 2. Project Management
- Create, archive, and delete security assessment projects
- Each project scoped to an organization/engagement
- Metadata: industry, company size, description
- Grid and list view toggle for project listing
- Project-level navigation (Dashboard, Matrix, Report)

### 3. Interactive Defense Matrix (Core Feature)
- **5x5 interactive grid** with color-coded cells
- Click any cell to open a detail modal with 3 tabs:
  - **Assessment Tab**: Set maturity level (1-5) with justification text
  - **Tools Tab**: Map security tools from the catalog to the cell
  - **Learn Tab**: Educational content about the cell's security domain
- **Maturity Selector**: Visual level picker with color feedback
- **Matrix Column/Row Headers**: Labeled with NIST functions and asset classes
- **Continuum Bar**: Visual progress bar showing overall maturity distribution

### 4. Security Tools Catalog
- Pre-seeded database of security tools (vendor, category, cost range, coverage)
- Tool picker dialog with search and filtering
- Map tools to specific matrix cells with implementation status
- Track: planned, in progress, implemented, optimized
- Effectiveness ratings per tool mapping

### 5. Dashboard & Analytics
- **KPI Cards**: Overall score, coverage %, tool count, critical gaps
- **Radar Chart**: NIST function coverage visualization (Recharts)
- **Coverage Bar Chart**: Per-asset-class coverage breakdown
- **Security Gaps**: Highlight cells needing attention
- **Activity Feed**: Recent actions (assessments, tool mappings, etc.)

### 6. Report Generation
- **Executive Summary**: High-level security posture overview
- **NIST Function Analysis**: Per-function breakdown
- **Gap Analysis Table**: Matrix cells sorted by maturity level
- **Tool Inventory**: All mapped tools with status
- **Recommendations**: AI-powered or rule-based improvement suggestions
- Print-friendly styling with `@media print` support

### 7. AI Chat Assistant
- Context-aware security advisor chat widget
- Floating button → expandable chat panel
- Markdown rendering for responses
- Typing indicator animation
- Conversation persistence in Supabase

### 8. Learning Center
- **Framework Overview**: Explanation of the Cyber Defense Matrix
- **Security Tools Section**: Browsable tool catalog with modals
- **Tool Matrix Coverage**: Visual tool-to-cell mapping
- **FAQ Section**: Common security assessment questions
- **Resources Section**: External links and references

### 9. Real-time Collaboration
- Supabase Realtime subscriptions for live updates
- Activity logging for all project actions
- Comment system on matrix cells (with threading)

---

## Technical Architecture

### Frontend
- Next.js 16 App Router with route groups for auth/dashboard/public
- React 19 with Server Components where possible
- TanStack React Query v5 for client-side data fetching/caching
- Framer Motion for animations and transitions
- Recharts for data visualization

### Backend
- Supabase PostgreSQL with Row Level Security (RLS)
- Server Actions for mutations
- Supabase Auth (email, magic link, OAuth)
- Supabase Realtime for live subscriptions
- API route for AI chat (`/api/chat`)

### Database
10 tables with full RLS policies, indexes, and trigger functions.
See `supabase/migrations/` for complete schema.

---

## Maturity Levels
| Level | Label | Description |
|-------|-------|-------------|
| 1 | Initial | No formal processes; ad-hoc security |
| 2 | Developing | Basic processes in place; inconsistent |
| 3 | Defined | Documented and standardized processes |
| 4 | Managed | Measured and controlled; metrics-driven |
| 5 | Optimizing | Continuous improvement; industry-leading |

---

## Design Direction
"Tactical Cyber Operations Center" — dark-mode-first, glassmorphism, neon glow effects, electric cyan primary accent. See CLAUDE.md for full design system documentation.

---

## Future Considerations
- Multi-tenant organization support
- Role-based access control (owner/editor/viewer already in schema)
- Export to PDF/CSV
- Integration with real security tool APIs
- Compliance framework mapping (SOC 2, ISO 27001, NIST 800-53)
- Benchmark comparisons against industry peers
- Custom maturity frameworks beyond NIST CSF
