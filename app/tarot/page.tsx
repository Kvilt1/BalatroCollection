"use client"

import { useState } from "react"
import Image from "next/image"
import { CategoryLayout } from "@/components/category-layout"
import { Tarot } from '@/lib/categories'
import { EffectText } from "@/components/effect-text"
import { RelatedItems } from "@/components/related-items"
import { TarotContent } from '@/components/tarot-content'

interface ItemData {
  id: string
  name: string
  description: string
  unlockRequirement?: string
  selected: boolean
  onClick: () => void
}

interface TarotItem {
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

export const generateStaticParams = async () => {
  const tarotCards = Tarot.items
  return tarotCards.map((card) => ({
    id: card.id,
  }))
}

export default function TarotPage() {
  return <TarotContent data={Tarot} />
} 