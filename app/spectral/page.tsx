import { Spectral } from '@/lib/categories'
import { SpectralContent } from '@/components/spectral-content'

export const generateStaticParams = async () => {
  const spectralCards = Spectral.items
  return spectralCards.map((card) => ({
    id: card.id,
  }))
}

export default function SpectralPage() {
  return <SpectralContent data={Spectral} />
}

