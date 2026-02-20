'use client'

import { useState, useCallback } from 'react'

interface ToolLogoProps {
  vendorName: string
  websiteUrl: string
  size?: 'sm' | 'md'
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const FAVICON_SOURCES = [
  (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
]

export function ToolLogo({ vendorName, websiteUrl, size = 'sm' }: ToolLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0)
  const domain = getDomain(websiteUrl)

  const sizeClasses = size === 'md' ? 'h-12 w-12 rounded-xl text-lg' : 'h-10 w-10 rounded-lg text-sm'
  const imgSize = size === 'md' ? 32 : 24

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    // Google returns a tiny 16x16 default globe for missing favicons
    if (img.naturalWidth <= 16 && img.naturalHeight <= 16 && sourceIndex === 0) {
      setSourceIndex(1)
    }
  }, [sourceIndex])

  if (!domain || sourceIndex >= FAVICON_SOURCES.length) {
    return (
      <div className={`flex items-center justify-center bg-white/5 font-bold font-mono text-slate-300 ${sizeClasses}`}>
        {vendorName.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center bg-white/5 ${sizeClasses}`}>
      <img
        src={FAVICON_SOURCES[sourceIndex](domain)}
        alt={vendorName}
        width={imgSize}
        height={imgSize}
        className="rounded-sm"
        onLoad={handleLoad}
        onError={() => setSourceIndex((i) => i + 1)}
      />
    </div>
  )
}
