import type { Alert, AlertFormData } from '../../types'
import { AlertForm } from './AlertForm'
import { AlertList } from './AlertList'

interface Props {
  isOpen: boolean
  onClose: () => void
  alerts: Alert[]
  editingAlert: Alert | null
  onCreateAlert: (data: AlertFormData) => void
  onUpdateAlert: (id: string, data: AlertFormData) => void
  onDeleteAlert: (id: string) => void
  onEditAlert: (id: string) => void
  onCancelEdit: () => void
}

export function AlertPanel({
  isOpen, onClose, alerts, editingAlert,
  onCreateAlert, onUpdateAlert, onDeleteAlert, onEditAlert, onCancelEdit,
}: Props) {
  const handleSubmit = (data: AlertFormData) => {
    if (editingAlert) {
      onUpdateAlert(editingAlert.id, data)
    } else {
      onCreateAlert(data)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1999]"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 w-[380px] h-screen bg-slate-800 border-l border-slate-700 z-[2000] transition-transform duration-300 overflow-y-auto flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-50">Alertes DPE</h2>
          <button onClick={onClose} className="bg-transparent border-none text-slate-400 text-xl cursor-pointer hover:text-white">&times;</button>
        </div>

        {/* Form */}
        <AlertForm
          editingAlert={editingAlert}
          onSubmit={handleSubmit}
          onCancelEdit={onCancelEdit}
        />

        {/* List */}
        <div className="p-4 flex-1">
          <h3 className="text-[0.72rem] text-slate-400 uppercase mb-2.5 tracking-wide">Alertes actives</h3>
          <AlertList
            alerts={alerts}
            onEdit={onEditAlert}
            onDelete={onDeleteAlert}
          />
        </div>
      </div>
    </>
  )
}
