import Link from "next/link"

interface RelatedItemsProps {
  items: string[]
  category: string
}

export function RelatedItems({ items, category }: RelatedItemsProps) {
  if (!items || items.length === 0) return null

  const getCategoryPath = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "Voucher": "vouchers",
      "Voucher Plus": "vouchers-plus",
      "Spectral Card": "spectral",
      "Seal": "seals",
      "Joker": "jokers",
      "Booster": "boosters",
      "Planet": "planets",
      "Tarot": "tarot",
      "Enhancement": "enhancements",
      "Tag": "tags",
      "Blind": "blind",
      "Deck": "decks",
      "Overstock": "vouchers",
      "Overstock Plus": "vouchers-plus"
    }
    return categoryMap[category] || category.toLowerCase()
  }

  const getItemCategory = (item: string) => {
    if (item.includes("Overstock Plus")) return "Overstock Plus"
    if (item.includes("Overstock")) return "Overstock"
    return category
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Related Items</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={`/${getCategoryPath(getItemCategory(item))}?card=${item}`}
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  )
} 