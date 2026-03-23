import { API_BASE, PAGE_SIZE } from '../config/constants'
import type { DPERecord, PeriodFilter, EtiquetteFilter, Alert } from '../types'
import { getMinDate, getSevenDaysAgo } from './dateUtils'

interface APIResponse {
  total: number
  next?: string
  results: DPERecord[]
}

const DPE_SELECT_FIELDS = [
  'numero_dpe', 'etiquette_dpe', 'etiquette_ges', 'adresse_ban',
  'nom_commune_ban', 'code_postal_ban', '_geopoint',
  'date_etablissement_dpe', 'date_fin_validite_dpe',
  'type_batiment', 'surface_habitable_logement',
].join(',')

export function buildMapApiUrl(
  bounds: { south: number; west: number; north: number; east: number },
  period: PeriodFilter,
  etiquette: EtiquetteFilter,
): string {
  const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`
  const params = [
    `size=${PAGE_SIZE}`,
    `bbox=${bbox}`,
    `select=${DPE_SELECT_FIELDS}`,
    'sort=-date_etablissement_dpe',
  ]

  const minDate = getMinDate(period)
  if (minDate) params.push(`date_etablissement_dpe_gte=${minDate}`)

  if (etiquette !== 'all') {
    if (etiquette === 'FG') {
      params.push('etiquette_dpe_in=F,G')
    } else {
      params.push(`etiquette_dpe_eq=${etiquette}`)
    }
  }

  return `${API_BASE}?${params.join('&')}`
}

export function buildAlertApiUrl(alert: Alert): string {
  const minDate = getSevenDaysAgo()
  const params = [
    'size=100',
    `nom_commune_ban_eq=${encodeURIComponent(alert.commune)}`,
    `date_etablissement_dpe_gte=${minDate}`,
    `select=${DPE_SELECT_FIELDS}`,
    'sort=-date_etablissement_dpe',
  ]

  if (alert.surfaceMin) params.push(`surface_habitable_logement_gte=${alert.surfaceMin}`)
  if (alert.surfaceMax) params.push(`surface_habitable_logement_lte=${alert.surfaceMax}`)
  if (alert.etiquette) params.push(`etiquette_dpe_eq=${alert.etiquette}`)

  return `${API_BASE}?${params.join('&')}`
}

export async function fetchDPEPage(
  url: string,
  signal?: AbortSignal,
): Promise<APIResponse> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
