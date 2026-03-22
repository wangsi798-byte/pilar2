import { useState, useEffect } from 'react'
import { useDataStore } from '../store/dataStore'
import Modal           from '../components/ui/Modal'
import ConfirmDialog   from '../components/ui/ConfirmDialog'
import { rupiah }      from '../utils/format'
import { Plus, Pencil, Trash2, Package, X } from 'lucide-react'

const EMPTY = { nama:'', harga:'', deskripsi:'', items:[], stok:'' }

export default function Paket() {
  const { paket, loading, fetchPaket, addPaket, updatePaket, deletePaket } = useDataStore()
  const [modal,setModal]   = useState(null)
  const [editing,setEditing] = useState(null)
  const [form,setForm]     = useState(EMPTY)
  const [itemInput,setItemInput] = useState('')
  const [delId,setDelId]   = useState(null)

  useEffect(()=>{ fetchPaket() },[])

  function openAdd()   { setForm(EMPTY); setItemInput(''); setModal('add') }
  function openEdit(p) { setEditing(p); setForm({nama:p.nama,harga:p.harga,deskripsi:p.deskripsi,items:[...p.items],stok:p.stok}); setItemInput(''); setModal('edit') }
  function closeModal(){ setModal(null); setEditing(null) }
  function addItem()   { const v=itemInput.trim(); if(!v)return; setForm(f=>({...f,items:[...f.items,v]})); setItemInput('') }
  function removeItem(i){ setForm(f=>({...f,items:f.items.filter((_,idx)=>idx!==i)})) }
  async function handleSave() {
    if (!form.nama.trim()||!form.harga) return
    const data={...form,harga:Number(form.harga),stok:Number(form.stok)}
    if (modal==='add') await addPaket(data)
    else               await updatePaket(editing._id,data)
    closeModal()
  }
  const f = k => ({ value:form[k], onChange:e=>setForm(v=>({...v,[k]:e.target.value})) })

  return (
    <div className="space-y-5">
      <div className="page-header flex items-start justify-between gap-4">
        <div><h1 className="page-title">Paket Lebaran</h1><p className="page-sub">{paket.length} paket tersedia</p></div>
        <button onClick={openAdd} className="btn-primary btn-shimmer flex-shrink-0"><Plus size={16}/>Tambah Paket</button>
      </div>
      {loading && <p className="text-sm text-brown-100 py-6 text-center">Memuat…</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paket.map(p=>(
          <div key={p._id} className="card flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0"><Package size={18} className="text-gold-600"/></div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={()=>openEdit(p)} className="btn-ghost !h-8 !px-2.5"><Pencil size={13}/></button>
                <button onClick={()=>setDelId(p._id)} className="btn-ghost !h-8 !px-2.5 hover:!bg-red-50 hover:!text-red-600"><Trash2 size={13}/></button>
              </div>
            </div>
            <div><h3 className="font-semibold text-brown-700">{p.nama}</h3><p className="text-xs text-brown-300 mt-0.5">{p.deskripsi}</p></div>
            <p className="font-display text-xl font-semibold text-gold-600">{rupiah(p.harga)}</p>
            <ul className="space-y-1">{p.items.map((item,i)=>(
              <li key={i} className="flex items-center gap-1.5 text-xs text-brown-500"><span className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0"/>{item}</li>
            ))}</ul>
            <div className="mt-auto pt-2 border-t border-gold-200/40 flex justify-between"><span className="text-xs text-brown-300">Stok</span><span className="text-xs font-semibold text-brown-700">{p.stok} unit</span></div>
          </div>
        ))}
      </div>
      <Modal isOpen={!!modal} onClose={closeModal} title={modal==='add'?'Tambah Paket':'Edit Paket'}>
        <div className="space-y-4">
          <div><label className="input-label">Nama Paket</label><input {...f('nama')} className="input" placeholder="cth: Paket Silver"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Harga (Rp)</label><input {...f('harga')} type="number" className="input" placeholder="500000"/></div>
            <div><label className="input-label">Stok</label><input {...f('stok')} type="number" className="input" placeholder="50"/></div>
          </div>
          <div><label className="input-label">Deskripsi</label><input {...f('deskripsi')} className="input" placeholder="Deskripsi singkat"/></div>
          <div>
            <label className="input-label">Isi Paket</label>
            <div className="flex gap-2 mb-2">
              <input value={itemInput} onChange={e=>setItemInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addItem())} className="input flex-1 text-sm" placeholder="cth: Beras 5 kg"/>
              <button type="button" onClick={addItem} className="btn-secondary flex-shrink-0"><Plus size={15}/></button>
            </div>
            <div className="flex flex-wrap gap-1.5">{form.items.map((item,i)=>(
              <span key={i} className="inline-flex items-center gap-1 badge-gold text-xs">{item}<button onClick={()=>removeItem(i)} className="opacity-60 hover:opacity-100"><X size={11}/></button></span>
            ))}</div>
          </div>
          <div className="flex gap-3 pt-2"><button onClick={closeModal} className="btn-secondary flex-1">Batal</button><button onClick={handleSave} className="btn-primary btn-shimmer flex-1">Simpan</button></div>
        </div>
      </Modal>
      <ConfirmDialog isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={()=>deletePaket(delId)} message="Yakin hapus paket ini?"/>
    </div>
  )
}
