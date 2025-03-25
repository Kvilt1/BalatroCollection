import { Enhancement } from '@/lib/categories'
import { EnhancementContent } from '@/components/enhancement-content'

export const generateStaticParams = async () => {
  const enhancements = Enhancement.items
  return enhancements.map((enhancement) => ({
    id: enhancement.id,
  }))
}

export default function EnhancementsPage() {
  return <EnhancementContent data={Enhancement} />
} 