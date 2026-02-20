export function ChatTypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
        <div className="flex gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-cyan-400/30 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-cyan-400/30 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-cyan-400/30 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
