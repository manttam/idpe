export interface DPERecord {
  numero_dpe: string
  etiquette_dpe: string
  etiquette_ges: string
  adresse_ban: string
  nom_commune_ban: string
  code_postal_ban: string
  _geopoint: string // "lat,lng"
  date_etablissement_dpe: string
  date_fin_validite_dpe: string
  type_batiment: string
  surface_habitable_logement: number | null
}

export interface CommuneResult {
  nom: string
  codesPostaux: string[]
  centre?: { coordinates: [number, number] } // [lng, lat]
}

export interface Alert {
  id: string
  email: string
  commune: string
  surfaceMin: number | null
  surfaceMax: number | null
  etiquette: string | null
  frequence: number // seconds
  createdAt: string
  lastCheck: string | null
  lastNotified: string | null
}

export interface AlertFormData {
  email: string
  commune: string
  surfaceMin: number | null
  surfaceMax: number | null
  etiquette: string | null
  frequence: number
}

export type PeriodFilter = 'all' | '1w' | '2w' | '1m' | '3m' | '1y'
export type EtiquetteFilter = 'all' | 'A' | 'B' | 'C' | 'D' | 'E' | 'FG'
