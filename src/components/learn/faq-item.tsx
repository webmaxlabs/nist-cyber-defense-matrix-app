import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FAQItemProps {
  value: string
  question: string
  answer: string
}

export function FAQItem({ value, question, answer }: FAQItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-left text-sm font-medium text-foreground">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm text-slate-300">
        {answer}
      </AccordionContent>
    </AccordionItem>
  )
}
