import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface SortFilterPopupProps {
  onSortChange: (sortBy: string) => void
  onFilterChange: (showUnlockable: boolean) => void
  onRarityFilterChange: (rarities: string[]) => void
  showRarityFilter?: boolean
}

export function SortFilterPopup({ 
  onSortChange, 
  onFilterChange, 
  onRarityFilterChange,
  showRarityFilter = false 
}: SortFilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUnlockable, setShowUnlockable] = useState(false)
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  const handleRarityChange = (rarity: string) => {
    const newRarities = selectedRarities.includes(rarity)
      ? selectedRarities.filter(r => r !== rarity)
      : [...selectedRarities, rarity]
    setSelectedRarities(newRarities)
    onRarityFilterChange(newRarities)
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
        <div className="absolute top-full mt-2 right-0 w-48 bg-black/90 rounded-lg shadow-lg p-4 space-y-4 z-50">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Sort by</h3>
            <button
              onClick={() => {
                onSortChange("name")
                setIsOpen(false)
              }}
              className="block w-full text-left px-2 py-1 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded"
            >
              Name
            </button>
            <button
              onClick={() => {
                onSortChange("rarity")
                setIsOpen(false)
              }}
              className="block w-full text-left px-2 py-1 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded"
            >
              Rarity
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Filter</h3>
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
        </div>
      )}
    </div>
  )
} 