import data from '../../consolidated_balatro_data.json'
import { JokerContent } from '@/components/joker-content'

export const generateStaticParams = async () => {
  const jokers = data.Joker.items
  return jokers.map((joker) => ({
    id: joker.id,
  }))
}

export default function JokersPage() {
  return <JokerContent data={data.Joker} />
}

