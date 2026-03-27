export const rupiah = (n) =>
  'Rp ' + Number(n).toLocaleString('id-ID')

export const tgl = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

export const pct = (part, total) =>
  total === 0 ? 0 : Math.min(100, Math.round((part / total) * 100))
