import { create } from 'zustand'
import { api }     from '../utils/api'

export const useDataStore = create((set, get) => ({
  anggota:    [],
  paket:      [],
  pembayaran: [],
  rekap:      null,
  loading:    false,
  error:      null,

  _setErr(err)  { set({ error: err?.message ?? String(err), loading: false }) },
  clearError()  { set({ error: null }) },

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

  // ── REKAP ────────────────────────────────────
  async fetchRekap() {
    set({ loading: true })
    try {
      const res = await api.get('/pembayaran/rekap')
      set({ rekap: res, loading: false })
    } catch (err) { get()._setErr(err) }
  },
}))
