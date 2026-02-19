import { BookOpen } from 'lucide-react'
import { ASSET_LABELS, NIST_LABELS, type AssetClass, type NistFunction } from '@/lib/constants/matrix'

interface LearnTabProps {
  row: AssetClass
  column: NistFunction
}

const educationalContent: Record<string, { title: string; description: string; practices: string[] }> = {
  'devices:identify': {
    title: 'Device Inventory & Classification',
    description: 'Maintain a comprehensive inventory of all hardware assets including servers, workstations, mobile devices, IoT devices, and network equipment.',
    practices: ['Asset discovery scanning', 'Hardware asset management (HAM)', 'Device classification by criticality', 'Shadow IT detection'],
  },
  'devices:protect': {
    title: 'Device Hardening & Protection',
    description: 'Apply security controls to protect device integrity including endpoint protection, configuration management, and access controls.',
    practices: ['Endpoint protection platforms (EPP)', 'Device encryption', 'Secure boot configuration', 'Patch management'],
  },
  'devices:detect': {
    title: 'Device Threat Detection',
    description: 'Monitor devices for signs of compromise, anomalous behavior, and policy violations.',
    practices: ['Endpoint detection & response (EDR)', 'Host-based IDS', 'Behavioral analytics', 'File integrity monitoring'],
  },
  'applications:identify': {
    title: 'Application Inventory',
    description: 'Discover and catalog all applications including custom, commercial, SaaS, and shadow IT applications.',
    practices: ['Software asset management', 'Application dependency mapping', 'SaaS discovery', 'License management'],
  },
  'applications:protect': {
    title: 'Application Security',
    description: 'Implement security controls within and around applications to prevent exploitation.',
    practices: ['Web application firewalls (WAF)', 'SAST/DAST testing', 'API security', 'Secure SDLC'],
  },
  'networks:detect': {
    title: 'Network Threat Detection',
    description: 'Monitor network traffic for threats, intrusions, and anomalous activity.',
    practices: ['Network detection & response (NDR)', 'IDS/IPS', 'NetFlow analysis', 'DNS monitoring'],
  },
  'data:protect': {
    title: 'Data Protection',
    description: 'Implement controls to protect data confidentiality, integrity, and availability.',
    practices: ['Data loss prevention (DLP)', 'Encryption at rest & transit', 'Access controls', 'Data masking'],
  },
  'users:identify': {
    title: 'User Identity Management',
    description: 'Establish and manage user identities, roles, and access rights.',
    practices: ['Identity governance', 'Directory services', 'Role-based access control', 'Privileged access management'],
  },
}

export function LearnTab({ row, column }: LearnTabProps) {
  const key = `${row}:${column}`
  const content = educationalContent[key]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-cyan-400">
        <BookOpen className="h-4 w-4" />
        <span className="text-sm font-display font-semibold">
          {ASSET_LABELS[row]} / {NIST_LABELS[column]}
        </span>
      </div>

      {content ? (
        <>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-1">{content.title}</h4>
            <p className="text-sm text-slate-300">{content.description}</p>
          </div>
          <div>
            <h5 className="text-sm font-display font-medium text-foreground mb-2">Best Practices</h5>
            <ul className="space-y-1.5">
              {content.practices.map((practice) => (
                <li key={practice} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-white/[0.02] border border-white/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Educational content for this cell will be available soon.
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Focus on {NIST_LABELS[column].toLowerCase()}ing your {ASSET_LABELS[row].toLowerCase()} assets.
          </p>
        </div>
      )}
    </div>
  )
}
