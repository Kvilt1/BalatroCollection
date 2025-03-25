import { Voucher } from '@/lib/categories'
import { VoucherContent } from '@/components/voucher-content'

export const generateStaticParams = async () => {
  const vouchers = Voucher.items
  return vouchers.map((voucher) => ({
    id: voucher.id,
  }))
}

export default function VouchersPage() {
  return <VoucherContent data={Voucher} />
}

