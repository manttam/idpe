import emailjs from '@emailjs/browser'
import type { Alert, DPERecord } from '../types'

let initialized = false

export function initEmailJS(): void {
  const pubKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (pubKey && !initialized) {
    emailjs.init(pubKey)
    initialized = true
  }
}

export async function sendAlertEmail(
  alert: Alert,
  newDPEs: DPERecord[],
  isFirstCheck: boolean,
): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID

  if (!serviceId || !templateId) {
    console.warn('[EmailJS] Service ou Template ID manquant')
    return
  }

  const lines = newDPEs.slice(0, 10).map(p =>
    `- ${p.adresse_ban || '?'} | DPE: ${p.etiquette_dpe || '?'} | ${p.type_batiment || ''}`
    + (p.surface_habitable_logement ? ` | ${p.surface_habitable_logement} m²` : '')
    + ` | ${p.date_etablissement_dpe || ''}`
  )
  if (newDPEs.length > 10) {
    lines.push(`... et ${newDPEs.length - 10} autres`)
  }

  const subject = isFirstCheck
    ? `Récap : ${newDPEs.length} DPE des 7 derniers jours à ${alert.commune}`
    : `${newDPEs.length} nouveau(x) DPE à ${alert.commune}`

  const params = {
    to_email: alert.email,
    commune: alert.commune,
    nb_nouveaux: newDPEs.length.toString(),
    subject,
    liste_dpe: lines.join('\n'),
    date: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
  }

  try {
    await emailjs.send(serviceId, templateId, params)
    console.log(`[EmailJS] Mail envoyé à ${alert.email} pour ${alert.commune} (${newDPEs.length} DPE)`)
  } catch (err) {
    console.error('[EmailJS] Erreur envoi:', err)
  }
}
