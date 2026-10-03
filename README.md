# Prava Cash - Cashflow Management Dashboard

Dashboard arus kas modern dengan backend **Node.js + Express + PostgreSQL** serta frontend **React (Vite) + Tailwind CSS**. Dilengkapi dengan **WebSocket (Socket.IO)** untuk real-time update otomatis di semua client yang terhubung. **Multi-user support** dengan sistem autentikasi lengkap.

## ✨ Fitur

- 👥 **Multi-User**: Setiap user memiliki data transaksi terpisah
- 🔐 **Authentication**: Sistem login dan register dengan JWT token
- 📊 **Dashboard Real-time**: Auto-update otomatis menggunakan WebSocket ketika ada perubahan data
- 💰 **Manajemen Transaksi**: Input, edit, dan hapus transaksi dengan validasi lengkap
- 🔒 **Keamanan PIN**: Proteksi dengan PIN 4-digit untuk semua operasi penting
- 📱 **Responsive Design**: UI modern dan responsif dengan Tailwind CSS
- 📈 **Running Balance**: Perhitungan saldo berjalan otomatis
- 📥 **Export Excel**: Unduh data transaksi dalam format Excel
- 📤 **Import Excel**: Import data transaksi dari file Excel
- 🎨 **Modern UI**: Kartu statistik, form modern, dan tabel responsif

## 🏗️ Struktur Proyek

```
.
├── client/              # Vite + React + Tailwind app
│   ├── src/
│   │   ├── App.jsx      # Komponen utama dengan WebSocket
│   │   └── lib/
│   └── package.json
├── src/
│   ├── database.js      # Helper PostgreSQL (create/read/update/delete)
│   └── auth.js         # Authentication helpers (JWT, bcrypt)
├── server.js            # Express API + Socket.IO + static file server
├── package.json         # Backend dependencies
└── netlify.toml         # Konfigurasi Netlify
```

## 🚀 Menjalankan Secara Lokal

### Prasyarat
- Node.js ≥18
- PostgreSQL ≥12 (atau gunakan managed database seperti Supabase/Railway)

### Setup Database

1. **Install PostgreSQL** (jika belum):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download dari [postgresql.org](https://www.postgresql.org/download/)

2. **Buat database:**
   ```bash
   createdb pravacash
   ```

3. **Setup environment variables:**
   ```bash
   # Buat file .env di root project
   DATABASE_URL=postgresql://username:password@localhost:5432/pravacash
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   PORT=4000
   ```

### Instalasi

1. **Install dependensi backend:**
   ```bash
   npm install
   ```

2. **Install dependensi frontend:**
   ```bash
   cd client && npm install
   ```

3. **Jalankan mode pengembangan** (dua terminal):
   ```bash
   # Terminal 1 -> Backend
   npm run dev

   # Terminal 2 -> Frontend
   npm run client
   ```
   - Backend: `http://localhost:4000`
   - Frontend: `http://localhost:6001` (proxy ke backend)

4. **Build produksi:**
   ```bash
   npm run client:build
   npm start
   ```

Database schema akan otomatis dibuat saat pertama kali menjalankan aplikasi.

## 📡 API Endpoints

### Authentication (Public)
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| POST   | `/api/auth/register`      | Daftar user baru                    |
| POST   | `/api/auth/login`         | Login user                          |
| GET    | `/api/auth/verify`         | Verify token (protected)             |

### Transactions (Protected - requires JWT token)
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/api/transactions`       | Ambil semua transaksi user          |
| POST   | `/api/transactions`       | Tambah transaksi baru               |
| PUT    | `/api/transactions/:id`   | Update transaksi                    |
| DELETE | `/api/transactions/:id`   | Hapus satu transaksi                |
| DELETE | `/api/transactions`       | Hapus semua transaksi user          |

### Health Check
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/health`                 | Health check endpoint               |

**Catatan**: Semua endpoint transactions memerlukan header `Authorization: Bearer <token>`

### Contoh Request

**POST /api/transactions:**
```json
{
  "description": "Warung Biru",
  "type": "expense",
  "amount": 233000,
  "date": "2025-01-15"
}
```

## 🔌 WebSocket / Real-time Updates

Aplikasi menggunakan **Socket.IO** untuk real-time update:

- Ketika ada perubahan data (create/update/delete), semua client yang terhubung akan otomatis menerima update
- Tidak perlu refresh halaman untuk melihat perubahan terbaru
- Support multiple clients secara bersamaan

**Event yang dikirim server:**
- `transactions:updated` - Dikirim ketika ada perubahan data

## 🌐 Deployment

Panduan khusus untuk deploy backend-only di Railway dan frontend di Netlify tersedia di [DEPLOYMENT.md](./DEPLOYMENT.md). Ikuti panduan tersebut untuk build settings, environment variables, database PostgreSQL, dan verifikasi deployment.

## ⚙️ Environment Variables

### Frontend (Netlify)

| Variable      | Deskripsi                          | Contoh                                    | Wajib |
| ------------- | ---------------------------------- | ----------------------------------------- | ----- |
| `VITE_API_URL` | URL backend Railway (tanpa trailing slash) | `https://pravacash.up.railway.app` | ✅ Ya |

### Backend (Railway/Server)

| Variable      | Deskripsi                          | Contoh                                    | Wajib |
| ------------- | ---------------------------------- | ----------------------------------------- | ----- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Ya |
| `JWT_SECRET`   | Secret key untuk JWT token | `your-secret-key` | ✅ Ya |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` | ❌ Opsional (default: `7d`) |
| `PORT`         | Port server lokal; Railway mengatur port deployment | `4000` | ❌ Opsional |
| `NODE_ENV`     | Environment mode                   | `production` | ❌ Opsional |
| `CLOUDINARY_CLOUD_NAME` | Cloud name untuk upload gambar | Dari dashboard Cloudinary | Wajib untuk upload |
| `CLOUDINARY_API_KEY` | API key Cloudinary | Dari dashboard Cloudinary | Wajib untuk upload |
| `CLOUDINARY_API_SECRET` | API secret Cloudinary | Dari dashboard Cloudinary | Wajib untuk upload |

## 🔐 Keamanan

- **PIN Protection**: Semua operasi penting (create, update, delete, export) memerlukan PIN 4-digit
- **PIN**: Setiap pengguna dapat mengatur PIN 4 digit melalui Settings. PIN disimpan dan diverifikasi oleh backend.
- **CORS**: Backend dikonfigurasi untuk menerima request dari semua origin (untuk production, pertimbangkan membatasi ke domain Netlify)

### Mengatur PIN

Setelah login, buka Settings, aktifkan proteksi PIN, masukkan PIN 4 digit, lalu simpan pengaturan. Untuk mengubah PIN, masukkan PIN baru pada bagian yang sama. PIN bukan environment variable Netlify; `VITE_PIN_CODE` saat ini tidak digunakan oleh alur aplikasi.

## 📝 Catatan Penting

- **Database**: Backend menggunakan PostgreSQL melalui Prisma. Pastikan `DATABASE_URL` menunjuk ke database yang persisten.
- **WebSocket di Netlify**: Netlify tidak support WebSocket native, jadi Socket.IO akan menggunakan polling sebagai fallback (tetap memberikan real-time update)
- **Backup**: Disarankan mengaktifkan backup berkala pada provider PostgreSQL yang digunakan.
- **Tidak ada data bawaan**: Semua transaksi berasal dari input user

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express, Socket.IO, PostgreSQL via Prisma
- **Frontend**: React, Vite, Tailwind CSS, Socket.IO Client
- **Deployment**: Netlify (frontend), Railway (backend)

## 📄 License

MIT

## 👥 Credits

Developed by Pilar Labs
