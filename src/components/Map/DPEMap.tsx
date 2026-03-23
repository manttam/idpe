import { useCallback } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import type L from 'leaflet'
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_URL } from '../../config/constants'
import type { DPERecord } from '../../types'
import { DPEMarkerLayer } from './DPEMarkerLayer'
import { LoadingBar } from './LoadingBar'

interface Props {
  records: DPERecord[]
  isLoading: boolean
  onBoundsChange: (bounds: L.LatLngBounds, zoom: number) => void
  mapRef: React.MutableRefObject<L.Map | null>
}

function MapEvents({ onBoundsChange, mapRef }: Pick<Props, 'onBoundsChange' | 'mapRef'>) {
  useMapEvents({
    moveend(e) {
      const map = e.target as L.Map
      mapRef.current = map
      onBoundsChange(map.getBounds(), map.getZoom())
    },
  })
  return null
}

export function DPEMap({ records, isLoading, onBoundsChange, mapRef }: Props) {
  const handleReady = useCallback((map: L.Map) => {
    mapRef.current = map
  }, [mapRef])

  return (
    <div className="relative h-[calc(100vh-55px)]">
      <LoadingBar isLoading={isLoading} />
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        attributionControl={false}
        className="h-full w-full bg-slate-900"
        ref={(instance) => { if (instance) handleReady(instance) }}
      >
        <TileLayer url={TILE_URL} maxZoom={19} />
        <MapEvents onBoundsChange={onBoundsChange} mapRef={mapRef} />
        <DPEMarkerLayer records={records} />
      </MapContainer>
    </div>
  )
}
