'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FAQItemProps {
  value: string
  question: string
  answer: string
  index: number
}

export function FAQItem({ value, question, answer, index }: FAQItemProps) {
  return (
    <AccordionItem
      value={value}
      className="group border-b-0 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 transition-all data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-white/[0.06] data-[state=open]:border-cyan-500/30 data-[state=open]:shadow-[0_0_15px_rgba(34,211,238,0.07)]"
    >
      <AccordionTrigger className="text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:no-underline hover:text-foreground px-4 gap-3">
        <span className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-white/5 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 group-data-[state=open]:bg-cyan-500/10 group-data-[state=open]:text-cyan-400 transition-colors">
            {String(index).padStart(2, '0')}
          </span>
          {question}
        </span>
      </AccordionTrigger>
      <AccordionContent className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-4 pl-14">
        {answer}
      </AccordionContent>
    </AccordionItem>
  )
}
