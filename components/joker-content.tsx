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
    // Highlight suits with their specific colors
    .replace(/\b(Diamond)s?\b/g, '<span style="color:#f15a27;"><b>$1</b></span>')
    .replace(/\b(Heart)s?\b/g, '<span style="color:#f11b52;"><b>$1</b></span>')
    .replace(/\b(Spade)s?\b/g, '<span style="color:#292189;"><b>$1</b></span>')
    .replace(/\b(Club)s?\b/g, '<span style="color:#074540;"><b>$1</b></span>')
    // Highlight card ranks and special terms
    .replace(/\b(Ace|King|Queen|Jack|[2-9]|10)\b(?!\s*(?:Chips|chips|\$))/g, '<span class="hl-orange">$1</span>')
    // Highlight special card types
    .replace(/\b(Stone Card|Steel Card|Glass Card|Gold Card|Wild Card|Lucky Card|Negative Card|Foil Card|Holographic Card|Polychrome Card)\b/g, 
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
    // Highlight game mechanics
    .replace(/\b(Boss Blind|Small Blind|Big Blind|Blind|reroll|shop|final hand|full deck|face|most played|Double Tag|Death)\b/g, 
      '<span class="hl-orange">$1</span>')
    // Make numbers in brackets orange
    .replace(/\[([^\]]+)\]/g, '<span class="hl-orange">[$1]</span>')
    // Bold certain terms
    .replace(/(?<!<\/?)b>(.*?)<\/b>/g, '<b>$1</b>')
    // Add parenthetical notes in gray
    .replace(/\((Currently[^)]+)\)/g, '<span style="color:#b1b1b1;"><b>$1</b></span>')
    .replace(/\((Must have room|Available from start)\)/g, '<span style="color:#b1b1b1;"><b>($1)</b></span>')

  return text
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
        <h2 className="card-title">{selected.name}</h2>
        <div className="flex justify-center mb-8">
          <Image
            src={`${image_folder}${selected.appearance}`}
            alt={selected.name}
            width={200}
            height={300}
            className="rounded-lg shadow-lg"
            priority={true}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selected.rarity && (
            <span className="card-tag rarity">
              ✨ {selected.rarity}
            </span>
          )}
          {selected.cost && (
            <span className="card-tag cost">
              💰 {selected.cost}
            </span>
          )}
        </div>

        <div className="card-section">
          <h3 className="card-section-title">Effect</h3>
          <p 
            className="card-section-content"
            dangerouslySetInnerHTML={{ __html: highlightGameTerms(selected.effect) }}
          />
        </div>

        {selected.unlock_requirement && (
          <div className="card-section">
            <h3 className="card-section-title">Unlock Requirement</h3>
            <p className="card-section-content">
              <span className="card-tag unlock inline-block mb-2">
                🔓 Unlock Method
              </span>
              <br />
              <span dangerouslySetInnerHTML={{ 
                __html: highlightGameTerms(selected.unlock_requirement) 
              }} />
            </p>
          </div>
        )}

        {selected.additional && (
          <div className="card-section">
            <h3 className="card-section-title">Additional Info</h3>
            <p 
              className="card-section-content"
              dangerouslySetInnerHTML={{ __html: highlightGameTerms(selected.additional) }}
            />
          </div>
        )}
      </div>
    </CategoryLayout>
  )
} 