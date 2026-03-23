import { useState, useRef, useCallback } from 'react'
import { buildMapApiUrl, fetchDPEPage } from '../lib/ademeApi'
import { MAX_RESULTS, MIN_ZOOM_TO_LOAD } from '../config/constants'
import type { DPERecord, PeriodFilter, EtiquetteFilter } from '../types'

interface UseDPELoaderReturn {
  records: DPERecord[]
  totalInZone: number
  isLoading: boolean
  belowMinZoom: boolean
  loadForBounds: (bounds: L.LatLngBounds, zoom: number) => void
}

export function useDPELoader(period: PeriodFilter, etiquette: EtiquetteFilter): UseDPELoaderReturn {
  const [records, setRecords] = useState<DPERecord[]>([])
  const [totalInZone, setTotalInZone] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [belowMinZoom, setBelowMinZoom] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  const loadForBounds = useCallback((bounds: L.LatLngBounds, zoom: number) => {
    if (zoom < MIN_ZOOM_TO_LOAD) {
      setBelowMinZoom(true)
      setRecords([])
      setTotalInZone(0)
      return
    }
    setBelowMinZoom(false)

    // Abort previous
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)

    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    const url = buildMapApiUrl(
      { south: sw.lat, west: sw.lng, north: ne.lat, east: ne.lng },
      period, etiquette,
    )

    const loadedMap = new Map<string, DPERecord>()

    const loadPage = async (pageUrl: string, loaded: number) => {
      try {
        const data = await fetchDPEPage(pageUrl, controller.signal)
        setTotalInZone(data.total || 0)

        for (const p of data.results) {
          if (p._geopoint && !loadedMap.has(p.numero_dpe)) {
            loadedMap.set(p.numero_dpe, p)
          }
        }

        setRecords(Array.from(loadedMap.values()))
        const newLoaded = loaded + data.results.length

        if (data.next && newLoaded < MAX_RESULTS) {
          await loadPage(data.next, newLoaded)
        } else {
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Erreur API:', err)
        }
        setIsLoading(false)
      }
    }

    loadPage(url, 0)
  }, [period, etiquette])

  return { records, totalInZone, isLoading, belowMinZoom, loadForBounds }
}
