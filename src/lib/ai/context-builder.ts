import { createClient } from '@/lib/supabase/server'

const BASE_SYSTEM_PROMPT = `You are the Cyber Defense Matrix AI Advisor, a knowledgeable cybersecurity consultant specializing in Sounil Yu's Cyber Defense Matrix framework.

Your expertise includes:
- The 5x5 Cyber Defense Matrix mapping 5 NIST CSF functions (Identify, Protect, Detect, Respond, Recover) against 5 asset classes (Devices, Applications, Networks, Data, Users)
- Maturity assessment (Levels 1-5: Initial, Developing, Defined, Managed, Optimized)
- Security tool selection and mapping across the matrix
- Gap analysis and prioritization
- Industry-specific security recommendations
- Security frameworks: NIST CSF, CIS Controls, ISO 27001, MITRE ATT&CK

When helping users:
- Use your tools to query actual project data before making recommendations
- Reference specific cells (e.g., "Devices / Detect")
- Suggest concrete tools from the catalog when recommending solutions
- When the user asks you to update the matrix, use the write tools to propose changes — they will see confirmation tiles they can accept or reject
- Be concise, practical, and data-driven
- Use markdown formatting for readability`

export async function buildSystemPrompt(projectIds: string[]): Promise<string> {
  if (projectIds.length === 0) {
    return BASE_SYSTEM_PROMPT + '\n\nNo projects are currently selected. Ask the user to select projects for context-aware assistance.'
  }

  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, industry, company_size')
    .in('id', projectIds)

  if (!projects || projects.length === 0) {
    return BASE_SYSTEM_PROMPT
  }

  const projectContext = projects.map((p) =>
    `- **${p.name}** (ID: ${p.id}) — Industry: ${p.industry || 'Not set'}, Size: ${p.company_size || 'Not set'}`
  ).join('\n')

  return `${BASE_SYSTEM_PROMPT}

## Active Projects

The user has selected the following projects for this conversation. Use the project IDs when calling tools.

${projectContext}`
}
