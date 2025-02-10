"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import data from '../../consolidated_balatro_data.json'
import { EffectText } from "@/components/effect-text"
import { RelatedItems } from "@/components/related-items"

interface ItemData {
  id: string
  name: string
  description: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

interface EnhancementItem {
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
  related_items: (string | null)[]
}

export default function EnhancementsPage() {
  const { image_folder, items } = data.Enhancement
  const [selected, setSelected] = useState<EnhancementItem>(items[0])

  return (
    <CategoryLayout
      title="Enhancement"
      items={items.map((item) => {
        const itemData: ItemData = {
          id: item.id,
          name: item.name,
          description: item.effect,
          selected: item.id === selected.id,
          onClick: () => setSelected(item),
        }
        if (item.unlock_requirement) {
          itemData.unlockRequirement = item.unlock_requirement
        }
        return itemData
      })}
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
        <div className="flex justify-center">
          <Image
            src={`${image_folder}${selected.appearance}`}
            alt={selected.name}
            width={150}
            height={150}
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
          <EffectText text={selected.effect} />
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
        {selected.related_items && selected.related_items.length > 0 && (
          <RelatedItems items={selected.related_items.filter((item): item is string => item !== null)} category="Enhancement" />
        )}
      </div>
    </CategoryLayout>
  )
} 