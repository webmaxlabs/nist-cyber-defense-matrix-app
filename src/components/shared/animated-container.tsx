'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedContainerProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedContainer({ children, delay = 0, className }: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
