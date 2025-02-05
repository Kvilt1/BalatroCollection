"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"

interface JokerItem {
  id: string
  name: string
  description: string
  rarity: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

interface JokerContentProps {
  data: {
    image_folder: string
    items: Array<{
      id: string
      name: string
      effect: string
      appearance: string
      category: string
      type: string | null
      rarity: string | null
      cost: string | null
      unlock_requirement: string | null
      additional: string | null
      related_items: string[]
    }>
  }
}

export function JokerContent({ data }: JokerContentProps) {
  const { image_folder, items } = data
  const [selected, setSelected] = useState(items[0])

  return (
    <CategoryLayout
      title="Joker"
      items={items.map((item) => {
        const itemData: JokerItem = {
          id: item.id,
          name: item.name,
          description: item.effect,
          rarity: item.rarity || "Common",
          selected: item.id === selected.id,
          onClick: () => setSelected(item),
        }
        if (item.unlock_requirement) {
          itemData.unlockRequirement = item.unlock_requirement
        }
        return itemData
      })}
      showRarityFilter={true}
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
        <div className="flex justify-center">
          <Image
            src={`${image_folder}${selected.appearance}`}
            alt={selected.name}
            width={200}
            height={300}
            className="rounded-lg"
            priority={true}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
          <p className="text-white/90">{selected.effect}</p>
        </div>
        {selected.rarity && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Rarity</h3>
            <p className="text-white/90">{selected.rarity}</p>
          </div>
        )}
        {selected.cost && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Cost</h3>
            <p className="text-white/90">{selected.cost}</p>
          </div>
        )}
        {selected.unlock_requirement && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Unlock Requirement</h3>
            <p className="text-white/90">{selected.unlock_requirement}</p>
          </div>
        )}
        {selected.additional && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Additional Info</h3>
            <p className="text-white/90">{selected.additional}</p>
          </div>
        )}
      </div>
    </CategoryLayout>
  )
} 