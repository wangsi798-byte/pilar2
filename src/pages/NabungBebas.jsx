import { useState } from 'react'
import { Plus, Search, PiggyBank } from 'lucide-react'

export default function NabungBebas() {
  const [q, setQ] = useState('')

  return (
    <div className="space-y-5">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Nabung Bebas</h1>
          <p className="page-sub">Data tabungan bebas anggota</p>
        </div>
        <button className="btn-primary btn-shimmer flex-shrink-0">
          <Plus size={16}/>Catat Tabungan
        </button>
      </div>
      
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none"/>
        <input 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
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
              <tr>
                <td colSpan={5} className="text-center py-12 text-brown-100">
                  <PiggyBank size={32} className="mx-auto mb-2 opacity-30"/>
                  Belum ada data tabungan bebas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
