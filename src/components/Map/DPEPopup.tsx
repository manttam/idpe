import { Popup } from 'react-leaflet'
import type { DPERecord } from '../../types'
import { formatDate, daysUntil } from '../../lib/dateUtils'

export function DPEPopup({ record: p }: { record: DPERecord }) {
  const days = p.date_fin_validite_dpe ? daysUntil(p.date_fin_validite_dpe) : null

  return (
    <Popup maxWidth={280}>
      <div className="text-slate-200 text-xs leading-relaxed">
        <div className="font-bold text-sm mb-1 text-slate-50">{p.adresse_ban}</div>
        <div className="text-center my-1">
          <Badge label={p.etiquette_dpe} />
          <span className="text-[0.7rem] text-slate-400 mx-1">GES</span>
          <Badge label={p.etiquette_ges} small />
        </div>
        <Row k="Commune" v={p.nom_commune_ban} />
        <Row k="Code postal" v={p.code_postal_ban} />
        <Row k="Type" v={p.type_batiment} />
        <Row k="Surface" v={p.surface_habitable_logement ? `${p.surface_habitable_logement} m²` : '—'} />
        <Row k="Date DPE" v={formatDate(p.date_etablissement_dpe)} />
        <Row k="Valide jusqu'au" v={formatDate(p.date_fin_validite_dpe)} />
        {days !== null && (
          <div className={`text-right text-[0.7rem] mt-0.5 ${days > 365 ? 'text-green-400' : 'text-amber-400'}`}>
            {days > 365 ? `Valide encore ${Math.floor(days / 365)} ans` : days > 0 ? `Expire dans ${days} jours` : 'Expiré'}
          </div>
        )}
      </div>
    </Popup>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 py-px">
      <span className="text-slate-400 whitespace-nowrap">{k}</span>
      <span className="font-semibold text-right">{v || '—'}</span>
    </div>
  )
}

function Badge({ label, small }: { label: string; small?: boolean }) {
  const colors: Record<string, string> = {
    A: '#319834', B: '#33cc31', C: '#cbfc33', D: '#fbea00',
    E: '#f0b400', F: '#ec6731', G: '#d7221f',
  }
  const dark = ['B', 'C', 'D', 'E'].includes(label)
  return (
    <span
      className={`inline-block rounded font-extrabold text-white ${small ? 'text-xs px-1.5 py-px' : 'text-sm px-2.5 py-0.5'}`}
      style={{ backgroundColor: colors[label] || '#64748b', color: dark ? '#1a1a1a' : '#fff' }}
    >
      {label}
    </span>
  )
}
