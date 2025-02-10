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

interface VoucherItem {
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

function highlightGameTerms(text: string) {
  return text
    // Highlight multipliers (x2, +4, etc.)
    .replace(/([x×](\d+(?:\.\d+)?)(?:\s*Mult)?)/gi, '<span class="hl-xmult">$1</span>')
    .replace(/([+](\d+(?:\.\d+)?)\s*(?:Mult|mult))/g, '<span class="hl-mult">$1</span>')
    // Highlight chip amounts
    .replace(/([+-]?\d+)\s*(?:Chips|chips)/g, '<span class="hl-chips">$1</span>&nbsp;<b>Chips</b>')
    // Highlight money amounts
    .replace(/(\$\d+)/g, '<span class="hl-yellow">$1</span>')
    // Highlight poker hands
    .replace(/\b(Pair|Two Pair|Three of a Kind|Four of a Kind|Full House|Straight|Flush|Royal Flush|Straight Flush)\b/g, 
      '<span class="hl-orange">$1</span>')
    // Highlight game-specific terms
    .replace(/\b(hand|hands)\b/gi, '<span class="hl-blue">$1</span>')
    .replace(/\b(discard|discards)\b/gi, '<span class="hl-red">$1</span>')
    // Highlight probabilities
    .replace(/(\d+\s*in\s*\d+)/g, '<span class="hl-green">$1</span>')
    // Highlight card types
    .replace(/\b(Joker|Tarot|Planet|Spectral|Celestial)\b/g, '<span class="hl-sblue">$1</span>')
    // Highlight rarities
    .replace(/\b(Common|Uncommon|Rare|Legendary)\b/g, '<span class="hl-green">$1</span>')
    // Make numbers in brackets orange
    .replace(/\[([^\]]+)\]/g, '<span class="hl-orange">[$1]</span>')
}

export default function VouchersPage() {
  const { image_folder, items } = data.Voucher
  const [selected, setSelected] = useState<VoucherItem>(items[0])

  return (
    <CategoryLayout
      title="Voucher"
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
            <RelatedItems items={selected.related_items.filter((item): item is string => item !== null)} category="Voucher" />
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

