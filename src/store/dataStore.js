import { create } from 'zustand'

const DIRECT_API = 'https://pilar-api-cye9.vercel.app/api'

function directFetch(method, path, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const raw = localStorage.getItem('pilar-auth')
      let token = null
      if (raw) {
        const parsed = JSON.parse(raw)
        token = parsed?.state?.token ?? parsed?.token ?? null
      }
      
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      
      const res = await fetch(`${DIRECT_API}${path}`, options)
      const text = await res.text()
      
      if (!text) {
        reject(new Error('Empty response'))
        return
      }
      
      const data = JSON.parse(text)
      
      if (!res.ok) {
        reject(new Error(data.message || 'Request failed'))
        return
      }
      
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

const MOCK_ANGGOTA = [
  { _id: 'ANG001', nama: 'Ahmad Fauzi',      alamat: 'Jl. Mawar No. 12',     telepon: '081234567890', bergabung: '2025-01-05', status: 'aktif' },
  { _id: 'ANG002', nama: 'Siti Rahmawati',   alamat: 'Jl. Melati No. 7',     telepon: '081345678901', bergabung: '2025-01-07', status: 'aktif' },
  { _id: 'ANG003', nama: 'Budi Santoso',     alamat: 'Jl. Kenanga No. 3',    telepon: '081456789012', bergabung: '2025-01-10', status: 'aktif' },
  { _id: 'ANG004', nama: 'Dewi Lestari',     alamat: 'Jl. Flamboyan No. 18', telepon: '081567890123', bergabung: '2025-01-12', status: 'aktif' },
  { _id: 'ANG005', nama: 'Eko Prasetyo',    alamat: 'Jl. Anggrek No. 5',    telepon: '081678901234', bergabung: '2025-01-15', status: 'aktif' },
]

const MOCK_PAKET = [
  { _id: 'PKT001', nama: 'Paket Bronze', harga: 300000, deskripsi: 'Paket sembako dasar', items: ['Beras 5 kg', 'Minyak 2L'], stok: 30 },
  { _id: 'PKT002', nama: 'Paket Silver', harga: 500000, deskripsi: 'Paket lengkap', items: ['Beras 5 kg', 'Minyak 2L', 'Gula 2kg'], stok: 40 },
  { _id: 'PKT003', nama: 'Paket Gold', harga: 750000, deskripsi: 'Paket premium', items: ['Beras 10 kg', 'Minyak 2L', 'Gula 2kg', 'Daging'], stok: 20 },
]

const MOCK_TABUNGAN = [
  { _id: 'TAB001', anggota: MOCK_ANGGOTA[0], jumlah: 50000, tanggal: '2025-03-01', keterangan: 'Tabungan sukarela' },
  { _id: 'TAB002', anggota: MOCK_ANGGOTA[2], jumlah: 75000, tanggal: '2025-03-05', keterangan: 'Tabungan tambahan' },
]

function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return fallback
}

// Initialize localStorage with mock data if empty
function initLocalStorage() {
  if (!localStorage.getItem('pilar-anggota')) {
    setLocal('pilar-anggota', MOCK_ANGGOTA)
  }
  if (!localStorage.getItem('pilar-paket')) {
    setLocal('pilar-paket', MOCK_PAKET)
  }
  if (!localStorage.getItem('pilar-tabungan-bebas')) {
    setLocal('pilar-tabungan-bebas', MOCK_TABUNGAN)
  }
}

// Call init on load
initLocalStorage()

export const useDataStore = create((set, get) => ({
  anggota:    getLocal('pilar-anggota', MOCK_ANGGOTA),
  paket:      getLocal('pilar-paket', MOCK_PAKET),
  pembayaran: [],
  tabunganBebas: getLocal('pilar-tabungan-bebas', MOCK_TABUNGAN),
  loading:    false,

  // ── ANGGOTA ──────────────────────────────────
  async fetchAnggota() {
    set({ loading: true })
    try {
      const data = await directFetch('GET', '/anggota')
      setLocal('pilar-anggota', data)
      set({ anggota: data, loading: false })
    } catch (err) {
      console.warn('Using local anggota:', err.message)
      const local = getLocal('pilar-anggota', MOCK_ANGGOTA)
      setLocal('pilar-anggota', local)
      set({ anggota: local, loading: false })
    }
  },

  // ── PAKET ────────────────────────────────────
  async fetchPaket() {
    set({ loading: true })
    try {
      const data = await directFetch('GET', '/paket')
      setLocal('pilar-paket', data)
      set({ paket: data, loading: false })
    } catch (err) {
      console.warn('Using local paket:', err.message)
      const local = getLocal('pilar-paket', MOCK_PAKET)
      setLocal('pilar-paket', local)
      set({ paket: local, loading: false })
    }
  },

  // ── TABUNGAN BEBAS ───────────────────────────
  async fetchTabunganBebas() {
    set({ loading: true })
    try {
      const data = await directFetch('GET', '/tabungan-bebas')
      setLocal('pilar-tabungan-bebas', data)
      set({ tabunganBebas: data, loading: false })
    } catch (err) {
      console.warn('Using local tabungan:', err.message)
      const local = getLocal('pilar-tabungan-bebas', MOCK_TABUNGAN)
      setLocal('pilar-tabungan-bebas', local)
      set({ tabunganBebas: local, loading: false })
    }
  },

  async addTabunganBebas(data) {
    const anggotaList = get().anggota.length > 0 ? get().anggota : MOCK_ANGGOTA
    const anggotaInfo = anggotaList.find(a => a._id === data.anggota) || { _id: data.anggota, nama: 'Unknown' }
    
    const newEntry = {
      ...data,
      _id: 'local_' + Date.now(),
      anggota: anggotaInfo,
      createdAt: new Date().toISOString()
    }
    
    const current = get().tabunganBebas
    const updated = [newEntry, ...current]
    setLocal('pilar-tabungan-bebas', updated)
    set({ tabunganBebas: updated })
    
    // Try API but don't wait
    try {
      await directFetch('POST', '/tabungan-bebas', data)
    } catch {}
    
    return newEntry
  },

  async deleteTabunganBebas(id) {
    const current = get().tabunganBebas
    const updated = current.filter(t => t._id !== id)
    setLocal('pilar-tabungan-bebas', updated)
    set({ tabunganBebas: updated })
    
    try {
      await directFetch('DELETE', '/tabungan-bebas/' + id)
    } catch {}
  },

  async updateTabunganBebas(id, data) {
    const current = get().tabunganBebas
    const anggotaList = get().anggota.length > 0 ? get().anggota : MOCK_ANGGOTA
    const anggotaInfo = anggotaList.find(a => a._id === data.anggota) || { _id: data.anggota, nama: 'Unknown' }
    
    const updated = current.map(t => {
      if (t._id === id) {
        return { ...t, ...data, anggota: anggotaInfo, updatedAt: new Date().toISOString() }
      }
      return t
    })
    setLocal('pilar-tabungan-bebas', updated)
    set({ tabunganBebas: updated })
    
    try {
      await directFetch('PUT', '/tabungan-bebas/' + id, data)
    } catch {}
    
    return updated.find(t => t._id === id)
  },

  // ── PEMBAYARAN ───────────────────────────────
  async fetchPembayaran() {
    set({ loading: true })
    try {
      const data = await directFetch('GET', '/pembayaran')
      setLocal('pilar-pembayaran', data)
      set({ pembayaran: data, loading: false })
    } catch (err) {
      console.warn('Using local pembayaran:', err.message)
      const local = getLocal('pilar-pembayaran', [])
      setLocal('pilar-pembayaran', local)
      set({ pembayaran: local, loading: false })
    }
  },
}))
