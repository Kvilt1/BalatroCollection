"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import data from '../../consolidated_balatro_data.json'
import { EffectText } from "@/components/effect-text"
import { RelatedItems } from "@/components/related-items"
import { UnlockRequirement } from "@/components/unlock-requirement"

interface ItemData {
  id: string
  name: string
  description: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

interface VoucherPlusItem {
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

export default function VouchersPlusPage() {
  const { image_folder, items } = data.VoucherPlus
  const [selected, setSelected] = useState<VoucherPlusItem>(items[0])

  return (
    <CategoryLayout
      title="Voucher Plus"
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
      sortOptions={["id", "name"]}
      showUnlockUI={false}
    >
      <div className="relative h-full">
        <div className="space-y-6 pb-16">
          <div>
            <h2 className="card-title">{selected.name}</h2>
            <div className="h-px bg-white/10 mt-4" />
          </div>

          <div className="flex justify-center mb-8">
            <Image
              src={`${image_folder}${selected.appearance}`}
              alt={selected.name}
              width={150}
              height={150}
              className="rounded-lg shadow-lg"
              priority={true}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selected.cost && (
              <span className="card-tag cost">
                💰 {selected.cost}
              </span>
            )}
          </div>

          <div className="card-section">
            <h3 className="card-section-title">Effect</h3>
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex flex-col gap-2">
              <EffectText text={selected.effect} />
            </div>
          </div>

          {selected.additional && (
            <div className="card-section">
              <h3 className="card-section-title">Additional Info</h3>
              <div className="h-px bg-white/10 mb-4" />
              <div className="flex flex-col gap-2">
                <EffectText text={selected.additional} />
              </div>
            </div>
          )}

          {selected.related_items && selected.related_items.length > 0 && (
            <RelatedItems items={selected.related_items.filter((item): item is string => item !== null)} category="Voucher Plus" />
          )}
        </div>

        {selected.unlock_requirement && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/40">
            <UnlockRequirement requirement={selected.unlock_requirement} />
          </div>
        )}
      </div>
    </CategoryLayout>
  )
} 