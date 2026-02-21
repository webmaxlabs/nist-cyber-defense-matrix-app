import { Accordion } from '@/components/ui/accordion'
import { FAQItem } from './faq-item'
import { faqs } from '@/lib/constants/faq-data'

export function FAQSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <FAQItem key={faq.value} {...faq} index={i + 1} />
        ))}
      </Accordion>
    </section>
  )
}
