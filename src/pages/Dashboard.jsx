import { useEffect, useMemo } from 'react'
import { useDataStore }  from '../store/dataStore'
import { useAuthStore }  from '../store/authStore'
import StatCard          from '../components/ui/StatCard'
import { rupiah, tgl, pct } from '../utils/format'
import { Users, Gift, CreditCard, TrendingUp, Clock, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const { anggota, paket, pembayaran, rekap, loading, error,
          fetchAnggota, fetchPaket, fetchPembayaran, fetchRekap } = useDataStore()
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    fetchAnggota(); fetchPaket(); fetchPembayaran(); fetchRekap()
  }, [])

  const ring = rekap?.ringkasan
  const recentPay = useMemo(() =>
    [...pembayaran].sort((a,b) => new Date(b.tanggal)-new Date(a.tanggal)).slice(0,6)
  , [pembayaran])
  const paketPopuler = useMemo(() => {
    const count = {}
    pembayaran.forEach(p => { const id = p.paket?._id ?? p.paket; count[id]=(count[id]||0)+1 })
    return [...paket].map(p => ({ ...p, cnt: count[p._id]??0 })).sort((a,b)=>b.cnt-a.cnt)
  }, [pembayaran, paket])
  const progress = pct(ring?.totalTerkumpul??0, ring?.totalTagihan||1)
  const salam = () => { const h=new Date().getHours(); return h<11?'Selamat Pagi':h<15?'Selamat Siang':h<18?'Selamat Sore':'Selamat Malam' }

  if (error) return (
    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm">
      <AlertCircle size={18} className="flex-shrink-0" />
      {error} — pastikan backend API berjalan dan VITE_API_URL sudah diset.
    </div>
  )

  return (
    <div className="space-y-7">
      <div className="page-header">
        <p className="text-sm text-brown-300 mb-0.5">{salam()},</p>
        <h1 className="font-display text-3xl font-semibold text-brown-700 capitalize">{user?.nama??'Admin'} 👋</h1>
        <p className="text-sm text-brown-300 mt-1">Berikut ringkasan program Paket Lebaran hari ini.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}      label="Anggota Aktif"   value={loading?'…':anggota.filter(a=>a.status==='aktif').length} sub={`${anggota.length} total`} />
        <StatCard icon={Gift}       label="Pilihan Paket"   value={loading?'…':paket.length} sub="tersedia" />
        <StatCard icon={CreditCard} label="Total Terkumpul" value={loading?'…':rupiah(ring?.totalTerkumpul??0)} sub={rupiah(ring?.totalTagihan??0)+' target'} accent />
        <StatCard icon={TrendingUp} label="Sudah Lunas"     value={loading?'…':ring?.jumlahLunas??0} sub={`dari ${ring?.totalAnggota??0} anggota`} />
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-brown-700">Progres Pengumpulan Dana</p>
            <p className="text-xs text-brown-300 mt-0.5">{rupiah(ring?.totalTerkumpul??0)} dari {rupiah(ring?.totalTagihan??0)}</p>
          </div>
          <span className="font-display text-2xl font-semibold text-gold-600">{progress}%</span>
        </div>
        <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gold-btn transition-all duration-700" style={{width:`${progress}%`}}/>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-gold-500"/><h2 className="font-semibold text-brown-700 text-sm">Pembayaran Terbaru</h2></div>
          {loading ? <p className="text-sm text-brown-100 text-center py-6">Memuat…</p> :
            <div className="space-y-2.5">{recentPay.map(p=>(
              <div key={p._id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brown-700 truncate">{p.anggota?.nama??'—'}</p>
                  <p className="text-xs text-brown-300 truncate">{p.paket?.nama} · {tgl(p.tanggal)}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-gold-600">{rupiah(p.jumlah)}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.metode==='transfer'?'bg-blue-50 text-blue-600':'bg-cream-200 text-brown-300'}`}>{p.metode}</span>
                </div>
              </div>
            ))}</div>}
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4"><Gift size={16} className="text-gold-500"/><h2 className="font-semibold text-brown-700 text-sm">Popularitas Paket</h2></div>
          {loading ? <p className="text-sm text-brown-100 text-center py-6">Memuat…</p> :
            <div className="space-y-4">{paketPopuler.map((p,i)=>{
              const maxCnt=paketPopuler[0]?.cnt||1
              return (<div key={p._id}>
                <div className="flex justify-between mb-1"><span className="text-sm text-brown-700 font-medium">{p.nama}</span><span className="text-xs text-brown-300">{p.cnt} peserta</span></div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{width:`${pct(p.cnt,maxCnt)}%`,background:i===0?'linear-gradient(90deg,#F5D27A,#C9973A)':i===1?'linear-gradient(90deg,#E8B84B,#A67C2B)':'#D4A030'}}/></div>
                <p className="text-xs text-brown-100 mt-0.5">{rupiah(p.harga)}</p>
              </div>)
            })}</div>}
        </div>
      </div>
    </div>
  )
}
