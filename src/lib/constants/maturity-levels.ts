export const MATURITY_LEVELS = [
  {
    level: 1,
    name: 'Initial',
    description: 'Ad-hoc, reactive processes. No formal documentation or standards.',
    color: '#ef4444',
    bgColor: 'bg-red-500',
    criteria: [
      'No formal processes in place',
      'Reactive approach to security',
      'Limited awareness of threats',
      'Minimal or no tooling',
    ],
  },
  {
    level: 2,
    name: 'Developing',
    description: 'Some processes defined but inconsistently applied. Basic tools deployed.',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    criteria: [
      'Some processes documented',
      'Basic security tools deployed',
      'Inconsistent application',
      'Limited coverage',
    ],
  },
  {
    level: 3,
    name: 'Defined',
    description: 'Standardized processes documented and consistently followed. Adequate tooling.',
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    criteria: [
      'Standardized processes in place',
      'Consistent tool deployment',
      'Regular reviews conducted',
      'Adequate coverage across assets',
    ],
  },
  {
    level: 4,
    name: 'Managed',
    description: 'Quantitatively measured and controlled. Advanced tools with good integration.',
    color: '#3b82f6',
    bgColor: 'bg-blue-500',
    criteria: [
      'Metrics-driven approach',
      'Advanced tooling with integration',
      'Proactive threat management',
      'Regular improvement cycles',
    ],
  },
  {
    level: 5,
    name: 'Optimized',
    description: 'Continuous improvement. Industry-leading practices with full automation.',
    color: '#22c55e',
    bgColor: 'bg-green-500',
    criteria: [
      'Continuous improvement culture',
      'Full automation where possible',
      'Industry-leading practices',
      'Real-time monitoring and response',
    ],
  },
] as const

export type MaturityLevel = typeof MATURITY_LEVELS[number]
