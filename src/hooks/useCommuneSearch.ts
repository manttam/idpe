import { useState, useRef, useCallback } from 'react'
import { searchCommunes } from '../lib/geoApi'
import type { CommuneResult } from '../types'

export function useCommuneSearch(debounceMs = 300) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CommuneResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const onQueryChange = useCallback((q: string) => {
    setQuery(q)
    if (!q || q.length < 2) {
      setIsOpen(false)
      setResults([])
      return
    }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchCommunes(q)
        setResults(data)
        setIsOpen(data.length > 0)
      } catch {
        setIsOpen(false)
      }
    }, debounceMs)
  }, [debounceMs])

  const close = useCallback(() => setIsOpen(false), [])

  return { query, setQuery, results, isOpen, onQueryChange, close }
}
