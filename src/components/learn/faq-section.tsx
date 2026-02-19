import { Accordion } from '@/components/ui/accordion'
import { FAQItem } from './faq-item'

const faqs = [
  {
    value: 'how-to-assess',
    question: 'How do I assess a cell in the matrix?',
    answer: 'Click on any cell in the matrix grid to open the assessment panel. Choose a maturity level from 1 (Initial) to 5 (Optimized) based on your current capabilities for that asset class and NIST function combination. Add a justification to document why you chose that level.',
  },
  {
    value: 'maturity-levels',
    question: 'What do the maturity levels mean?',
    answer: 'Level 1 (Initial): Ad-hoc, reactive. Level 2 (Developing): Some processes defined. Level 3 (Defined): Standardized and consistent. Level 4 (Managed): Measured and controlled. Level 5 (Optimized): Continuous improvement with automation. Most organizations should aim for Level 3-4 across critical cells.',
  },
  {
    value: 'prioritize-gaps',
    question: 'How should I prioritize security gaps?',
    answer: 'Focus first on cells rated Level 1-2 in the Protect and Detect columns, as these represent the highest risk. Then address gaps in Identify (you can\'t protect what you don\'t know about). Respond and Recover gaps should be addressed next. Consider your industry regulatory requirements when prioritizing.',
  },
  {
    value: 'reassessment',
    question: 'How often should I reassess?',
    answer: 'We recommend quarterly reassessments for most organizations. After major infrastructure changes, security incidents, or new tool deployments, conduct an ad-hoc reassessment of affected cells. Annual comprehensive assessments should involve all stakeholders.',
  },
  {
    value: 'multi-cell-tools',
    question: 'Can a tool cover multiple cells?',
    answer: 'Absolutely! Most security tools cover multiple cells in the matrix. For example, an EDR solution might cover Devices/Detect, Devices/Respond, and Applications/Detect. Map each tool to all applicable cells to get an accurate picture of your coverage.',
  },
]

export function FAQSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="border border-white/10 rounded-lg">
        {faqs.map((faq) => (
          <FAQItem key={faq.value} {...faq} />
        ))}
      </Accordion>
    </section>
  )
}
