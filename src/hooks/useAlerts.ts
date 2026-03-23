import { useState, useEffect, useCallback, useRef } from 'react'
import type { Alert, AlertFormData, DPERecord } from '../types'
import {
  getAlerts, saveAlerts, addAlert, updateAlert as storageUpdate,
  deleteAlert as storageDelete, getSeenDPEs, saveSeenDPEs, generateAlertId,
} from '../lib/alertStorage'
import { buildAlertApiUrl, fetchDPEPage } from '../lib/ademeApi'
import { sendAlertEmail, initEmailJS } from '../lib/emailService'
import { ALERT_CHECK_INTERVAL } from '../config/constants'

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(getAlerts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const initializedRef = useRef(false)

  // Sync state from localStorage
  const refresh = useCallback(() => setAlerts(getAlerts()), [])

  // Init EmailJS once
  useEffect(() => {
    if (!initializedRef.current) {
      initEmailJS()
      initializedRef.current = true
    }
  }, [])

  // Check a single alert
  const checkAlert = useCallback(async (alert: Alert) => {
    try {
      const url = buildAlertApiUrl(alert)
      const data = await fetchDPEPage(url)
      const results: DPERecord[] = data.results || []
      const seen = getSeenDPEs(alert.id)
      const seenSet = new Set(seen)

      const newDPEs = results.filter(p => !seenSet.has(p.numero_dpe))
      const allIds = results.map(p => p.numero_dpe)
      saveSeenDPEs(alert.id, allIds)

      // Update lastCheck
      const current = getAlerts()
      const idx = current.findIndex(a => a.id === alert.id)
      if (idx !== -1) {
        current[idx].lastCheck = new Date().toISOString()
        saveAlerts(current)
      }

      if (newDPEs.length > 0) {
        await sendAlertEmail(alert, newDPEs, seen.length === 0)
      }

      console.log(`[Alerte ${alert.commune}] ${results.length} DPE récents, ${newDPEs.length} nouveaux`)
    } catch (err) {
      console.error(`[Alerte ${alert.commune}] Erreur:`, err)
    }
  }, [])

  // Periodic check all alerts
  useEffect(() => {
    const checkAll = () => {
      const now = Date.now()
      const current = getAlerts()
      for (const a of current) {
        const freq = (a.frequence || 86400) * 1000
        const lastCheck = a.lastCheck ? new Date(a.lastCheck).getTime() : 0
        if (now - lastCheck >= freq) {
          checkAlert(a)
        }
      }
      refresh()
    }

    // First check after 5s
    const initial = setTimeout(checkAll, 5000)
    // Then every ALERT_CHECK_INTERVAL
    const interval = setInterval(checkAll, ALERT_CHECK_INTERVAL * 1000)

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [checkAlert, refresh])

  const createAlert = useCallback((data: AlertFormData) => {
    const alert: Alert = {
      id: generateAlertId(),
      ...data,
      createdAt: new Date().toISOString(),
      lastCheck: null,
      lastNotified: null,
    }
    addAlert(alert)
    refresh()
    checkAlert(alert)
  }, [refresh, checkAlert])

  const updateAlertFn = useCallback((id: string, data: AlertFormData) => {
    storageUpdate(id, data)
    setEditingId(null)
    refresh()
  }, [refresh])

  const deleteAlertFn = useCallback((id: string) => {
    storageDelete(id)
    refresh()
  }, [refresh])

  const editingAlert = editingId ? alerts.find(a => a.id === editingId) || null : null

  return {
    alerts,
    editingAlert,
    setEditingId,
    createAlert,
    updateAlert: updateAlertFn,
    deleteAlert: deleteAlertFn,
  }
}
