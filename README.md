# 🌙 Pilar — Sistem Informasi Paket Lebaran

Aplikasi manajemen paket Lebaran berbasis web. Ringan, modern, siap deploy ke Vercel.

---

## 🛠 Tech Stack

| Layer     | Teknologi                                |
|-----------|------------------------------------------|
| Framework | React 18 + Vite 5                        |
| Styling   | Tailwind CSS 3                           |
| State     | Zustand 4 (dengan localStorage persist)  |
| Routing   | React Router v6                          |
| Icons     | Lucide React                             |
| Deploy    | Vercel (konfigurasi sudah ada)           |

---

## 🚀 Cara Jalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev

# 3. Buka browser
http://localhost:3000
```

---

## 📦 Build & Deploy ke Vercel

### Cara 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Cara 2 — GitHub + Vercel Dashboard
1. Push ke GitHub: `git push origin main`
2. Buka [vercel.com](https://vercel.com) → Import project
3. Pilih repo → Framework preset: **Vite**
4. Deploy → selesai!

> `vercel.json` sudah dikonfigurasi untuk SPA routing (semua path → `index.html`)

---

## 🔑 Kredensial Default

| Username   | Password    | Role     |
|------------|-------------|----------|
| `admin`    | `pilar2025` | Admin    |
| `operator` | `op1234`    | Operator |

> Ubah di `src/store/authStore.js` pada array `USERS`.

---

## 📁 Struktur Proyek

```
pilar/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/       # Layout, Sidebar, Header
│   │   └── ui/           # Modal, StatCard, ConfirmDialog, KetupatHero
│   ├── data/
│   │   └── mockData.js   # Seed data (anggota, paket, pembayaran)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Anggota.jsx
│   │   ├── Paket.jsx
│   │   ├── Pembayaran.jsx
│   │   └── Laporan.jsx
│   ├── store/
│   │   ├── authStore.js  # Auth + persist
│   │   └── dataStore.js  # CRUD + persist
│   └── utils/
│       └── format.js     # rupiah(), tgl(), pct()
├── index.html
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

---

## 🎨 Kustomisasi

### Warna & Tema
Edit `tailwind.config.js` → bagian `colors` dan `backgroundImage`.

### Data Awal
Edit `src/data/mockData.js` → tambah/ubah anggota, paket, pembayaran default.

### Kredensial
Edit `src/store/authStore.js` → array `USERS`.

### Nama Aplikasi
Cari-ganti `Pilar` di seluruh project.

---

## 💾 Penyimpanan Data

Semua data tersimpan di **localStorage** browser secara otomatis via Zustand persist.
Untuk production dengan banyak pengguna, ganti store dengan API backend (Express/MongoDB).

---

© 2025 Pilar · Versi 1.0
