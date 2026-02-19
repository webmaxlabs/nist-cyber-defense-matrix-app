'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'flex h-7 w-7 items-center justify-center rounded-full shrink-0 border',
        isUser ? 'bg-cyan-500/15 border-cyan-500/25' : 'bg-white/5 border-white/10'
      )}>
        {isUser ? (
          <User className="h-3.5 w-3.5 text-cyan-400" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-slate-400" />
        )}
      </div>
      <div
        className={cn(
          'rounded-xl px-3 py-2 max-w-[85%] text-sm',
          isUser
            ? 'bg-cyan-500/15 border border-cyan-500/20 text-slate-200'
            : 'bg-white/5 border border-white/5 text-slate-300'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0 [&_h3]:text-sm [&_h3]:mt-2 [&_code]:text-xs [&_code]:text-cyan-300 [&_code]:bg-white/5 [&_a]:text-cyan-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
