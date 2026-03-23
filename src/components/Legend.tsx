import { LEGEND_ITEMS } from '../config/dpeColors'

export function Legend() {
  return (
    <div className="absolute bottom-5 right-3.5 bg-slate-800/95 border border-slate-600/50 rounded-xl px-4 py-3 z-[500] backdrop-blur-sm shadow-xl shadow-black/20">
      <h3 className="text-[0.68rem] text-gray-300 uppercase mb-1.5 font-semibold tracking-wide">Étiquettes DPE</h3>
      {LEGEND_ITEMS.map(item => (
        <div key={item.label} className="flex items-center gap-2 mb-0.5 text-[0.7rem] text-gray-100">
          <div
            className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white/20 shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-semibold text-white">{item.label}</span> — {item.range}
        </div>
      ))}
      <div className="text-[0.6rem] text-gray-400 mt-1.5">kWh/m²/an énergie finale</div>
    </div>
  )
}
