import { Deck } from '@/lib/categories'
import { DeckContent } from '@/components/deck-content'

export const generateStaticParams = async () => {
  const decks = Deck.items
  return decks.map((deck) => ({
    id: deck.id,
  }))
}

export default function DecksPage() {
  return <DeckContent data={Deck} />
}

