import { Blind } from '@/lib/categories'
import { BlindContent } from '@/components/blind-content'

export const generateStaticParams = async () => {
  const blinds = Blind.items
  return blinds.map((blind) => ({
    id: blind.id,
  }))
}

export default function BlindPage() {
  return <BlindContent data={Blind} />
} 