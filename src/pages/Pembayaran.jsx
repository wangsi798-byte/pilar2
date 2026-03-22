import { useState, useEffect, useMemo } from 'react'
import { useDataStore }  from '../store/dataStore'
import Modal             from '../components/ui/Modal'
import ConfirmDialog     from '../components/ui/ConfirmDialog'
import { rupiah, tgl }   from '../utils/format'
import { Plus, Search, Pencil, Trash2, CreditCard } from 'lucide-react'

const EMPTY = { anggota:'', paket:'', jumlah:'', tanggal:new Date().toISOString().slice(0,10), metode:'tunai', keterangan:'' }

export default function Pembayaran() {
  const { anggota, paket, pembayaran, loading, fetchAnggota, fetchPaket, fetchPembayaran, addPembayaran, updatePembayaran, deletePembayaran } = useDataStore()
  const [q,setQ]         = useState('')
  const [modal,setModal] = useState(null)
  const [editing,setEditing] = useState(null)
  const [form,setForm]   = useState(EMPTY)
  const [delId,setDelId] = useState(null)

  useEffect(()=>{ fetchAnggota(); fetchPaket(); fetchPembayaran() },[])

  const filtered = useMemo(()=>{
    const lower=q.toLowerCase()
    return [...pembayaran]
      .sort((a,b)=>new Date(b.tanggal)-new Date(a.tanggal))
      .filter(p=>!q||p.anggota?.nama?.toLowerCase().includes(lower)||p._id?.includes(lower))
  },[pembayaran,q])

  function openAdd()    { setForm(EMPTY); setModal('add') }
  function openEdit(p)  { setEditing(p); setForm({anggota:p.anggota?._id??p.anggota,paket:p.paket?._id??p.paket,jumlah:p.jumlah,tanggal:p.tanggal?.slice?.(0,10)??p.tanggal,metode:p.metode,keterangan:p.keterangan}); setModal('edit') }
  function closeModal() { setModal(null); setEditing(null) }
  async function handleSave() {
    if (!form.anggota||!form.paket||!form.jumlah) return
    const data={...form,jumlah:Number(form.jumlah)}
    if (modal==='add') await addPembayaran(data)
    else               await updatePembayaran(editing._id,data)
    closeModal(); fetchPembayaran()
  }
  const f = k => ({ value:form[k], onChange:e=>setForm(v=>({...v,[k]:e.target.value})) })

  return (
    <div className="space-y-5">
      <div className="page-header flex items-start justify-between gap-4">
        <div><h1 className="page-title">Pembayaran</h1><p className="page-sub">{pembayaran.length} transaksi tercatat</p></div>
        <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0"><Plus size={16}/>Catat Pembayaran</button>
      </div>
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama anggota…" className="input input-icon-left h-10 text-sm"/>
      </div>
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Anggota</th><th>Paket</th><th>Jumlah</th><th>Tanggal</th><th>Metode</th><th>Keterangan</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="text-center py-10 text-brown-100">Memuat…</td></tr>}
              {!loading && filtered.length===0 && <tr><td colSpan={7} className="text-center py-12 text-brown-100"><CreditCard size={32} className="mx-auto mb-2 opacity-30"/>Tidak ada transaksi</td></tr>}
              {filtered.map(p=>(
                <tr key={p._id}>
                  <td className="font-medium text-sm">{p.anggota?.nama??'—'}</td>
                  <td className="text-sm text-brown-500">{p.paket?.nama??'—'}</td>
                  <td className="font-semibold text-gold-600">{rupiah(p.jumlah)}</td>
                  <td className="text-sm text-brown-300">{tgl(p.tanggal)}</td>
                  <td><span className={p.metode==='transfer'?'badge bg-blue-50 text-blue-600':'badge-gray'}>{p.metode}</span></td>
                  <td className="text-sm text-brown-300">{p.keterangan||'—'}</td>
                  <td><div className="flex gap-1.5">
                    <button onClick={()=>openEdit(p)} className="btn-ghost !h-8 !px-2.5"><Pencil size={13}/></button>
                    <button onClick={()=>setDelId(p._id)} className="btn-ghost !h-8 !px-2.5 hover:!bg-red-50 hover:!text-red-600"><Trash2 size={13}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={!!modal} onClose={closeModal} title={modal==='add'?'Catat Pembayaran':'Edit Pembayaran'}>
        <div className="space-y-4">
          <div><label className="input-label">Anggota</label><select {...f('anggota')} className="input"><option value="">-- Pilih Anggota --</option>{anggota.map(a=><option key={a._id} value={a._id}>{a.nama}</option>)}</select></div>
          <div><label className="input-label">Paket</label><select {...f('paket')} className="input"><option value="">-- Pilih Paket --</option>{paket.map(p=><option key={p._id} value={p._id}>{p.nama} — {rupiah(p.harga)}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Jumlah (Rp)</label><input {...f('jumlah')} type="number" className="input" placeholder="100000"/></div>
            <div><label className="input-label">Tanggal</label><input {...f('tanggal')} type="date" className="input"/></div>
          </div>
          <div><label className="input-label">Metode</label><select {...f('metode')} className="input"><option value="tunai">Tunai</option><option value="transfer">Transfer</option></select></div>
          <div><label className="input-label">Keterangan</label><input {...f('keterangan')} className="input" placeholder="cth: Cicilan 1, Pelunasan…"/></div>
          <div className="flex gap-3 pt-2"><button onClick={closeModal} className="btn-secondary flex-1">Batal</button><button onClick={handleSave} className="btn-primary btn-shimmer flex-1">Simpan</button></div>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>deletePembayaran(delId)} message="Yakin hapus pembayaran ini?"/>
    </div>
  )
}
