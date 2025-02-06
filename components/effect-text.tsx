import React from 'react'

interface EffectTextProps {
  text: string
  className?: string
  highlight?: (text: string) => string
}

export function EffectText({ text, className = "text-white/90", highlight }: EffectTextProps) {
  const processedText = highlight ? highlight(text) : text
  
  return (
    <p 
      className={className}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  )
} 