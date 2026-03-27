import { create } from 'zustand'
import { api }     from '../utils/api'

export const useDataStore = create((set, get) => ({
  anggota:    [],
  paket:      [],
  pembayaran: [],
  tabunganBebas: [],
  rekap:      null,
  loading:    false,
  error:      null,

  _setErr(err)  { set({ error: err?.message ?? String(err), loading: false }) },
  clearError()  { set({ error: null }) },
  
  // Initialize local data from mock if empty
  _initLocalData() {
    const mockAnggota = [
      { _id: 'ANG001', nama: 'Ahmad Fauzi',      alamat: 'Jl. Mawar No. 12',     telepon: '081234567890', bergabung: '2025-01-05', status: 'aktif' },
      { _id: 'ANG002', nama: 'Siti Rahmawati',   alamat: 'Jl. Melati No. 7',     telepon: '081345678901', bergabung: '2025-01-07', status: 'aktif' },
      { _id: 'ANG003', nama: 'Budi Santoso',     alamat: 'Jl. Kenanga No. 3',    telepon: '081456789012', bergabung: '2025-01-10', status: 'aktif' },
      { _id: 'ANG004', nama: 'Dewi Lestari',     alamat: 'Jl. Flamboyan No. 18', telepon: '081567890123', bergabung: '2025-01-12', status: 'aktif' },
      { _id: 'ANG005', nama: 'Eko Prasetyo',     alamat: 'Jl. Anggrek No. 5',    telepon: '081678901234', bergabung: '2025-01-15', status: 'aktif' },
    ]
    const mockPaket = [
      { _id: 'PKT001', nama: 'Paket Bronze', harga: 300000, deskripsi: 'Paket sembako dasar', items: ['Beras 5 kg', 'Minyak 2L'], stok: 30 },
      { _id: 'PKT002', nama: 'Paket Silver', harga: 500000, deskripsi: 'Paket lengkap', items: ['Beras 5 kg', 'Minyak 2L', 'Gula 2kg'], stok: 40 },
      { _id: 'PKT003', nama: 'Paket Gold', harga: 750000, deskripsi: 'Paket premium', items: ['Beras 10 kg', 'Minyak 2L', 'Gula 2kg', 'Daging'], stok: 20 },
    ]
    const mockPembayaran = [
      { _id: 'PAY001', anggota: mockAnggota[0], paket: mockPaket[1], jumlah: 100000, tanggal: '2025-02-10', metode: 'tunai', keterangan: 'Cicilan 1' },
      { _id: 'PAY002', anggota: mockAnggota[1], paket: mockPaket[0], jumlah: 300000, tanggal: '2025-02-15', metode: 'transfer', keterangan: 'Lunas' },
    ]
    const mockTabunganBebas = [
      { _id: 'TAB001', anggota: mockAnggota[0], jumlah: 50000, tanggal: '2025-03-01', keterangan: 'Tabungan sukarela' },
      { _id: 'TAB002', anggota: mockAnggota[2], jumlah: 75000, tanggal: '2025-03-05', keterangan: 'Tabungan tambahan' },
    ]
    
    if (!localStorage.getItem('pilar-anggota')) {
      localStorage.setItem('pilar-anggota', JSON.stringify(mockAnggota))
    }
    if (!localStorage.getItem('pilar-paket')) {
      localStorage.setItem('pilar-paket', JSON.stringify(mockPaket))
    }
    if (!localStorage.getItem('pilar-pembayaran')) {
      localStorage.setItem('pilar-pembayaran', JSON.stringify(mockPembayaran))
    }
    if (!localStorage.getItem('pilar-tabungan-bebas')) {
      localStorage.setItem('pilar-tabungan-bebas', JSON.stringify(mockTabunganBebas))
    }
  },
  
  // Local storage helpers for tabungan bebas fallback
  _getLocalTabunganBebas() {
    try {
      const raw = localStorage.getItem('pilar-tabungan-bebas')
      if (!raw) {
        get()._initLocalData()
        return JSON.parse(localStorage.getItem('pilar-tabungan-bebas') || '[]')
      }
      return JSON.parse(raw)
    } catch { 
      get()._initLocalData()
      return [] 
    }
  },
  _setLocalTabunganBebas(data) {
    localStorage.setItem('pilar-tabungan-bebas', JSON.stringify(data))
  },

  // ── ANGGOTA ──────────────────────────────────
  _getLocalAnggota() {
    try {
      const raw = localStorage.getItem('pilar-anggota')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  _setLocalAnggota(data) {
    localStorage.setItem('pilar-anggota', JSON.stringify(data))
  },
  async fetchAnggota(q = '', status = '') {
    set({ loading: true })
    try {
      const params = new URLSearchParams()
      if (q)      params.append('q', q)
      if (status) params.append('status', status)
      const qs = params.toString()
      const res = await api.get('/anggota' + (qs ? '?' + qs : ''))
      const data = res.data || res
      get()._setLocalAnggota(data)
      set({ anggota: data, loading: false })
    } catch (err) {
      console.warn('API fetch failed, using local storage:', err.message)
      const localData = get()._getLocalAnggota()
      set({ anggota: localData, loading: false })
    }
  },

  async addAnggota(data) {
    const res = await api.post('/anggota', data)
    set(s => ({ anggota: [res.data, ...s.anggota] }))
    return res.data
  },

  async updateAnggota(id, data) {
    const res = await api.put('/anggota/' + id, data)
    set(s => ({ anggota: s.anggota.map(a => a._id === id ? res.data : a) }))
    return res.data
  },

  async deleteAnggota(id) {
    await api.delete('/anggota/' + id)
    set(s => ({ anggota: s.anggota.filter(a => a._id !== id) }))
  },

  // ── PAKET ────────────────────────────────────
  _getLocalPaket() {
    try {
      const raw = localStorage.getItem('pilar-paket')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  _setLocalPaket(data) {
    localStorage.setItem('pilar-paket', JSON.stringify(data))
  },
  async fetchPaket() {
    set({ loading: true })
    try {
      const res = await api.get('/paket')
      const data = res.data || res
      get()._setLocalPaket(data)
      set({ paket: data, loading: false })
    } catch (err) {
      console.warn('API fetch failed, using local storage:', err.message)
      const localData = get()._getLocalPaket()
      set({ paket: localData, loading: false })
    }
  },

  async addPaket(data) {
    const res = await api.post('/paket', data)
    set(s => ({ paket: [...s.paket, res.data] }))
    return res.data
  },

  async updatePaket(id, data) {
    const res = await api.put('/paket/' + id, data)
    set(s => ({ paket: s.paket.map(p => p._id === id ? res.data : p) }))
    return res.data
  },

  async deletePaket(id) {
    await api.delete('/paket/' + id)
    set(s => ({ paket: s.paket.filter(p => p._id !== id) }))
  },

  // ── PEMBAYARAN ───────────────────────────────
  _getLocalPembayaran() {
    try {
      const raw = localStorage.getItem('pilar-pembayaran')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  _setLocalPembayaran(data) {
    localStorage.setItem('pilar-pembayaran', JSON.stringify(data))
  },
  async fetchPembayaran(filters) {
    set({ loading: true })
    try {
      const qs = filters ? '?' + new URLSearchParams(filters).toString() : ''
      const res = await api.get('/pembayaran' + qs)
      const data = res.data || res
      get()._setLocalPembayaran(data)
      set({ pembayaran: data, loading: false })
    } catch (err) {
      console.warn('API fetch failed, using local storage:', err.message)
      const localData = get()._getLocalPembayaran()
      set({ pembayaran: localData, loading: false })
    }
  },

  async addPembayaran(data) {
    const res = await api.post('/pembayaran', data)
    set(s => ({ pembayaran: [res.data, ...s.pembayaran] }))
    return res.data
  },

  async updatePembayaran(id, data) {
    const res = await api.put('/pembayaran/' + id, data)
    set(s => ({ pembayaran: s.pembayaran.map(p => p._id === id ? res.data : p) }))
    return res.data
  },

  async deletePembayaran(id) {
    await api.delete('/pembayaran/' + id)
    set(s => ({ pembayaran: s.pembayaran.filter(p => p._id !== id) }))
  },

  // ── TABUNGAN BEBAS ───────────────────────────
  async fetchTabunganBebas(anggotaId) {
    set({ loading: true })
    try {
      const qs = anggotaId ? `?anggotaId=${anggotaId}` : ''
      const res = await api.get('/tabungan-bebas' + qs)
      const data = res.data || res
      // API success, update localStorage with fresh data
      get()._setLocalTabunganBebas(data)
      set({ tabunganBebas: data, loading: false })
    } catch (err) {
      console.warn('API fetch failed, using local storage:', err.message)
      try {
        // Fallback to local storage
        const localData = get()._getLocalTabunganBebas()
        set({ tabunganBebas: localData, loading: false })
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr)
        set({ tabunganBebas: [], loading: false })
      }
    }
  },

  async addTabunganBebas(data) {
    set({ loading: true })
    try {
      const res = await api.post('/tabungan-bebas', data)
      const savedData = res.data || res
      // API success, update localStorage with new item prepended
      const localData = get()._getLocalTabunganBebas()
      get()._setLocalTabunganBebas([savedData, ...localData])
      set(s => ({ tabunganBebas: [savedData, ...s.tabunganBebas], loading: false }))
      return savedData
    } catch (err) {
      console.warn('API add failed, saving locally:', err.message)
      try {
        // Fallback: create local entry with temporary ID
        const anggotaList = get().anggota
        const anggotaInfo = anggotaList.find(a => a._id === data.anggota) || { _id: data.anggota, nama: 'Local Member' }
        const localEntry = {
          ...data,
          _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          anggota: anggotaInfo
        }
        const localData = get()._getLocalTabunganBebas()
        get()._setLocalTabunganBebas([localEntry, ...localData])
        set(s => ({ tabunganBebas: [localEntry, ...s.tabunganBebas], loading: false }))
        return localEntry
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr)
        set({ loading: false })
        return null
      }
    }
  },

  async updateTabunganBebas(id, data) {
    set({ loading: true })
    try {
      const res = await api.put('/tabungan-bebas/' + id, data)
      // API success, update localStorage
      const localData = get()._getLocalTabunganBebas()
      const updatedLocal = localData.map(t => t._id === id ? res.data : t)
      get()._setLocalTabunganBebas(updatedLocal)
      set(s => ({ tabunganBebas: s.tabunganBebas.map(t => t._id === id ? res.data : t), loading: false }))
      return res.data
    } catch (err) {
      console.warn('API update failed, updating locally:', err.message)
      // Fallback: update in localStorage
      const localData = get()._getLocalTabunganBebas()
      const updatedLocal = localData.map(t => {
        if (t._id !== id) return t
        // If anggota ID provided, convert to object
        let anggotaObj = t.anggota
        if (data.anggota && typeof data.anggota === 'string') {
          const anggotaList = get().anggota
          anggotaObj = anggotaList.find(a => a._id === data.anggota) || { _id: data.anggota, nama: 'Local Member' }
        }
        return { 
          ...t, 
          ...data, 
          anggota: anggotaObj,
          updatedAt: new Date().toISOString() 
        }
      })
      get()._setLocalTabunganBebas(updatedLocal)
      set(s => ({ tabunganBebas: s.tabunganBebas.map(t => {
        if (t._id !== id) return t
        let anggotaObj = t.anggota
        if (data.anggota && typeof data.anggota === 'string') {
          const anggotaList = get().anggota
          anggotaObj = anggotaList.find(a => a._id === data.anggota) || { _id: data.anggota, nama: 'Local Member' }
        }
        return { 
          ...t, 
          ...data, 
          anggota: anggotaObj,
          updatedAt: new Date().toISOString() 
        }
      }), loading: false }))
      return { ...data, _id: id }
    }
  },

  async deleteTabunganBebas(id) {
    set({ loading: true })
    try {
      await api.delete('/tabungan-bebas/' + id)
      // API success, remove from localStorage
      const localData = get()._getLocalTabunganBebas()
      get()._setLocalTabunganBebas(localData.filter(t => t._id !== id))
      set(s => ({ tabunganBebas: s.tabunganBebas.filter(t => t._id !== id), loading: false }))
    } catch (err) {
      console.warn('API delete failed, deleting locally:', err.message)
      // Fallback: remove from localStorage
      const localData = get()._getLocalTabunganBebas()
      get()._setLocalTabunganBebas(localData.filter(t => t._id !== id))
      set(s => ({ tabunganBebas: s.tabunganBebas.filter(t => t._id !== id), loading: false }))
    }
  },

  // ── REKAP ────────────────────────────────────
  async fetchRekap() {
    set({ loading: true })
    try {
      const res = await api.get('/pembayaran/rekap')
      set({ rekap: res, loading: false })
    } catch (err) { get()._setErr(err) }
  },
}))
