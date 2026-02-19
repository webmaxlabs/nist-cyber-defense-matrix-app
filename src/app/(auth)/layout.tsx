export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 cyber-grid-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,_rgba(34,211,238,0.06),_transparent_60%)]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
