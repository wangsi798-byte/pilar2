import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus" size="sm">
      <div className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <p className="text-brown-500 text-sm mb-6">{message || 'Data yang dihapus tidak dapat dipulihkan.'}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Batal</button>
          <button onClick={() => { onConfirm(); onClose() }} className="btn-danger flex-1">Hapus</button>
        </div>
      </div>
    </Modal>
  )
}
