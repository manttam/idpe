import { useState, useEffect, useCallback, useRef } from 'react'
import { REFRESH_INTERVAL } from '../config/constants'

export function useRefreshTimer(onRefresh: () => void) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRefreshRef.current()
          return REFRESH_INTERVAL
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const reset = useCallback(() => {
    setCountdown(REFRESH_INTERVAL)
    onRefresh()
  }, [onRefresh])

  return { countdown, reset }
}
