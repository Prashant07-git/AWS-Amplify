'use client'

import { useEffect, useRef, useState } from 'react'

export function notifyCartAdded(productName) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent('harvestco:cart-added', {
    detail: { productName },
  }))
}

export function openCartDrawer() {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new Event('harvestco:open-cart'))
}

export default function CartToast() {
  const timeoutRef = useRef(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    function handleCartAdded(event) {
      const productName = event.detail?.productName || 'Item'

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)

      setToast({ productName })
      timeoutRef.current = window.setTimeout(() => {
        setToast(null)
      }, 2800)
    }

    window.addEventListener('harvestco:cart-added', handleCartAdded)

    return () => {
      window.removeEventListener('harvestco:cart-added', handleCartAdded)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!toast) return null

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      <div>
        <div className="cart-toast-title">{toast.productName} added to cart</div>
        <div className="cart-toast-subtitle">Your cart has been updated.</div>
      </div>
      <button
        type="button"
        className="cart-toast-action"
        onClick={() => {
          openCartDrawer()
          setToast(null)
        }}
      >
        View cart
      </button>
    </div>
  )
}
