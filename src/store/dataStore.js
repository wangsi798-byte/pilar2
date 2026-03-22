import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_ANGGOTA, SEED_PAKET, SEED_PEMBAYARAN } from '../data/mockData'

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

const calculateRekap = (anggota, paket, pembayaran) => {
  const totalTerkumpul = pembayaran.reduce((acc, p) => acc + p.jumlah, 0)

  // Hitung total tagihan dari seluruh anggota berdasarkan paket yang mereka ambil
  // Dalam seed data, anggotaId menghubungkan pembayaran ke anggota.
  // Kami asumsikan satu anggota mengambil satu paket (berdasarkan pembayaran pertama mereka).
  const totalTagihan = anggota.reduce((acc, a) => {
    const p = pembayaran.find(pay => (pay.anggotaId === a.id || pay.anggota?._id === a._id))
    if (p) {
      const pkt = paket.find(pk => (pk.id === p.paketId || pk._id === p.paket?._id))
      return acc + (pkt?.harga || 0)
    }
    return acc
  }, 0)

  // Hitung berapa yang sudah lunas
  const lunasCount = anggota.filter(a => {
    const pays = pembayaran.filter(p => (p.anggotaId === a.id || p.anggota?._id === a._id))
    if (pays.length === 0) return false
    const totalPaid = pays.reduce((acc, p) => acc + p.jumlah, 0)
    const pkt = paket.find(pk => (pk.id === pays[0].paketId || pk._id === pays[0].paket?._id))
    return pkt && totalPaid >= pkt.harga
  }).length

  return {
    ringkasan: {
      totalTerkumpul,
      totalTagihan,
      jumlahLunas: lunasCount,
      totalAnggota: anggota.length
    }
  }
}

export const useDataStore = create(
  persist(
    (set, get) => ({
      anggota:    SEED_ANGGOTA.map(a => ({ ...a, _id: a.id })),
      paket:      SEED_PAKET.map(p => ({ ...p, _id: p.id })),
      pembayaran: SEED_PEMBAYARAN.map(p => ({
        ...p,
        _id: p.id,
        anggota: SEED_ANGGOTA.find(a => a.id === p.anggotaId),
        paket: SEED_PAKET.find(pk => pk.id === p.paketId)
      })),
      rekap:      null,
      loading:    false,
      error:      null,

      _setErr(err)  { set({ error: err?.message ?? String(err), loading: false }) },
      clearError()  { set({ error: null }) },

      // ── ANGGOTA ──────────────────────────────────
      async fetchAnggota(q = '', status = '') {
        set({ loading: true })
        await delay()
        let filtered = get().anggota
        if (q) filtered = filtered.filter(a => a.nama.toLowerCase().includes(q.toLowerCase()))
        if (status) filtered = filtered.filter(a => a.status === status)
        set({ loading: false })
      },

      async addAnggota(data) {
        await delay()
        const newItem = { ...data, _id: 'ANG-' + Math.random().toString(36).substring(7) }
        set(s => ({ anggota: [newItem, ...s.anggota] }))
        return newItem
      },

      async updateAnggota(id, data) {
        await delay()
        set(s => ({ anggota: s.anggota.map(a => a._id === id ? { ...a, ...data } : a) }))
        return data
      },

      async deleteAnggota(id) {
        await delay()
        set(s => ({ anggota: s.anggota.filter(a => a._id !== id) }))
      },

      // ── PAKET ────────────────────────────────────
      async fetchPaket() {
        set({ loading: true })
        await delay()
        set({ loading: false })
      },

      async addPaket(data) {
        await delay()
        const newItem = { ...data, _id: 'PKT-' + Math.random().toString(36).substring(7) }
        set(s => ({ paket: [...s.paket, newItem] }))
        return newItem
      },

      async updatePaket(id, data) {
        await delay()
        set(s => ({ paket: s.paket.map(p => p._id === id ? { ...p, ...data } : p) }))
        return data
      },

      async deletePaket(id) {
        await delay()
        set(s => ({ paket: s.paket.filter(p => p._id !== id) }))
      },

      // ── PEMBAYARAN ───────────────────────────────
      async fetchPembayaran(filters) {
        set({ loading: true })
        await delay()
        set({ loading: false })
      },

      async addPembayaran(data) {
        await delay()
        const targetAnggota = get().anggota.find(a => a._id === data.anggotaId)
        const targetPaket = get().paket.find(p => p._id === data.paketId)
        const newItem = {
          ...data,
          _id: 'PAY-' + Math.random().toString(36).substring(7),
          anggota: targetAnggota,
          paket: targetPaket
        }
        set(s => ({ pembayaran: [newItem, ...s.pembayaran] }))
        return newItem
      },

      async updatePembayaran(id, data) {
        await delay()
        set(s => ({ pembayaran: s.pembayaran.map(p => p._id === id ? { ...p, ...data } : p) }))
        return data
      },

      async deletePembayaran(id) {
        await delay()
        set(s => ({ pembayaran: s.pembayaran.filter(p => p._id !== id) }))
      },

      // ── REKAP ────────────────────────────────────
      async fetchRekap() {
        set({ loading: true })
        await delay()
        const { anggota, paket, pembayaran } = get()
        const rekapData = calculateRekap(anggota, paket, pembayaran)
        set({ rekap: rekapData, loading: false })
      },
    }),
    { name: 'pilar-data' }
  )
)
