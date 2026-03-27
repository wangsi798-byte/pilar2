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
  
  // Local storage helpers for tabungan bebas fallback
  _getLocalTabunganBebas() {
    try {
      const raw = localStorage.getItem('pilar-tabungan-bebas')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  _setLocalTabunganBebas(data) {
    localStorage.setItem('pilar-tabungan-bebas', JSON.stringify(data))
  },

  // ── ANGGOTA ──────────────────────────────────
  async fetchAnggota(q = '', status = '') {
    set({ loading: true })
    try {
      const params = new URLSearchParams()
      if (q)      params.append('q', q)
      if (status) params.append('status', status)
      const qs = params.toString()
      const res = await api.get('/anggota' + (qs ? '?' + qs : ''))
      set({ anggota: res.data, loading: false })
    } catch (err) { get()._setErr(err) }
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
  async fetchPaket() {
    set({ loading: true })
    try {
      const res = await api.get('/paket')
      set({ paket: res.data, loading: false })
    } catch (err) { get()._setErr(err) }
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
  async fetchPembayaran(filters) {
    set({ loading: true })
    try {
      const qs = filters ? '?' + new URLSearchParams(filters).toString() : ''
      const res = await api.get('/pembayaran' + qs)
      set({ pembayaran: res.data, loading: false })
    } catch (err) { get()._setErr(err) }
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
      // API success, update localStorage with fresh data
      get()._setLocalTabunganBebas(res.data)
      set({ tabunganBebas: res.data, loading: false })
    } catch (err) {
      console.warn('API fetch failed, using local storage:', err.message)
      // Fallback to local storage
      const localData = get()._getLocalTabunganBebas()
      set({ tabunganBebas: localData, loading: false })
      // Don't set error for fallback
    }
  },

  async addTabunganBebas(data) {
    set({ loading: true })
    try {
      const res = await api.post('/tabungan-bebas', data)
      // API success, update localStorage with new item prepended
      const localData = get()._getLocalTabunganBebas()
      get()._setLocalTabunganBebas([res.data, ...localData])
      set(s => ({ tabunganBebas: [res.data, ...s.tabunganBebas], loading: false }))
      return res.data
    } catch (err) {
      console.warn('API add failed, saving locally:', err.message)
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
