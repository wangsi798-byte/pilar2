import { useState, useEffect } from 'react'
import { useDataStore }   from '../store/dataStore'
import Modal              from '../components/ui/Modal'
import ConfirmDialog      from '../components/ui/ConfirmDialog'
import { tgl }            from '../utils/format'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'

const EMPTY = { nama:'', alamat:'', telepon:'', bergabung:new Date().toISOString().slice(0,10), status:'aktif' }

export default function Anggota() {
  const { anggota, loading, fetchAnggota, addAnggota, updateAnggota, deleteAnggota } = useDataStore()
  const [q,setQ]=[useState(''),v=>setQ(v)]
  const [modal,setModal]  = useState(null)
  const [editing,setEditing] = useState(null)
  const [form,setForm]    = useState(EMPTY)
  const [delId,setDelId]  = useState(null)

  useEffect(()=>{ fetchAnggota() },[])

  const filtered = anggota.filter(a =>
    a.nama.toLowerCase().includes(q.toLowerCase()) || (a._id??'').includes(q)
  )

  function openAdd()    { setForm(EMPTY); setModal('add') }
  function openEdit(a)  { setEditing(a); setForm({nama:a.nama,alamat:a.alamat,telepon:a.telepon,bergabung:a.bergabung?.slice?.(0,10)??a.bergabung,status:a.status}); setModal('edit') }
  function closeModal() { setModal(null); setEditing(null) }
  async function handleSave() {
    if (!form.nama.trim()) return
    if (modal==='add') await addAnggota(form)
    else               await updateAnggota(editing._id, form)
    closeModal()
  }
  const f = k => ({ value:form[k], onChange:e=>setForm(v=>({...v,[k]:e.target.value})) })

  return (
    <div className="space-y-5">
      <div className="page-header flex items-start justify-between gap-4">
        <div><h1 className="page-title">Anggota</h1><p className="page-sub">{anggota.length} anggota terdaftar</p></div>
        <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0"><Plus size={16}/>Tambah Anggota</button>
      </div>
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama…" className="input input-icon-left h-10 text-sm"/>
      </div>
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Nama</th><th>Telepon</th><th>Bergabung</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="text-center py-10 text-brown-100">Memuat…</td></tr>}
              {!loading && filtered.length===0 && <tr><td colSpan={5} className="text-center py-12 text-brown-100"><Users size={32} className="mx-auto mb-2 opacity-30"/>Tidak ada data</td></tr>}
              {filtered.map(a=>(
                <tr key={a._id}>
                  <td className="font-medium">{a.nama}</td>
                  <td className="text-sm text-brown-300">{a.telepon}</td>
                  <td className="text-sm text-brown-300">{tgl(a.bergabung)}</td>
                  <td><span className={a.status==='aktif'?'badge-green':'badge-gray'}>{a.status}</span></td>
                  <td><div className="flex gap-1.5">
                    <button onClick={()=>openEdit(a)} className="btn-ghost !h-8 !px-2.5"><Pencil size={13}/></button>
                    <button onClick={()=>setDelId(a._id)} className="btn-ghost !h-8 !px-2.5 hover:!bg-red-50 hover:!text-red-600"><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={!!modal} onClose={closeModal} title={modal==='add'?'Tambah Anggota':'Edit Anggota'}>
        <div className="space-y-4">
          <div><label className="input-label">Nama Lengkap</label><input {...f('nama')} className="input" placeholder="Nama lengkap"/></div>
          <div><label className="input-label">Alamat</label><input {...f('alamat')} className="input" placeholder="Alamat"/></div>
          <div><label className="input-label">No. Telepon</label><input {...f('telepon')} type="tel" className="input" placeholder="08xxx"/></div>
          <div><label className="input-label">Tanggal Bergabung</label><input {...f('bergabung')} type="date" className="input"/></div>
          <div><label className="input-label">Status</label><select {...f('status')} className="input"><option value="aktif">Aktif</option><option value="nonaktif">Non-Aktif</option></select></div>
          <div className="flex gap-3 pt-2"><button onClick={closeModal} className="btn-secondary flex-1">Batal</button><button onClick={handleSave} className="btn-primary btn-shimmer flex-1">Simpan</button></div>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>deleteAnggota(delId)} message="Yakin hapus anggota ini?"/>
    </div>
  )
}
