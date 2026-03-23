import type { PeriodFilter } from '../types'

export function getMinDate(period: PeriodFilter): string | null {
  if (period === 'all') return null
  const d = new Date()
  switch (period) {
    case '1w': d.setDate(d.getDate() - 7); break
    case '2w': d.setDate(d.getDate() - 14); break
    case '1m': d.setMonth(d.getMonth() - 1); break
    case '3m': d.setMonth(d.getMonth() - 3); break
    case '1y': d.setFullYear(d.getFullYear() - 1); break
  }
  return d.toISOString().split('T')[0]
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

export function getSevenDaysAgo(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().split('T')[0]
}
