import { StatCard } from './StatCard'

interface Props {
  totalLabel: string
  displayedCount: number
  fgCount: number
  fgPercent: string
  alertCount: number
  onToggleAlerts: () => void
}

export function Header({ totalLabel, displayedCount, fgCount, fgPercent, alertCount, onToggleAlerts }: Props) {
  return (
    <div className="bg-gray-100 px-5 py-2.5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
      <div>
        <h1 className="text-[1.15rem] font-bold text-gray-800 flex items-center gap-2">
          <span className="live-dot" />
          Carte <span className="text-emerald-600">DPE</span> France — Temps réel
        </h1>
        <div className="text-[0.72rem] text-gray-500">
          Diagnostics de Performance Énergétique · Source : ADEME via data.gouv.fr
        </div>
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <StatCard value={totalLabel} label="Total base" />
        <StatCard value={displayedCount.toLocaleString('fr-FR')} label="Affichés" />
        <StatCard value={`${fgCount} (${fgPercent}%)`} label="Passoires (F+G)" />
        <button
          onClick={onToggleAlerts}
          className="bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-lg px-4 py-2 text-[0.75rem] font-semibold cursor-pointer flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
        >
          🔔 Alertes
          {alertCount > 0 && (
            <span className="bg-white text-emerald-700 rounded-full min-w-[20px] h-[20px] text-[0.6rem] flex items-center justify-center font-bold">
              {alertCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
