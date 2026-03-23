import type { Alert } from '../../types'

const FREQ_LABELS: Record<number, string> = { 3600: '1h', 21600: '6h', 43200: '12h', 86400: '24h' }

interface Props {
  alert: Alert
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertItem({ alert: a, onEdit, onDelete }: Props) {
  const filters: string[] = []
  if (a.surfaceMin || a.surfaceMax) filters.push(`${a.surfaceMin || '?'}–${a.surfaceMax || '?'} m²`)
  if (a.etiquette) filters.push(`Étiquette ${a.etiquette}`)
  filters.push(`Check ${FREQ_LABELS[a.frequence] || '24h'}`)

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-[0.82rem] text-slate-50 uppercase">{a.commune}</span>
        <div className="flex gap-2 items-center">
          <button onClick={() => onEdit(a.id)} className="bg-transparent border-none text-slate-500 cursor-pointer text-[0.72rem] hover:text-emerald-400">✎</button>
          <button onClick={() => onDelete(a.id)} className="bg-transparent border-none text-slate-500 cursor-pointer text-[0.9rem] hover:text-red-500">&times;</button>
        </div>
      </div>
      <div className="text-[0.68rem] text-slate-400">{a.email}</div>
      {filters.length > 0 && <div className="text-[0.68rem] text-slate-400">{filters.join(' · ')}</div>}
      <div className="text-[0.62rem] text-slate-500 mt-1">
        {a.lastCheck ? `Dernier check : ${new Date(a.lastCheck).toLocaleTimeString('fr-FR')}` : 'En attente du premier check...'}
      </div>
    </div>
  )
}
