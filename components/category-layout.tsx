"use client"

import { ArrowLeft, Search, Circle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type React from "react"
import { SortFilterPopup } from "./sort-filter-popup"

interface CategoryLayoutProps {
  title: string
  items: {
    id: string
    name: string
    description: string
    rarity?: string
    unlockRequirement?: string
    selected?: boolean
    onClick?: () => void
  }[]
  children: React.ReactNode
  showRarityFilter?: boolean
}

export function CategoryLayout({ title, items: initialItems, children, showRarityFilter = false }: CategoryLayoutProps) {
  const [items, setItems] = useState(initialItems)
  const [sortBy, setSortBy] = useState("name")
  const [showUnlockable, setShowUnlockable] = useState(false)
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const cardFromUrl = searchParams?.get("card")
    if (cardFromUrl) {
      setSelectedId(cardFromUrl)
      const item = items.find((item) => item.id === cardFromUrl)
      if (item && item.onClick) {
        item.onClick()
      }
    }
  }, [searchParams, items])

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy)
    const sortedItems = [...items].sort((a, b) => {
      if (newSortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (newSortBy === "rarity") {
        const rarityOrder: { [key: string]: number } = {
          "Common": 0,
          "Uncommon": 1,
          "Rare": 2,
          "Legendary": 3
        }
        const aRarity = a.rarity || "Common"
        const bRarity = b.rarity || "Common"
        return rarityOrder[aRarity] - rarityOrder[bRarity]
      }
      return 0
    })
    setItems(sortedItems)
  }

  const handleFilter = (showUnlockable: boolean) => {
    setShowUnlockable(showUnlockable)
    applyFilters(showUnlockable, selectedRarities)
  }

  const handleRarityFilter = (rarities: string[]) => {
    setSelectedRarities(rarities)
    applyFilters(showUnlockable, rarities)
  }

  const applyFilters = (unlockable: boolean, rarities: string[]) => {
    let filteredItems = [...initialItems]

    // Apply unlock requirement filter
    if (unlockable) {
      filteredItems = filteredItems.filter(item => {
        const requirement = item.unlockRequirement?.toLowerCase() || ""
        return requirement !== "" && 
               requirement !== "available from start" && 
               requirement !== "available from start." &&
               requirement !== "no requirement needed" &&
               requirement !== "no requirement needed." &&
               !requirement.startsWith("available from start")
      })
    }

    // Apply rarity filter
    if (rarities.length > 0) {
      filteredItems = filteredItems.filter(item => 
        item.rarity && rarities.includes(item.rarity)
      )
    }

    setItems(filteredItems)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/50 hover:text-white">
            ← Back to Categories
          </Link>
          <SortFilterPopup 
            onSortChange={handleSort} 
            onFilterChange={handleFilter}
            onRarityFilterChange={handleRarityFilter}
            showRarityFilter={showRarityFilter}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          <div className="bg-black/20 rounded-lg p-4 h-[calc(100vh-12rem)] flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">{title}s</h2>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    item.id === selectedId
                      ? "bg-white/20 text-white"
                      : "bg-black/20 text-white/70 hover:bg-black/30 hover:text-white"
                  }`}
                >
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-white/50">{item.description}</p>
                  {item.rarity && (
                    <p className="mt-1 text-xs text-white/40">
                      ✨ {item.rarity}
                    </p>
                  )}
                  {item.unlockRequirement && 
                   !item.unlockRequirement.toLowerCase().includes("available from start") && 
                   !item.unlockRequirement.toLowerCase().includes("no requirement needed") && (
                    <p className="mt-2 text-xs text-white/30">
                      🔓 {item.unlockRequirement}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

