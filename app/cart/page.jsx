'use client'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQty, removeItem } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery = subtotal >= 500 ? 0 : 49
  const total = subtotal + delivery

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-5">🛒</div>
        <h2 className="font-serif text-2xl font-bold text-[#1c1c1a] mb-3">Your cart is empty</h2>
        <p className="text-[#6b6b60] text-sm mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="bg-[var(--green)] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-[var(--green-mid)] transition-colors">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl font-bold text-[#1c1c1a] mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-black/7 flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-[var(--green-light)] flex items-center justify-center text-4xl shrink-0">
                {item.emoji || '🌿'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#1c1c1a] mb-0.5">{item.name}</h3>
                <p className="text-xs text-[#6b6b60] mb-2">{item.unit}</p>
                <p className="font-serif font-semibold text-[var(--green)]">₹{item.price}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600">
                  Remove
                </button>
                <div className="flex items-center gap-2 bg-[var(--green-light)] rounded-full px-3 py-1.5">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="text-[var(--green)] font-bold">−</button>
                  <span className="text-sm font-medium text-[var(--green)] w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-[var(--green)] font-bold">+</button>
                </div>
                <p className="text-sm font-semibold text-[#1c1c1a]">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border border-black/7 h-fit sticky top-24">
          <h3 className="font-serif text-lg font-semibold text-[#1c1c1a] mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#6b6b60]">
              <span>Subtotal</span>
              <span className="font-medium text-[#1c1c1a]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#6b6b60]">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'text-[var(--green)] font-medium' : 'font-medium text-[#1c1c1a]'}>
                {delivery === 0 ? 'Free' : `₹${delivery}`}
              </span>
            </div>
            {subtotal < 500 && (
              <p className="text-xs text-[var(--green-mid)] bg-[var(--green-light)] rounded-lg p-2">
                Add ₹{500 - subtotal} more for free delivery
              </p>
            )}
            <div className="border-t border-[#f0ece4] pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-serif text-xl text-[var(--green)]">₹{total}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full bg-[var(--green)] text-white text-center py-3 rounded-full font-semibold text-sm hover:bg-[var(--green-mid)] transition-colors"
          >
            Proceed to Checkout →
          </Link>
          <Link href="/products" className="mt-3 block text-center text-xs text-[#6b6b60] hover:text-[var(--green)]">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
