import { Tag } from '@/lib/categories'
import { TagContent } from '@/components/tag-content'

export const generateStaticParams = async () => {
  const tags = Tag.items
  return tags.map((tag) => ({
    id: tag.id,
  }))
}

export default function TagsPage() {
  return <TagContent data={Tag} />
} 