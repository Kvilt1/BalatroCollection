import { Tarot } from '@/lib/categories'
import { TarotContent } from '@/components/tarot-content'

export const generateStaticParams = async () => {
  const tarotCards = Tarot.items
  return tarotCards.map((card) => ({
    id: card.id,
  }))
}

export default function TarotPage() {
  return <TarotContent data={Tarot} />
} 