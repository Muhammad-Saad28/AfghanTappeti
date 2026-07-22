import Link from "next/link"

export default async function CheckoutSuccessPage(props: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await props.searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center text-2xl mb-6">
        ✓
      </div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">Thank You!</h1>
      <p className="text-on-surface-variant font-body-md max-w-md mb-2">
        Your order has been placed successfully.
      </p>
      {order && (
        <p className="font-label-md text-label-md text-on-surface mb-8">
          Order number: <span className="text-secondary">{order}</span>
        </p>
      )}
      <p className="font-body-md text-on-surface-variant mb-8 max-w-md">
        We will send a confirmation to your email with payment instructions. Your rugs will be shipped once payment is confirmed.
      </p>
      <div className="flex gap-4">
        <Link
          href="/shop"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md no-underline hover:bg-surface-variant transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
