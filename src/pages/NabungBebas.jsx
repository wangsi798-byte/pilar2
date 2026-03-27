export default function NabungBebas() {
  // ... existing code

  async function handleSave() {
    if (!form.anggota || !form.jumlah) return
    
    try {
      const data = { ...form, jumlah: Number(form.jumlah) }
      if (modal === 'add') {
        await addTabunganBebas(data)
      } else {
        await updateTabunganBebas(editing._id, data)
      }
      closeModal()
      fetchTabunganBebas()
    } catch (err) {
      console.error(err)
      // Tambahkan handling error di sini, misalnya menampilkan pesan error
    }
  }
}
