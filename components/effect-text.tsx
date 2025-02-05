import React from 'react'

interface EffectTextProps {
  text: string
  className?: string
}

export function EffectText({ text, className = "text-white/90" }: EffectTextProps) {
  return (
    <p 
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
} 