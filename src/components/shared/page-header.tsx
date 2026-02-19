interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
