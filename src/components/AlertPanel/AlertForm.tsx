import { useState, useEffect, useRef, useCallback } from 'react'
import type { Alert, AlertFormData } from '../../types'
import { useCommuneSearch } from '../../hooks/useCommuneSearch'
import { useClickOutside } from '../../hooks/useClickOutside'
import { FREQUENCY_OPTIONS } from '../../config/constants'

interface Props {
  editingAlert: Alert | null
  onSubmit: (data: AlertFormData) => void
  onCancelEdit: () => void
}

export function AlertForm({ editingAlert, onSubmit, onCancelEdit }: Props) {
  const [email, setEmail] = useState('')
  const [surfaceMin, setSurfaceMin] = useState('')
  const [surfaceMax, setSurfaceMax] = useState('')
  const [etiquette, setEtiquette] = useState('')
  const [frequence, setFrequence] = useState('86400')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const commune = useCommuneSearch()
  const dropdownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropdownRef, commune.close)

  // Fill form when editing
  useEffect(() => {
    if (editingAlert) {
      setEmail(editingAlert.email)
      commune.setQuery(editingAlert.commune)
      setSurfaceMin(editingAlert.surfaceMin?.toString() || '')
      setSurfaceMax(editingAlert.surfaceMax?.toString() || '')
      setEtiquette(editingAlert.etiquette || '')
      setFrequence((editingAlert.frequence || 86400).toString())
    }
  }, [editingAlert]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = useCallback(() => {
    setEmail('')
    commune.setQuery('')
    setSurfaceMin('')
    setSurfaceMax('')
    setEtiquette('')
    setFrequence('86400')
  }, [commune])

  const handleSubmit = () => {
    const communeName = commune.query.trim()
    if (!email || !communeName) {
      setMessage({ text: 'Email et commune sont obligatoires', type: 'error' })
      setTimeout(() => setMessage(null), 4000)
      return
    }

    onSubmit({
      email,
      commune: communeName,
      surfaceMin: surfaceMin ? parseInt(surfaceMin) : null,
      surfaceMax: surfaceMax ? parseInt(surfaceMax) : null,
      etiquette: etiquette || null,
      frequence: parseInt(frequence),
    })

    setMessage({ text: editingAlert ? `Alerte modifiée pour ${communeName}` : `Alerte créée pour ${communeName}`, type: 'success' })
    setTimeout(() => setMessage(null), 4000)
    resetForm()
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit()
  }

  const inputClass = "w-full py-1.5 px-2.5 border border-slate-700 rounded-md bg-slate-900 text-slate-100 text-[0.78rem] outline-none focus:border-emerald-500 placeholder:text-slate-600"

  return (
    <div className="p-4 border-b border-slate-900">
      <h3 className="text-[0.72rem] text-slate-400 uppercase mb-2.5 tracking-wide">
        {editingAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
      </h3>

      <div className="mb-2.5">
        <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" className={inputClass} />
      </div>

      <div className="mb-2.5 relative" ref={dropdownRef}>
        <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Commune *</label>
        <input
          value={commune.query}
          onChange={e => commune.onQueryChange(e.target.value)}
          placeholder="Tapez le nom d'une commune..."
          className={inputClass}
        />
        {commune.isOpen && (
          <div className="bg-slate-900 border border-slate-700 rounded-b-md max-h-[150px] overflow-y-auto -mt-px">
            {commune.results.map(r => (
              <div
                key={r.nom + (r.codesPostaux?.[0] || '')}
                onClick={() => { commune.setQuery(r.nom); commune.close() }}
                className="px-2.5 py-1.5 text-[0.72rem] text-slate-200 cursor-pointer border-b border-slate-800 hover:bg-slate-700"
              >
                {r.nom} <span className="text-slate-500">{r.codesPostaux?.[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-2.5">
        <div className="flex-1">
          <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Surface min (m²)</label>
          <input type="number" value={surfaceMin} onChange={e => setSurfaceMin(e.target.value)} placeholder="—" className={inputClass} />
        </div>
        <div className="flex-1">
          <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Surface max (m²)</label>
          <input type="number" value={surfaceMax} onChange={e => setSurfaceMax(e.target.value)} placeholder="—" className={inputClass} />
        </div>
      </div>

      <div className="mb-2.5">
        <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Étiquette DPE</label>
        <select value={etiquette} onChange={e => setEtiquette(e.target.value)} className={inputClass}>
          <option value="">Toutes</option>
          {['A','B','C','D','E','F','G'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="mb-2.5">
        <label className="block text-[0.68rem] text-slate-400 uppercase mb-0.5">Fréquence de vérification</label>
        <select value={frequence} onChange={e => setFrequence(e.target.value)} className={inputClass}>
          {FREQUENCY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 border-none rounded-md text-[0.78rem] font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
      >
        {editingAlert ? 'Enregistrer les modifications' : 'Créer l\'alerte'}
      </button>

      {editingAlert && (
        <button
          onClick={handleCancel}
          className="w-full py-2 mt-1 border-none rounded-md text-[0.78rem] font-semibold cursor-pointer bg-slate-700 text-slate-300 transition-colors"
        >
          Annuler la modification
        </button>
      )}

      {message && (
        <div className={`mt-2 px-3 py-2 rounded-md text-[0.72rem] border ${
          message.type === 'success'
            ? 'bg-green-400/15 text-green-400 border-green-400/30'
            : 'bg-red-400/15 text-red-400 border-red-400/30'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
