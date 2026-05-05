'use client'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'
import { notifyCartAdded } from '@/components/CartToast'

export default function AddToCartBtn({ product, emoji }) {
  const addItem   = useCartStore(s => s.addItem)
  const updateQty = useCartStore(s => s.updateQty)
  const cartItem  = useCartStore(s => s.items.find(i => i.id === product.id))
  const router    = useRouter()
  const qty       = cartItem?.qty || 0
  const isAtStockLimit = product.stock > 0 && qty >= product.stock

  function handleAdd() {
    if (product.stock === 0 || isAtStockLimit) return

    addItem({ ...product, emoji })
    notifyCartAdded(product.name)
  }

  function handleDecrease() {
    updateQty(product.id, qty - 1)
  }

  if (product.stock === 0) {
    return (
      <button type="button" disabled className="product-detail-add-button">
        Out of stock
      </button>
    )
  }

  return (
    <div className="product-detail-cart-actions">
      {qty > 0 ? (
        <>
          <div className="product-detail-qty-stepper" aria-label={`${product.name} quantity in cart`}>
            <button type="button" onClick={handleDecrease} aria-label={`Decrease ${product.name} quantity`}>-</button>
            <span>{qty}</span>
            <button type="button" onClick={handleAdd} disabled={isAtStockLimit} aria-label={`Increase ${product.name} quantity`}>+</button>
          </div>
          <button type="button" onClick={() => router.push('/checkout')} className="product-detail-checkout-button">
            Checkout
          </button>
        </>
      ) : (
        <button type="button" onClick={handleAdd} className="product-detail-add-button">
          Add to cart
        </button>
      )}
    </div>
  )
}
