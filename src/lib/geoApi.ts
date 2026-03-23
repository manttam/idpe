import { GEO_API_BASE } from '../config/constants'
import type { CommuneResult } from '../types'

export async function searchCommunes(query: string): Promise<CommuneResult[]> {
  const url = `${GEO_API_BASE}?nom=${encodeURIComponent(query)}&fields=nom,codesPostaux,centre&boost=population&limit=6`
  const res = await fetch(url)
  if (!res.ok) return []
  return res.json()
}
