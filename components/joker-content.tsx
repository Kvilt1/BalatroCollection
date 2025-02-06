"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import { UnlockRequirement } from "./unlock-requirement"
import { cn } from "@/lib/utils"
import { Joker } from "@/types/joker"
import { EffectText } from "./effect-text"

interface JokerItem {
  id: string
  name: string
  description: string
  rarity: string
  type: string
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

  // Map of joker names to their types
  const jokerTypes: { [key: string]: string } = {
    "Joker": "+m",
    "Greedy Joker": "+m",
    "Lusty Joker": "+m",
    "Wrathful Joker": "+m",
    "Gluttonous Joker": "+m",
    "Jolly Joker": "+m",
    "Zany Joker": "+m",
    "Mad Joker": "+m",
    "Crazy Joker": "+m",
    "Droll Joker": "+m",
    "Sly Joker": "+c",
    "Wily Joker": "+c",
    "Clever Joker": "+c",
    "Devious Joker": "+c",
    "Crafty Joker": "+c",
    "Half Joker": "+m",
    "Stencil": "Xm",
    "Four Fingers": "!!",
    "Mime": "...",
    "Credit Card": "+$",
    "Ceremonial Dagger": "!!",
    "Banner": "+c",
    "Mystic Summit": "+m",
    "Marble Joker": "!!",
    "Loyalty Card": "Xm",
    "8 Ball": "!!",
    "Misprint": "+m",
    "Dusk": "...",
    "Raised Fist": "+m",
    "Chaos the Clown": "!!",
    "Fibonacci": "++",
    "Steel Joker": "Xm",
    "Scary Face": "+c",
    "Abstract Joker": "+m",
    "Delayed Gratification": "+$",
    "Hack": "...",
    "Pareidolia": "!!",
    "Gros Michel": "+m",
    "Even Steven": "+m",
    "Odd Todd": "+c",
    "Scholar": "++",
    "Business Card": "+$",
    "Supernova": "+m",
    "Ride the Bus": "+m",
    "Space Joker": "!!",
    "Egg": "+$",
    "Burglar": "!!",
    "Blackboard": "Xm",
    "Runner": "+c",
    "Ice Cream": "+c",
    "DNA": "!!",
    "Splash": "!!",
    "Blue Joker": "+c",
    "Sixth Sense": "!!",
    "Constellation": "Xm",
    "Hiker": "+c",
    "Faceless Joker": "+$",
    "Green Joker": "+m",
    "Superposition": "!!",
    "To Do List": "+$",
    "Cavendish": "Xm",
    "Card Sharp": "Xm",
    "Red Card": "+m",
    "Madness": "Xm",
    "Square Joker": "+c",
    "Séance": "!!",
    "Riff-raff": "!!",
    "Vampire": "Xm",
    "Shortcut": "!!",
    "Hologram": "Xm",
    "Vagabond": "!!",
    "Baron": "Xm",
    "Cloud 9": "+$",
    "Rocket": "+$",
    "Obelisk": "Xm",
    "Midas Mask": "!!",
    "Luchador": "!!",
    "Photograph": "Xm",
    "Gift Card": "+$",
    "Turtle Bean": "!!",
    "Erosion": "+m",
    "Reserved Parking": "+$",
    "Mail-In Rebate": "+$",
    "To the Moon": "+$",
    "Hallucination": "!!",
    "Fortune Teller": "+m",
    "Juggler": "!!",
    "Drunkard": "!!",
    "Stone Joker": "+c",
    "Golden Joker": "+$",
    "Lucky Cat": "Xm",
    "Baseball Card": "Xm",
    "Bull": "+c",
    "Diet Cola": "!!",
    "Trading Card": "+$",
    "Flash Card": "+m",
    "Popcorn": "+m",
    "Spare Trousers": "+m",
    "Ancient Joker": "Xm",
    "Ramen": "Xm",
    "Walkie Talkie": "++",
    "Seltzer": "...",
    "Castle": "+c",
    "Smiley Face": "+m",
    "Campfire": "Xm",
    "Golden Ticket": "+$",
    "Mr. Bones": "!!",
    "Acrobat": "Xm",
    "Sock and Buskin": "...",
    "Swashbuckler": "+m",
    "Troubadour": "!!",
    "Certificate": "!!",
    "Smeared Joker": "!!",
    "Throwback": "Xm",
    "Hanging Chad": "...",
    "Rough Gem": "+$",
    "Bloodstone": "Xm",
    "Arrowhead": "+c",
    "Onyx Agate": "+m",
    "Glass Joker": "Xm",
    "Showman": "!!",
    "Flower Pot": "Xm",
    "Blueprint": "!!",
    "Wee Joker": "+c",
    "Merry Andy": "!!",
    "Oops! All 6s": "!!",
    "The Idol": "Xm",
    "Seeing Double": "Xm",
    "Matador": "+$",
    "Hit the Road": "Xm",
    "The Duo": "Xm",
    "The Trio": "Xm",
    "The Family": "Xm",
    "The Order": "Xm",
    "The Tribe": "Xm",
    "Stuntman": "+c",
    "Invisible Joker": "!!",
    "Brainstorm": "!!",
    "Satellite": "+$",
    "Shoot the Moon": "+m",
    "Driver's License": "Xm",
    "Cartomancer": "!!",
    "Astronomer": "!!",
    "Burnt Joker": "!!",
    "Bootstraps": "+m",
    "Canio": "Xm",
    "Triboulet": "Xm",
    "Yorick": "Xm",
    "Chicot": "!!",
    "Perkeo": "!!"
  }

  return (
    <CategoryLayout
      title="Joker"
      items={items.map((item) => {
        const itemData: JokerItem = {
          id: item.id,
          name: item.name,
          description: item.effect,
          rarity: item.rarity || "Common",
          type: jokerTypes[item.name] || "",
          selected: item.id === selected.id,
          onClick: () => setSelected(item),
        }
        if (item.unlock_requirement) {
          itemData.unlockRequirement = item.unlock_requirement
        }
        return itemData
      })}
      showRarityFilter={true}
      showTypeFilter={true}
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
              width={200}
              height={300}
              className="rounded-lg shadow-lg"
              priority={true}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {selected.rarity && (
              <span className={`card-tag flex items-center gap-2 bg-[#1a1a1a] border ${
                selected.rarity === "Common" ? 'border-[#BCBCBC]' : 
                selected.rarity === "Uncommon" ? 'border-[#55A383]' :
                selected.rarity === "Rare" ? 'border-[#FD5F55]' :
                selected.rarity === "Legendary" ? 'border-[#C886F0]' : 'border-white/20'
              }`}>
                <Image
                  src={`/assets/rarity/${selected.rarity?.toLowerCase()}.png`}   
                  alt={selected.rarity || ''}
                  width={16}
                  height={16}
                />
                {selected.rarity}
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
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex flex-col gap-2">
              <EffectText text={selected.effect} highlight={highlightGameTerms} />
            </div>
          </div>

          {selected.additional && (
            <div className="card-section">
              <h3 className="card-section-title">Additional Info</h3>
              <div className="h-px bg-white/10 mb-4" />
              <div className="flex flex-col gap-2">
                <EffectText text={selected.additional} highlight={highlightGameTerms} />
              </div>
            </div>
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