import { PERIOD_OPTIONS, ETIQUETTE_OPTIONS } from '../../config/constants'
import type { PeriodFilter, EtiquetteFilter } from '../../types'

interface Props {
  period: PeriodFilter
  etiquette: EtiquetteFilter
  onPeriodChange: (p: PeriodFilter) => void
  onEtiquetteChange: (e: EtiquetteFilter) => void
}

const activeClass = 'bg-emerald-500 text-white font-semibold border border-emerald-500'
const inactiveClass = 'bg-slate-700/80 text-gray-200 border border-slate-500 hover:border-emerald-400 hover:text-white'
const btnBase = 'py-[6px] px-[14px] rounded-[14px] text-[0.7rem] cursor-pointer transition-all whitespace-nowrap'

export function FilterControls({ period, etiquette, onPeriodChange, onEtiquetteChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1 flex-wrap items-center">
        <span className="text-[0.62rem] text-gray-400 uppercase tracking-wider mr-1 font-medium">Période</span>
        {PERIOD_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onPeriodChange(opt.value as PeriodFilter)}
            className={`${btnBase} ${period === opt.value ? activeClass : inactiveClass}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap items-center">
        <span className="text-[0.62rem] text-gray-400 uppercase tracking-wider mr-1 font-medium">Étiquette</span>
        {ETIQUETTE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onEtiquetteChange(opt.value as EtiquetteFilter)}
            className={`${btnBase} ${etiquette === opt.value ? activeClass : inactiveClass}`}
            style={etiquette !== opt.value && opt.color ? { color: opt.color } : undefined}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
