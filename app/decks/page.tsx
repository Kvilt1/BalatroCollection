"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"

const decks = [
  {
    id: "magic",
    name: "Magic",
    description: "Start run with the Crystal Ball voucher active and two copies of The Fool",
    effect: "Start run with the Crystal Ball voucher active and two copies of The Fool.",
    unlockRequirement: "Win a run with Red Deck on any difficulty.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balatro-compendium-2-yrwocCQfNJRgTkNCIVoqBNwYqKEdLf.png",
  },
  {
    id: "nebula",
    name: "Nebula",
    description: "Start run with the Telescope active",
    effect: "Start run with the Telescope active",
    unlockRequirement: "Complete specific challenge",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balatro-compendium-2-yrwocCQfNJRgTkNCIVoqBNwYqKEdLf.png",
  },
]

export default function DecksPage() {
  const [selected, setSelected] = useState(decks[0])

  return (
    <CategoryLayout
      title="Deck"
      items={decks.map((deck) => ({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        unlockRequirement: deck.unlockRequirement,
        onClick: () => setSelected(deck),
      }))}
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
        <div className="flex justify-center">
          <Image
            src={selected.image || "/placeholder.svg"}
            alt={selected.name}
            width={200}
            height={300}
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Effect</h3>
          <p className="text-white/90">{selected.effect}</p>
        </div>
      </div>
    </CategoryLayout>
  )
}

