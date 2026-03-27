export const useDataStore = create((set, get) => ({
  ...otherStates,

  async addTabunganBebas(data) {
    set({ loading: true })
    try {
      const res = await api.post('/tabungan-bebas', data)
      set(s => ({ 
        tabunganBebas: [res.data, ...s.tabunganBebas], 
        loading: false 
      }))
      return res.data
    } catch (err) { 
      set({ loading: false })
      get()._setErr(err)
      throw err 
    }
  },

  async updateTabunganBebas(id, data) {
    set({ loading: true })
    try {
      const res = await api.put('/tabungan-bebas/' + id, data)
      set(s => ({ 
        tabunganBebas: s.tabunganBebas.map(t => t._id === id ? res.data : t), 
        loading: false 
      }))
      return res.data
    } catch (err) { 
      set({ loading: false })
      get()._setErr(err)
      throw err 
    }
  },

  async deleteTabunganBebas(id) {
    set({ loading: true })
    try {
      await api.delete('/tabungan-bebas/' + id)
      set(s => ({ 
        tabunganBebas: s.tabunganBebas.filter(t => t._id !== id), 
        loading: false 
      }))
    } catch (err) { 
      set({ loading: false })
      get()._setErr(err)
      throw err 
    }
  },
}))
