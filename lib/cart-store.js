import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem(product) {
        const items    = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          const maxQty = Number(existing.stock)
          const nextQty = maxQty > 0 ? Math.min(existing.qty + 1, maxQty) : existing.qty + 1
          set({ items: items.map(i =>
            i.id === product.id ? { ...i, qty: nextQty } : i
          )})
        } else {
          set({ items: [...items, { ...product, qty: 1 }] })
        }
      },

      removeItem(id) {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      updateQty(id, qty) {
        if (qty < 1) return get().removeItem(id)
        set({ items: get().items.map(i => {
          if (i.id !== id) return i
          const maxQty = Number(i.stock)
          const nextQty = maxQty > 0 ? Math.min(qty, maxQty) : qty
          return { ...i, qty: nextQty }
        }) })
      },

      clearCart() { set({ items: [] }) },

      // ✅ Plain functions — NOT JS getters (getters break Zustand)
      getTotal()     { return get().items.reduce((s, i) => s + Number(i.price) * i.qty, 0) },
      getItemCount() { return get().items.reduce((s, i) => s + i.qty, 0) },
    }),
    { name: 'rr-organic-cart' }
  )
)
