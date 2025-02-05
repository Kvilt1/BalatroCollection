"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import data from '../../consolidated_balatro_data.json'
import { EffectText } from "@/components/effect-text"

interface ItemData {
  id: string
  name: string
  description: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

export default function BoostersPage() {
  const { image_folder, items } = data.Booster
  const [selected, setSelected] = useState(items[0])

  return (
    <CategoryLayout
      title="Booster"
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
        <div className="flex justify-center gap-4">
          <Image
            src={`${image_folder}${selected.appearance}`}
            alt={selected.name}
            width={100}
            height={150}
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
          <EffectText text={selected.effect} />
        </div>
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
      </div>
    </CategoryLayout>
  )
}

