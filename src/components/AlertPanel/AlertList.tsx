import type { Alert } from '../../types'
import { AlertItem } from './AlertItem'

interface Props {
  alerts: Alert[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertList({ alerts, onEdit, onDelete }: Props) {
  return (
    <div>
      {alerts.length === 0 ? (
        <div className="text-[0.72rem] text-slate-500">Aucune alerte configurée</div>
      ) : (
        alerts.map(a => <AlertItem key={a.id} alert={a} onEdit={onEdit} onDelete={onDelete} />)
      )}
    </div>
  )
}
