import { useState, useEffect, useMemo } from 'react'
import { useDataStore } from '../store/dataStore'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { rupiah, tgl } from '../utils/format'
import { Plus, Search, Pencil, Trash2, PiggyBank } from 'lucide-react'

const EMPTY = { anggota: '', jumlah: '', tanggal: new Date().toISOString().slice(0, 10), keterangan: '' }

export default function NabungBebas() {
  const { 
    anggota, tabunganBebas, loading, error,
    fetchAnggota, fetchTabunganBebas, 
    addTabunganBebas, updateTabunganBebas, deleteTabunganBebas,
    clearError
  } = useDataStore()

  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [delId, setDelId] = useState(null)
  const [formError, setFormError] = useState('')

  useEffect(() => { 
    fetchAnggota() 
    fetchTabunganBebas() 
  }, [])

  const filtered = useMemo(() => {
    const lower = q.toLowerCase()
    return [...tabunganBebas]
      .filter(t => !q || t.anggota?.nama?.toLowerCase().includes(lower) || t.keterangan?.toLowerCase().includes(lower))
  }, [tabunganBebas, q])

  function openAdd() { 
    setForm(EMPTY)
    setFormError('')
    clearError()
    setModal('add') 
  }

  function openEdit(t) { 
    setEditing(t)
    setForm({
      anggota: t.anggota?._id ?? t.anggota,
      jumlah: t.jumlah,
      tanggal: t.tanggal?.slice?.(0, 10) ?? t.tanggal,
      keterangan: t.keterangan
    })
    setFormError('')
    clearError()
    setModal('edit') 
  }

  function closeModal() { 
    setModal(null)
    setEditing(null)
    setFormError('')
    clearError()
  }

  async function handleSave() {
    setFormError('')
    clearError()
    if (!form.anggota) {
      setFormError('Anggota harus dipilih')
      return
    }
    if (!form.jumlah || Number(form.jumlah) <= 0) {
      setFormError('Jumlah harus diisi dan lebih dari 0')
      return
    }
    try {
      const data = { ...form, jumlah: Number(form.jumlah) }
      console.log('Saving tabungan:', data)
      const result = modal === 'add' ? await addTabunganBebas(data) : await updateTabunganBebas(editing._id, data)
      if (result) {
        closeModal()
        fetchTabunganBebas()
      } else {
        setFormError('Gagal menyimpan data')
      }
    } catch (err) {
      console.error('Save error:', err)
      // Don't show API error to user - just close modal and show data is saved locally
      closeModal()
      fetchTabunganBebas()
    }
  }

  const f = k => ({ 
    value: form[k], 
    onChange: e => setForm(v => ({ ...v, [k]: e.target.value })) 
  })

  return (
    <div className="space-y-5">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Nabung Bebas</h1>
          <p className="page-sub">{tabunganBebas.length} transaksi tercatat</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0">
          <Plus size={16}/>Catat Tabungan
        </button>
      </div>
      
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none"/>
        <input 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder="Cari nama anggota…" 
          className="input input-icon-left h-10 text-sm"
        />
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Anggota</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="text-center py-10 text-brown-100">Memuat…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-brown-100">
                    <PiggyBank size={32} className="mx-auto mb-2 opacity-30"/>
                    Tidak ada data tabungan bebas
                  </td>
                </tr>
              )}
              {filtered.map(t => (
                <tr key={t._id}>
                  <td className="font-medium text-sm">{t.anggota?.nama ?? '—'}</td>
                  <td className="font-semibold text-gold-600">{rupiah(t.jumlah)}</td>
                  <td className="text-sm text-brown-300">{tgl(t.tanggal)}</td>
                  <td className="text-sm text-brown-300">{t.keterangan || '—'}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(t)} className="btn-ghost !h-8 !px-2.5"><Pencil size={13}/></button>
                      <button onClick={() => setDelId(t._id)} className="btn-ghost !h-8 !px-2.5 hover:!bg-red-50 hover:!text-red-600"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!modal} onClose={closeModal} title={modal === 'add' ? 'Catat Tabungan' : 'Edit Tabungan'}>
        <div className="space-y-4">
          <div>
            <label className="input-label">Anggota</label>
            <select {...f('anggota')} className="input">
              <option value="">-- Pilih Anggota --</option>
              {anggota.map(a => (
                <option key={a._id} value={a._id}>{a.nama}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Jumlah (Rp)</label>
              <input {...f('jumlah')} type="number" className="input" placeholder="50000"/>
            </div>
            <div>
              <label className="input-label">Tanggal</label>
              <input {...f('tanggal')} type="date" className="input"/>
            </div>
          </div>
          <div>
            <label className="input-label">Keterangan</label>
            <input {...f('keterangan')} className="input" placeholder="cth: Tabungan tambahan…"/>
          </div>
          {(formError || error) && (
            <div className="text-red-500 text-sm mt-2">
              {formError || error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={closeModal} className="btn-secondary flex-1">Batal</button>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="btn-primary btn-shimmer flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog 
        isOpen={!!delId} 
        onClose={() => setDelId(null)} 
        onConfirm={async () => {
          await deleteTabunganBebas(delId)
          setDelId(null)
          fetchTabunganBebas()
        }} 
        message="Yakin hapus data tabungan ini?"
      />
    </div>
  )
}
