import { Booster } from '@/lib/categories'
import { BoosterContent } from '@/components/booster-content'

export const generateStaticParams = async () => {
  const boosters = Booster.items
  return boosters.map((booster) => ({
    id: booster.id,
  }))
}

export default function BoostersPage() {
  return <BoosterContent data={Booster} />
}

