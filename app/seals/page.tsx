import { Seal } from '@/lib/categories'
import { SealContent } from '@/components/seal-content'

export const generateStaticParams = async () => {
  const seals = Seal.items
  return seals.map((seal) => ({
    id: seal.id,
  }))
}

export default function SealsPage() {
  return <SealContent data={Seal} />
}

