import { Joker } from '@/lib/categories'
import { JokerContent } from '@/components/joker-content'

export const generateStaticParams = async () => {
  const jokers = Joker.items
  return jokers.map((joker) => ({
    id: joker.id,
  }))
}

export default function JokersPage() {
  return <JokerContent data={Joker} />
}

