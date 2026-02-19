import { ASSET_LABELS, NIST_LABELS } from '@/lib/constants/matrix'
import type { ToolMapping } from '@/lib/supabase/types'

interface ToolInventoryProps {
  toolMappings: ToolMapping[]
}

export function ToolInventory({ toolMappings }: ToolInventoryProps) {
  // Group by tool
  const toolGroups = toolMappings.reduce<Record<string, { name: string; mappings: ToolMapping[] }>>((acc, tm) => {
    const name = tm.tool?.vendor_name || 'Unknown'
    if (!acc[tm.tool_id]) acc[tm.tool_id] = { name, mappings: [] }
    acc[tm.tool_id].mappings.push(tm)
    return acc
  }, {})

  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-4 print:text-black">Security Tool Inventory</h2>

      {Object.keys(toolGroups).length === 0 ? (
        <p className="text-sm text-muted-foreground print:text-gray-500">No tools have been mapped yet.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-white/[0.02] print:bg-gray-50">
              <th className="border border-white/10 p-2 text-left text-slate-300 print:border-gray-300 print:text-black">Tool</th>
              <th className="border border-white/10 p-2 text-left text-slate-300 print:border-gray-300 print:text-black">Coverage</th>
              <th className="border border-white/10 p-2 text-center text-slate-300 print:border-gray-300 print:text-black">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(toolGroups).map((group) => (
              <tr key={group.name}>
                <td className="border border-white/10 p-2 font-medium text-foreground print:border-gray-300 print:text-black">{group.name}</td>
                <td className="border border-white/10 p-2 text-slate-300 print:border-gray-300 print:text-gray-600">
                  {group.mappings.map((m) => `${ASSET_LABELS[m.cell_row]}/${NIST_LABELS[m.cell_column]}`).join(', ')}
                </td>
                <td className="border border-white/10 p-2 text-center capitalize text-slate-300 print:border-gray-300 print:text-black">
                  {group.mappings[0].implementation_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
