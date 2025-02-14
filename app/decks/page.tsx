"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import data from '../../consolidated_balatro_data.json'
import { EffectText } from "@/components/effect-text"
import { UnlockRequirement } from "@/components/unlock-requirement"
import { RelatedItems } from "@/components/related-items"

interface ItemData {
  id: string
  name: string
  description: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

interface DeckItem {
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

export default function DecksPage() {
  const { image_folder, items } = data.Deck
  const [selected, setSelected] = useState<DeckItem>(items[0])

  return (
    <CategoryLayout
      title="Deck"
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
      <div className="relative h-full">
        <div className="space-y-6 pb-16">
          <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
          <div className="flex justify-center">
            <Image
              src={`${image_folder}${selected.appearance}`}
              alt={selected.name}
              width={200}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
            <EffectText text={selected.effect} />
          </div>
          {selected.additional && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Additional Info</h3>
              <p className="text-white/90">{selected.additional}</p>
            </div>
          )}
          {selected.related_items && selected.related_items.length > 0 && (
            <RelatedItems items={selected.related_items.filter((item): item is string => item !== null)} category="Deck" />
          )}
        </div>

        {selected.unlock_requirement && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/40">
            <UnlockRequirement requirement={selected.unlock_requirement} />
          </div>
        )}
      </div>
    </CategoryLayout>
  )
}

