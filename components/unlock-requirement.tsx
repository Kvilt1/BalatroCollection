"use client"

import { Circle } from 'lucide-react'

interface UnlockRequirementProps {
  requirement: string
}

export function UnlockRequirement({ requirement }: UnlockRequirementProps) {
  if (!requirement || 
      requirement.toLowerCase().includes("available from start") || 
      requirement.toLowerCase().includes("no requirement needed")) {
    return (
      <div className="flex items-center gap-2 px-4 py-3">
        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
        <div className="text-sm text-white/70">
          Available from start.
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
      <div className="text-sm text-white/70">
        {requirement}
      </div>
    </div>
  )
} 