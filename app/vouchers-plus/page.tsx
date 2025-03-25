import { VoucherPlus } from '@/lib/categories'
import { VoucherPlusContent } from '@/components/voucher-plus-content'

export const generateStaticParams = async () => {
  const vouchers = VoucherPlus.items
  return vouchers.map((voucher) => ({
    id: voucher.id,
  }))
}

export default function VouchersPlusPage() {
  return <VoucherPlusContent data={VoucherPlus} />
} 