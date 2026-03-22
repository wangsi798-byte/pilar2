// ── Seed data — dipakai hanya jika localStorage kosong ──
export const SEED_ANGGOTA = [
  { id: 'ANG001', nama: 'Ahmad Fauzi',      alamat: 'Jl. Mawar No. 12',     telepon: '081234567890', bergabung: '2025-01-05', status: 'aktif' },
  { id: 'ANG002', nama: 'Siti Rahmawati',   alamat: 'Jl. Melati No. 7',     telepon: '081345678901', bergabung: '2025-01-07', status: 'aktif' },
  { id: 'ANG003', nama: 'Budi Santoso',     alamat: 'Jl. Kenanga No. 3',    telepon: '081456789012', bergabung: '2025-01-10', status: 'aktif' },
  { id: 'ANG004', nama: 'Dewi Lestari',     alamat: 'Jl. Flamboyan No. 18', telepon: '081567890123', bergabung: '2025-01-12', status: 'aktif' },
  { id: 'ANG005', nama: 'Eko Prasetyo',     alamat: 'Jl. Anggrek No. 5',    telepon: '081678901234', bergabung: '2025-01-15', status: 'aktif' },
  { id: 'ANG006', nama: 'Fitri Handayani',  alamat: 'Jl. Tulip No. 9',      telepon: '081789012345', bergabung: '2025-01-18', status: 'aktif' },
  { id: 'ANG007', nama: 'Gunawan Hadi',     alamat: 'Jl. Seruni No. 21',    telepon: '081890123456', bergabung: '2025-01-20', status: 'nonaktif' },
  { id: 'ANG008', nama: 'Hana Pertiwi',     alamat: 'Jl. Dahlia No. 4',     telepon: '081901234567', bergabung: '2025-02-01', status: 'aktif' },
]

export const SEED_PAKET = [
  {
    id: 'PKT001',
    nama: 'Paket Bronze',
    harga: 300000,
    deskripsi: 'Paket sembako dasar + kue Lebaran',
    items: ['Beras 5 kg', 'Minyak goreng 2 L', 'Gula 1 kg', 'Kue Lebaran 1 toples'],
    stok: 30,
  },
  {
    id: 'PKT002',
    nama: 'Paket Silver',
    harga: 500000,
    deskripsi: 'Paket sembako lengkap + sirup + kue',
    items: ['Beras 5 kg', 'Minyak goreng 2 L', 'Gula 2 kg', 'Sirup 1 botol', 'Kue Lebaran 2 toples', 'Teh 1 dos'],
    stok: 40,
  },
  {
    id: 'PKT003',
    nama: 'Paket Gold',
    harga: 750000,
    deskripsi: 'Paket premium lengkap + daging + hamper',
    items: ['Beras 10 kg', 'Minyak goreng 2 L', 'Gula 2 kg', 'Sirup 2 botol', 'Kue Lebaran 3 toples', 'Daging sapi 1 kg', 'Hamper mewah'],
    stok: 20,
  },
]

export const SEED_PEMBAYARAN = [
  { id: 'PAY001', anggotaId: 'ANG001', paketId: 'PKT002', jumlah: 100000, tanggal: '2025-02-10', metode: 'tunai',    keterangan: 'Cicilan 1' },
  { id: 'PAY002', anggotaId: 'ANG001', paketId: 'PKT002', jumlah: 100000, tanggal: '2025-03-10', metode: 'tunai',    keterangan: 'Cicilan 2' },
  { id: 'PAY003', anggotaId: 'ANG001', paketId: 'PKT002', jumlah: 300000, tanggal: '2025-04-01', metode: 'transfer', keterangan: 'Pelunasan' },
  { id: 'PAY004', anggotaId: 'ANG002', paketId: 'PKT001', jumlah: 300000, tanggal: '2025-02-15', metode: 'transfer', keterangan: 'Lunas' },
  { id: 'PAY005', anggotaId: 'ANG003', paketId: 'PKT003', jumlah: 200000, tanggal: '2025-02-20', metode: 'tunai',    keterangan: 'Cicilan 1' },
  { id: 'PAY006', anggotaId: 'ANG004', paketId: 'PKT002', jumlah: 250000, tanggal: '2025-03-01', metode: 'transfer', keterangan: 'Cicilan 1' },
  { id: 'PAY007', anggotaId: 'ANG005', paketId: 'PKT001', jumlah: 150000, tanggal: '2025-03-05', metode: 'tunai',    keterangan: 'Cicilan 1' },
  { id: 'PAY008', anggotaId: 'ANG006', paketId: 'PKT003', jumlah: 375000, tanggal: '2025-03-10', metode: 'transfer', keterangan: 'Cicilan 1' },
  { id: 'PAY009', anggotaId: 'ANG008', paketId: 'PKT002', jumlah: 500000, tanggal: '2025-04-05', metode: 'transfer', keterangan: 'Lunas' },
]
