import type { Alert } from '../types'

const ALERTS_KEY = 'dpe_alerts'
const SEEN_KEY = 'dpe_alerts_seen'

export function getAlerts(): Alert[] {
  return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]')
}

export function saveAlerts(alerts: Alert[]): void {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
}

export function addAlert(alert: Alert): void {
  const alerts = getAlerts()
  alerts.push(alert)
  saveAlerts(alerts)
}

export function updateAlert(id: string, data: Partial<Alert>): void {
  const alerts = getAlerts()
  const idx = alerts.findIndex(a => a.id === id)
  if (idx !== -1) {
    alerts[idx] = { ...alerts[idx], ...data }
    saveAlerts(alerts)
  }
}

export function deleteAlert(id: string): void {
  saveAlerts(getAlerts().filter(a => a.id !== id))
  const all = getSeenMap()
  delete all[id]
  localStorage.setItem(SEEN_KEY, JSON.stringify(all))
}

function getSeenMap(): Record<string, string[]> {
  return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}')
}

export function getSeenDPEs(alertId: string): string[] {
  return getSeenMap()[alertId] || []
}

export function saveSeenDPEs(alertId: string, dpeIds: string[]): void {
  const all = getSeenMap()
  all[alertId] = dpeIds
  localStorage.setItem(SEEN_KEY, JSON.stringify(all))
}

export function generateAlertId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
