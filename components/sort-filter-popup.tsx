import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

interface SortFilterPopupProps {
  onSortChange: (sortBy: string, direction: 'asc' | 'desc') => void
  onFilterChange: (showUnlockable: boolean) => void
  onRarityFilterChange: (rarities: string[]) => void
  onTypeFilterChange?: (types: string[]) => void
  showRarityFilter?: boolean
  showTypeFilter?: boolean
  showUnlockUI?: boolean
  allowedSortOptions?: string[]
}

export function SortFilterPopup({ 
  onSortChange, 
  onFilterChange, 
  onRarityFilterChange,
  onTypeFilterChange,
  showRarityFilter = false,
  showTypeFilter = false,
  showUnlockUI = true,
  allowedSortOptions = ["id", "name", "rarity", "type"]
}: SortFilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUnlockable, setShowUnlockable] = useState(false)
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("id")
  const [sortDirections, setSortDirections] = useState<{[key: string]: 'asc' | 'desc'}>({
    id: 'asc',
    name: 'asc',
    rarity: 'asc',
    type: 'asc'
  })

  const sortOptions = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'type', label: 'Type' }
  ].filter(option => allowedSortOptions.includes(option.key))

  const jokerTypes = [
    { key: '+c', label: 'Chips' },
    { key: '+m', label: 'Additive Mult' },
    { key: 'Xm', label: 'Multiplicative Mult' },
    { key: '++', label: 'Chips & Mult' },
    { key: '!!', label: 'Effect' },
    { key: '...', label: 'Retrigger' },
    { key: '+$', label: 'Economy' }
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    onSortChange(newSortBy, sortDirections[newSortBy])
  }

  const toggleSortDirection = (sortKey: string) => {
    const newDirection = sortDirections[sortKey] === 'asc' ? 'desc' : 'asc'
    setSortDirections(prev => ({
      ...prev,
      [sortKey]: newDirection
    }))
    if (sortKey === sortBy) {
      onSortChange(sortKey, newDirection)
    }
  }

  const handleRarityChange = (rarity: string) => {
    const newRarities = selectedRarities.includes(rarity)
      ? selectedRarities.filter(r => r !== rarity)
      : [...selectedRarities, rarity]
    setSelectedRarities(newRarities)
    onRarityFilterChange(newRarities)
  }

  const handleTypeChange = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    setSelectedTypes(newTypes)
    onTypeFilterChange?.(newTypes)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-white bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
      >
        Sort & Filter
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-black/90 rounded-lg shadow-lg p-4 space-y-4 z-50">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Sort by</h3>
            <div className="space-y-1">
              {sortOptions.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <button
                    onClick={() => handleSortChange(key)}
                    className={`text-left px-2 py-1 text-sm rounded flex-1 ${
                      sortBy === key 
                        ? 'text-white bg-white/10' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                  <button
                    onClick={() => toggleSortDirection(key)}
                    className="p-1 text-white/60 hover:text-white"
                  >
                    {sortDirections[key] === 'asc' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Filter</h3>
            {showUnlockUI && (
              <label className="flex items-center gap-2 px-2 py-1 text-sm text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={showUnlockable}
                  onChange={(e) => {
                    setShowUnlockable(e.target.checked)
                    onFilterChange(e.target.checked)
                  }}
                  className="rounded border-white/20"
                />
                Unlockable Only
              </label>
            )}
          </div>

          {showRarityFilter && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Rarity</h3>
              {["Common", "Uncommon", "Rare", "Legendary"].map((rarity) => (
                <label key={rarity} className="flex items-center gap-2 px-2 py-1 text-sm text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedRarities.includes(rarity)}
                    onChange={() => handleRarityChange(rarity)}
                    className="rounded border-white/20"
                  />
                  {rarity}
                </label>
              ))}
            </div>
          )}

          {showTypeFilter && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">Type</h3>
              {jokerTypes.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 px-2 py-1 text-sm text-white/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(key)}
                    onChange={() => handleTypeChange(key)}
                    className="rounded border-white/20"
                  />
                  {label}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 