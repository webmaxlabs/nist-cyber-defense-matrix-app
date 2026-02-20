'use client'

import { useState } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-slate-200 dark:border-white/5">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about cybersecurity..."
        className="flex-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/30 transition-all"
        disabled={isLoading}
      />
      {isLoading ? (
        <Button type="button" size="icon" variant="outline" onClick={onStop} className="shrink-0 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5">
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0 bg-cyan-500 hover:bg-cyan-400 text-slate-950">
          <Send className="h-4 w-4" />
        </Button>
      )}
    </form>
  )
}
