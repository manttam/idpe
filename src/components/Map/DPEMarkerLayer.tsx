import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { DPERecord } from '../../types'
import { getDPEColor } from '../../config/dpeColors'
import { formatDate, daysUntil } from '../../lib/dateUtils'

interface Props {
  records: DPERecord[]
}

export function DPEMarkerLayer({ records }: Props) {
  const map = useMap()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null)

  useEffect(() => {
    if (!clusterRef.current) {
      clusterRef.current = (L as any).markerClusterGroup({
        maxClusterRadius: 50,
        disableClusteringAtZoom: 18,
        chunkedLoading: true,
        chunkInterval: 50,
      })
      map.addLayer(clusterRef.current)
    }

    const cg = clusterRef.current
    cg.clearLayers()

    const markers = records.map(p => {
      const [lat, lng] = p._geopoint.split(',').map(Number)
      if (isNaN(lat) || isNaN(lng)) return null

      const color = getDPEColor(p.etiquette_dpe)
      const m = L.circleMarker([lat, lng], {
        radius: 5, fillColor: color, color: 'rgba(255,255,255,0.2)',
        weight: 1, fillOpacity: 0.85,
      })

      m.bindPopup(buildPopupHTML(p), { maxWidth: 280 })
      return m
    }).filter(Boolean) as L.CircleMarker[]

    cg.addLayers(markers)

    return () => {
      cg.clearLayers()
    }
  }, [records, map])

  // Adjust radius on zoom
  useEffect(() => {
    const onZoom = () => {
      const z = map.getZoom()
      const r = z >= 18 ? 8 : z >= 16 ? 6 : 5
      clusterRef.current?.eachLayer((layer: L.Layer) => {
        if ('setRadius' in layer && typeof (layer as L.CircleMarker).setRadius === 'function') {
          (layer as L.CircleMarker).setRadius(r)
        }
      })
    }
    map.on('zoomend', onZoom)
    return () => { map.off('zoomend', onZoom) }
  }, [map])

  return null
}

function buildPopupHTML(p: DPERecord): string {
  const etiq = p.etiquette_dpe || '?'
  const ges = p.etiquette_ges || '?'
  const colors: Record<string, string> = {
    A: '#319834', B: '#33cc31', C: '#cbfc33', D: '#fbea00',
    E: '#f0b400', F: '#ec6731', G: '#d7221f',
  }
  const dark = (l: string) => ['B','C','D','E'].includes(l) ? '#1a1a1a' : '#fff'

  let validHtml = ''
  if (p.date_fin_validite_dpe) {
    const days = daysUntil(p.date_fin_validite_dpe)
    if (days > 365) validHtml = `<span style="color:#4ade80;font-size:0.7rem">Valide encore ${Math.floor(days/365)} ans</span>`
    else if (days > 0) validHtml = `<span style="color:#f59e0b;font-size:0.7rem">Expire dans ${days} jours</span>`
    else validHtml = `<span style="color:#f59e0b;font-size:0.7rem">Expiré</span>`
  }

  return `
    <div style="font-weight:700;font-size:0.84rem;margin-bottom:4px;color:#f8fafc">${p.adresse_ban || ''}</div>
    <div style="text-align:center;margin:5px 0">
      <span style="display:inline-block;padding:2px 10px;border-radius:4px;font-weight:800;font-size:0.9rem;background:${colors[etiq]||'#64748b'};color:${dark(etiq)}">${etiq}</span>
      <span style="font-size:0.7rem;color:#94a3b8;margin:0 4px">GES</span>
      <span style="display:inline-block;padding:1px 7px;border-radius:4px;font-weight:800;font-size:0.75rem;background:${colors[ges]||'#64748b'};color:${dark(ges)}">${ges}</span>
    </div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Commune</span><span style="font-weight:600">${p.nom_commune_ban || ''}</span></div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Code postal</span><span style="font-weight:600">${p.code_postal_ban || ''}</span></div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Type</span><span style="font-weight:600">${p.type_batiment || ''}</span></div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Surface</span><span style="font-weight:600">${p.surface_habitable_logement ? p.surface_habitable_logement + ' m²' : '—'}</span></div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Date DPE</span><span style="font-weight:600">${formatDate(p.date_etablissement_dpe)}</span></div>
    <div style="display:flex;justify-content:space-between;gap:12px;padding:1px 0"><span style="color:#94a3b8">Valide jusqu'au</span><span style="font-weight:600">${formatDate(p.date_fin_validite_dpe)}</span></div>
    ${validHtml ? `<div style="text-align:right;margin-top:2px">${validHtml}</div>` : ''}
  `
}
