export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-center min-w-[70px] shadow-sm">
      <div className="text-[0.95rem] font-bold text-emerald-600 leading-tight">{value}</div>
      <div className="text-[0.58rem] text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  )
}
