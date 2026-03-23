interface Props {
  countdown: number
  onRefresh: () => void
}

export function RefreshInfo({ countdown, onRefresh }: Props) {
  return (
    <div className="absolute bottom-5 left-3.5 z-[500] bg-slate-800/95 border border-slate-600/50 rounded-xl px-3 py-2 text-[0.68rem] text-gray-300 flex items-center gap-2 backdrop-blur-sm shadow-xl shadow-black/20">
      <span className="live-dot" style={{ width: 6, height: 6 }} />
      Mise à jour auto : <span className="text-white font-semibold">{countdown}s</span>
      <button
        onClick={onRefresh}
        className="bg-emerald-500 hover:bg-emerald-400 text-white border-none rounded-full px-3 py-0.5 text-[0.65rem] font-semibold cursor-pointer transition-colors ml-1"
      >
        Rafraîchir
      </button>
    </div>
  )
}
