import { useRef, useCallback } from 'react'
import { useCommuneSearch } from '../../hooks/useCommuneSearch'
import { useClickOutside } from '../../hooks/useClickOutside'

interface Props {
  onCitySelect: (lat: number, lng: number, name: string) => void
}

export function CitySearch({ onCitySelect }: Props) {
  const { query, setQuery, results, isOpen, onQueryChange, close } = useCommuneSearch()
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, close)

  const handleSelect = useCallback((lat: number, lng: number, name: string) => {
    setQuery(name)
    close()
    onCitySelect(lat, lng, name)
  }, [setQuery, close, onCitySelect])

  return (
    <div ref={ref} className="flex gap-1 flex-wrap items-center relative">
      <span className="text-[0.62rem] text-gray-400 uppercase tracking-wider mr-1 font-medium">Ville</span>
      <input
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Rechercher une ville..."
        className="py-[5px] px-[12px] border border-slate-600 rounded-[14px] bg-[rgba(30,41,59,0.92)] text-white text-[0.72rem] w-[170px] outline-none focus:border-emerald-400 placeholder:text-gray-500"
      />
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg max-h-[200px] overflow-y-auto min-w-[220px] z-[600] shadow-xl shadow-black/30">
          {results.map(r => {
            const coords = r.centre?.coordinates
            if (!coords) return null
            const cp = r.codesPostaux?.[0] || ''
            return (
              <div
                key={r.nom + cp}
                onClick={() => handleSelect(coords[1], coords[0], r.nom)}
                className="px-3 py-1.5 text-[0.72rem] cursor-pointer border-b border-slate-900/50 hover:bg-slate-700 transition-colors"
              >
                <span className="text-white font-semibold">{r.nom}</span>
                <span className="text-gray-400 ml-1.5">{cp}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
