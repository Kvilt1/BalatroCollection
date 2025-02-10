"use client"

import { ArrowLeft, Search, Circle, Heart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type React from "react"
import { SortFilterPopup } from "./sort-filter-popup"
import { EffectText } from "./effect-text"
import Image from "next/image"
import { useFavorites } from "@/contexts/favorites-context"
import { useInView } from "react-intersection-observer"
import { UnlockRequirement } from "./unlock-requirement"

interface CategoryLayoutProps {
  title: string
  items: {
    id: string
    name: string
    description: string
    rarity?: string
    unlockRequirement?: string
    type?: string
    selected?: boolean
    onClick?: () => void
    cost?: number
  }[]
  children: React.ReactNode
  showRarityFilter?: boolean
  showTypeFilter?: boolean
  showUnlockUI?: boolean
  highlightText?: (text: string) => string
  sortOptions?: string[]
}

const ITEMS_PER_PAGE = 20

export function CategoryLayout({ 
  title, 
  items: initialItems, 
  children, 
  showRarityFilter = false,
  showTypeFilter = false,
  showUnlockUI = true,
  highlightText,
  sortOptions = ["id", "name", "rarity", "type"]
}: CategoryLayoutProps) {
  const [items, setItems] = useState(initialItems)
  const [displayedItems, setDisplayedItems] = useState(initialItems.slice(0, ITEMS_PER_PAGE))
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("id")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showUnlockable, setShowUnlockable] = useState(false)
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showUnlocks, setShowUnlocks] = useState(true)
  const searchParams = useSearchParams()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (inView) {
      const nextItems = items.slice(0, (page + 1) * ITEMS_PER_PAGE)
      setDisplayedItems(nextItems)
      setPage(page + 1)
    }
  }, [inView, items, page])

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

  const handleSort = (newSortBy: string, direction: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortDirection(direction)
    const sortedItems = [...items].sort((a, b) => {
      let comparison = 0
      if (newSortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (newSortBy === "rarity") {
        const rarityOrder: { [key: string]: number } = {
          "Common": 0,
          "Uncommon": 1,
          "Rare": 2,
          "Legendary": 3
        }
        const aRarity = a.rarity || "Common"
        const bRarity = b.rarity || "Common"
        comparison = rarityOrder[aRarity] - rarityOrder[bRarity]
      } else if (newSortBy === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (newSortBy === "type") {
        const typeOrder: { [key: string]: number } = {
          "+c": 0,
          "+m": 1,
          "Xm": 2,
          "++": 3,
          "!!": 4,
          "...": 5,
          "+$": 6
        }
        const aType = a.type || ""
        const bType = b.type || ""
        comparison = (typeOrder[aType] ?? 999) - (typeOrder[bType] ?? 999)
      }
      return direction === 'asc' ? comparison : -comparison
    })
    setItems(sortedItems)
    setDisplayedItems(sortedItems.slice(0, ITEMS_PER_PAGE))
    setPage(1)
  }

  const handleFilter = (showUnlockable: boolean) => {
    setShowUnlockable(showUnlockable)
    applyFilters(showUnlockable, selectedRarities, selectedTypes)
  }

  const handleRarityFilter = (rarities: string[]) => {
    setSelectedRarities(rarities)
    applyFilters(showUnlockable, rarities, selectedTypes)
  }

  const handleTypeFilter = (types: string[]) => {
    setSelectedTypes(types)
    applyFilters(showUnlockable, selectedRarities, types)
  }

  const applyFilters = (unlockable: boolean, rarities: string[], types: string[]) => {
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

    // Apply type filter
    if (types.length > 0) {
      filteredItems = filteredItems.filter(item =>
        item.type && types.includes(item.type)
      )
    }

    setItems(filteredItems)
    setDisplayedItems(filteredItems.slice(0, ITEMS_PER_PAGE))
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white/50 hover:text-white">
            ← Back to Categories
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/favorites" className="text-white/50 hover:text-white">
              <Heart className="w-5 h-5" />
            </Link>
            {showUnlockUI && (
              <label className="flex items-center gap-2 text-sm text-white/50">
                <input
                  type="checkbox"
                  checked={showUnlocks}
                  onChange={e => setShowUnlocks(e.target.checked)}
                  className="rounded border-white/20"
                />
                Show Unlocks
              </label>
            )}
            <SortFilterPopup
              onSortChange={handleSort}
              onFilterChange={handleFilter}
              onRarityFilterChange={handleRarityFilter}
              onTypeFilterChange={handleTypeFilter}
              showRarityFilter={showRarityFilter}
              showTypeFilter={showTypeFilter}
              showUnlockUI={showUnlockUI}
              allowedSortOptions={sortOptions}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          <div className="bg-[#1a1a1a]/40 rounded-lg p-4 h-[calc(100vh-12rem)] flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">{title}s</h2>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2 custom-scrollbar">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className={`w-full text-left p-4 rounded-lg transition-colors relative group ${
                    item.id === selectedId
                      ? "bg-white/20 text-white"
                      : "bg-[#1a1a1a]/40 text-white/70 hover:bg-[#1a1a1a]/60 hover:text-white"
                  }`}
                >
                  <button
                    onClick={item.onClick}
                    className="w-full text-left"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="h-px bg-white/5 mt-2" />
                      </div>
                      <EffectText text={item.description} className="text-sm text-white/50" highlight={highlightText} />
                      {item.rarity && (
                        <div>
                          <div className="h-px bg-white/5 mb-2" />
                          <div className="flex items-center gap-2">
                            <span className={`card-tag flex items-center gap-2 bg-[#1a1a1a] border ${
                              item.rarity === "Common" ? 'border-[#BCBCBC]' : 
                              item.rarity === "Uncommon" ? 'border-[#55A383]' :
                              item.rarity === "Rare" ? 'border-[#FD5F55]' :
                              item.rarity === "Legendary" ? 'border-[#C886F0]' : 'border-white/20'
                            }`}>
                              <Image
                                src={`/assets/rarity/${item.rarity?.toLowerCase()}.png`}
                                alt={item.rarity || ''}
                                width={16}
                                height={16}
                              />
                              {item.rarity}
                            </span>
                          </div>
                        </div>
                      )}
                      {showUnlocks && showUnlockUI && item.unlockRequirement && (
                        <div>
                          <div className="h-px bg-white/5 mb-2" />
                          <UnlockRequirement requirement={item.unlockRequirement} />
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                    className={`absolute top-2 right-2 p-1 transition-opacity ${
                      isFavorite(item.id) ? 'text-red-500' : 'text-white/40'
                    } opacity-0 group-hover:opacity-100 hover:scale-110`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
              <div ref={ref} className="h-4" />
            </div>
          </div>

          <div className="bg-[#1a1a1a]/40 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

