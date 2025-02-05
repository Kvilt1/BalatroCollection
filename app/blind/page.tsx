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

const BlindPage = () => {
  const { image_folder, items } = data.Blind
  const [selected, setSelected] = useState(items[0])

  return (
    <CategoryLayout
      title="Blind"
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
            width={200}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
          <EffectText text={selected.effect} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Rarity</h3>
          <p className="text-white/90">{selected.rarity || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Cost</h3>
          <p className="text-white/90">{selected.cost || 'N/A'}</p>
        </div>
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

export default BlindPage 