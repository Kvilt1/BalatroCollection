"use client"

import { useFavorites } from "@/contexts/favorites-context"
import data from '../../consolidated_balatro_data.json'
import Link from "next/link"
import Image from "next/image"
import { EffectText } from "@/components/effect-text"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()

  const favoriteCards = Object.entries(data).flatMap(([category, categoryData]) => 
    categoryData.items
      .filter(item => favorites.includes(item.id))
      .map(item => ({
        ...item,
        category,
        image_folder: categoryData.image_folder
      }))
  )

  if (favoriteCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-white/50 hover:text-white">
              ← Back to Categories
            </Link>
          </div>
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h1>
            <p className="text-white/60">
              Click the heart icon on any card to add it to your favorites
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="text-white/50 hover:text-white">
            ← Back to Categories
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-8">Favorites</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteCards.map(card => (
            <div 
              key={card.id}
              className="bg-black/20 rounded-lg p-4 relative group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={`${card.image_folder}${card.appearance}`}
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white mb-1">{card.name}</h2>
                  <p className="text-sm text-white/50 mb-2">{card.category}</p>
                  <EffectText 
                    text={card.effect} 
                    className="text-sm text-white/70 line-clamp-2"
                  />
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(card.id)}
                className="absolute top-2 right-2 p-1 text-white/40 hover:text-red-500 transition-colors"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <Link
                href={`/${card.category.toLowerCase()}?card=${card.id}`}
                className="absolute inset-0"
              >
                <span className="sr-only">View {card.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 