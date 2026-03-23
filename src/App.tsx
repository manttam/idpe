import { useState, useRef, useCallback, useMemo } from 'react'
import type L from 'leaflet'
import type { PeriodFilter, EtiquetteFilter } from './types'
import { MIN_ZOOM_TO_LOAD } from './config/constants'
import { useDPELoader } from './hooks/useDPELoader'
import { useRefreshTimer } from './hooks/useRefreshTimer'
import { useAlerts } from './hooks/useAlerts'
import { Header } from './components/Header'
import { DPEMap } from './components/Map/DPEMap'
import { FilterControls } from './components/Controls/FilterControls'
import { CitySearch } from './components/Controls/CitySearch'
import { Legend } from './components/Legend'
import { RefreshInfo } from './components/RefreshInfo'
import { AlertPanel } from './components/AlertPanel/AlertPanel'

export default function App() {
  const [period, setPeriod] = useState<PeriodFilter>('all')
  const [etiquette, setEtiquette] = useState<EtiquetteFilter>('all')
  const [alertPanelOpen, setAlertPanelOpen] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  const { records, totalInZone, isLoading, belowMinZoom, loadForBounds } = useDPELoader(period, etiquette)
  const alertsHook = useAlerts()

  const handleRefresh = useCallback(() => {
    if (mapRef.current) {
      loadForBounds(mapRef.current.getBounds(), mapRef.current.getZoom())
    }
  }, [loadForBounds])

  const { countdown, reset: manualRefresh } = useRefreshTimer(handleRefresh)

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds, zoom: number) => {
    loadForBounds(bounds, zoom)
  }, [loadForBounds])

  const handleCitySelect = useCallback((lat: number, lng: number) => {
    mapRef.current?.setView([lat, lng], 14)
  }, [])

  // Stats
  const fgCount = useMemo(() =>
    records.filter(r => r.etiquette_dpe === 'F' || r.etiquette_dpe === 'G').length,
    [records]
  )
  const fgPercent = records.length > 0 ? (fgCount / records.length * 100).toFixed(1) : '0'
  const totalLabel = belowMinZoom
    ? `Zoomez (>${MIN_ZOOM_TO_LOAD})`
    : `${totalInZone.toLocaleString('fr-FR')} dans la zone`

  return (
    <div className="font-sans bg-slate-900 text-slate-200 min-h-screen">
      <Header
        totalLabel={totalLabel}
        displayedCount={records.length}
        fgCount={fgCount}
        fgPercent={fgPercent}
        alertCount={alertsHook.alerts.length}
        onToggleAlerts={() => setAlertPanelOpen(o => !o)}
      />

      <div className="relative">
        <DPEMap
          records={records}
          isLoading={isLoading}
          onBoundsChange={handleBoundsChange}
          mapRef={mapRef}
        />

        {/* Controls overlay */}
        <div className="absolute top-2.5 left-[50px] z-[500] flex flex-col gap-1.5">
          <FilterControls
            period={period}
            etiquette={etiquette}
            onPeriodChange={setPeriod}
            onEtiquetteChange={setEtiquette}
          />
          <CitySearch onCitySelect={handleCitySelect} />
        </div>

        <Legend />
        <RefreshInfo countdown={countdown} onRefresh={manualRefresh} />
      </div>

      <AlertPanel
        isOpen={alertPanelOpen}
        onClose={() => setAlertPanelOpen(false)}
        alerts={alertsHook.alerts}
        editingAlert={alertsHook.editingAlert}
        onCreateAlert={alertsHook.createAlert}
        onUpdateAlert={alertsHook.updateAlert}
        onDeleteAlert={alertsHook.deleteAlert}
        onEditAlert={alertsHook.setEditingId}
        onCancelEdit={() => alertsHook.setEditingId(null)}
      />
    </div>
  )
}
