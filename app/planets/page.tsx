import { Planet } from '@/lib/categories'
import { PlanetContent } from '@/components/planet-content'

export const generateStaticParams = async () => {
  const planets = Planet.items
  return planets.map((planet) => ({
    id: planet.id,
  }))
}

export default function PlanetsPage() {
  return <PlanetContent data={Planet} />
} 