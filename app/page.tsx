"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import data from '../consolidated_balatro_data.json'

interface CardItem {
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
}

interface CardCategory {
  image_folder: string
  items: CardItem[]
}

interface BalatraData {
  Blind: CardCategory
  Booster: CardCategory
  Deck: CardCategory
  Enhancement: CardCategory
  Joker: CardCategory
  Planet: CardCategory
  Seal: CardCategory
  Spectral: CardCategory
  Tag: CardCategory
  Tarot: CardCategory
  Voucher: CardCategory
  VoucherPlus: CardCategory
}

const typedData = data as BalatraData

const categories = [
  {
    name: "Vouchers",
    description: "Special items that modify gameplay",
    icon: "🎫",
    href: "/vouchers",
  },
  {
    name: "Voucher Plus",
    description: "Upgraded versions of Vouchers",
    icon: "⭐",
    href: "/vouchers-plus",
  },
  {
    name: "Spectral Cards",
    description: "Mystical cards with unique effects",
    icon: "👻",
    href: "/spectral",
  },
  {
    name: "Seals",
    description: "Powerful modifiers for your cards",
    icon: "🔒",
    href: "/seals",
  },
  {
    name: "Jokers",
    description: "Special cards that grant unique abilities",
    icon: "🃏",
    href: "/jokers",
  },
  {
    name: "Boosters",
    description: "Card packs with various effects",
    icon: "📦",
    href: "/boosters",
  },
  {
    name: "Planets",
    description: "Celestial cards with powerful effects",
    icon: "🌍",
    href: "/planets",
  },
  {
    name: "Tarot",
    description: "Mystical cards that alter your deck",
    icon: "🎴",
    href: "/tarot",
  },
  {
    name: "Enhancements",
    description: "Modifications for your playing cards",
    icon: "⚡",
    href: "/enhancements",
  },
  {
    name: "Tags",
    description: "Special modifiers for your run",
    icon: "🏷️",
    href: "/tags",
  },
  {
    name: "Blinds",
    description: "Challenges to overcome",
    icon: "🎯",
    href: "/blind",
  },
  {
    name: "Decks",
    description: "Different starting configurations",
    icon: "🎴",
    href: "/decks",
  },
]

const allCards = [
  ...typedData.Voucher.items.map(item => ({ name: item.name, category: "Vouchers", href: `/vouchers?card=${item.id}` })),
  ...typedData.VoucherPlus.items.map(item => ({ name: item.name, category: "Voucher Plus", href: `/vouchers-plus?card=${item.id}` })),
  ...typedData.Spectral.items.map(item => ({ name: item.name, category: "Spectral Cards", href: `/spectral?card=${item.id}` })),
  ...typedData.Seal.items.map(item => ({ name: item.name, category: "Seals", href: `/seals?card=${item.id}` })),
  ...typedData.Joker.items.map(item => ({ name: item.name, category: "Jokers", href: `/jokers?card=${item.id}` })),
  ...typedData.Booster.items.map(item => ({ name: item.name, category: "Boosters", href: `/boosters?card=${item.id}` })),
  ...typedData.Planet.items.map(item => ({ name: item.name, category: "Planets", href: `/planets?card=${item.id}` })),
  ...typedData.Tarot.items.map(item => ({ name: item.name, category: "Tarot", href: `/tarot?card=${item.id}` })),
  ...typedData.Enhancement.items.map(item => ({ name: item.name, category: "Enhancements", href: `/enhancements?card=${item.id}` })),
  ...typedData.Tag.items.map(item => ({ name: item.name, category: "Tags", href: `/tags?card=${item.id}` })),
  ...typedData.Blind.items.map(item => ({ name: item.name, category: "Blinds", href: `/blind?card=${item.id}` })),
  ...typedData.Deck.items.map(item => ({ name: item.name, category: "Decks", href: `/decks?card=${item.id}` })),
]

export default function HomePage() {
  const [search, setSearch] = useState("")

  const filteredCards = allCards.filter((card) => card.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">Card Compendium</h1>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
          <Input
            type="search"
            placeholder="Search all cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        {search ? (
          <div className="grid gap-2 mb-8">
            {filteredCards.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className="flex items-center justify-between p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
              >
                <span className="text-white">{card.name}</span>
                <span className="text-white/50 text-sm">{card.category}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm p-6 transition-all hover:bg-black/30 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <h2 className="text-xl font-semibold text-white mb-2">{category.name}</h2>
                    <p className="text-sm text-gray-300">{category.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg transition-colors group-hover:border-white/20" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

