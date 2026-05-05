export function formatINR(value) {
  const amount = Number(value)
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const hasPaise = Math.round(safeAmount * 100) % 100 !== 0

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: hasPaise ? 2 : 0,
  }).format(safeAmount)
}
