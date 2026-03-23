export const API_BASE = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines'
export const GEO_API_BASE = 'https://geo.api.gouv.fr/communes'

export const PAGE_SIZE = 1000
export const MAX_RESULTS = 2000
export const MIN_ZOOM_TO_LOAD = 12
export const REFRESH_INTERVAL = 30 // seconds
export const ALERT_CHECK_INTERVAL = 60 // seconds

export const DEFAULT_CENTER: [number, number] = [46.6, 2.5]
export const DEFAULT_ZOOM = 6
export const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export const PERIOD_OPTIONS = [
  { value: 'all', label: 'Tout' },
  { value: '1w', label: '7j' },
  { value: '2w', label: '14j' },
  { value: '1m', label: '1 mois' },
  { value: '3m', label: '3 mois' },
  { value: '1y', label: '1 an' },
] as const

export const ETIQUETTE_OPTIONS = [
  { value: 'all', label: 'Toutes', color: undefined },
  { value: 'A', label: 'A', color: '#319834' },
  { value: 'B', label: 'B', color: '#33cc31' },
  { value: 'C', label: 'C', color: '#cbfc33' },
  { value: 'D', label: 'D', color: '#fbea00' },
  { value: 'E', label: 'E', color: '#f0b400' },
  { value: 'FG', label: 'F+G', color: '#d7221f' },
] as const

export const FREQUENCY_OPTIONS = [
  { value: 3600, label: 'Toutes les heures' },
  { value: 21600, label: 'Toutes les 6 heures' },
  { value: 43200, label: 'Toutes les 12 heures' },
  { value: 86400, label: '1 fois par jour' },
] as const
