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

### Arsitektur Deployment

- **Frontend**: Netlify (static hosting)
- **Backend**: Railway (Node.js hosting)

### Quick Start Deployment

1. **Deploy Backend ke Railway:**
   - Lihat panduan lengkap: [RAILWAY_SETUP.md](./docs/RAILWAY_SETUP.md)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - **PENTING**: Tambahkan Volume untuk folder `data/` (mount path: `/app/data`)

2. **Deploy Frontend ke Netlify:**
   - Lihat panduan lengkap: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
   - Base directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `client/dist`
   - **PENTING**: Set environment variable `VITE_API_URL` dengan URL backend Railway

3. **Konfigurasi WebSocket:**
   - Lihat panduan: [WEBSOCKET_FIX.md](./docs/WEBSOCKET_FIX.md)
   - Pastikan `VITE_API_URL` sudah di-set dengan benar di Netlify
   - WebSocket akan otomatis menggunakan polling sebagai fallback di Netlify

### Dokumentasi Deployment

- 📘 [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Panduan deployment umum
- 🚂 [RAILWAY_SETUP.md](./docs/RAILWAY_SETUP.md) - Setup backend di Railway
- 🌐 [NETLIFY_FIX.md](./docs/NETLIFY_FIX.md) - Fix masalah di Netlify
- 🔌 [WEBSOCKET_FIX.md](./docs/WEBSOCKET_FIX.md) - Fix WebSocket auto-update
- 🔧 [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Troubleshooting guide

## ⚙️ Environment Variables

### Frontend (Netlify)

| Variable      | Deskripsi                          | Contoh                                    | Wajib |
| ------------- | ---------------------------------- | ----------------------------------------- | ----- |
| `VITE_API_URL` | URL backend Railway (tanpa trailing slash) | `https://cashflow-backend.up.railway.app` | ✅ Ya |
| `VITE_PIN_CODE` | PIN 4-digit untuk proteksi transaksi | `6745` | ❌ Opsional (default: `6745`) |

### Backend (Railway/Server)

| Variable      | Deskripsi                          | Contoh                                    | Wajib |
| ------------- | ---------------------------------- | ----------------------------------------- | ----- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Ya |
| `JWT_SECRET`   | Secret key untuk JWT token | `your-secret-key` | ✅ Ya |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` | ❌ Opsional (default: `7d`) |
| `PORT`         | Port server                        | `4000` | ❌ Opsional (default: `4000`) |
| `NODE_ENV`     | Environment mode                   | `production` | ❌ Opsional |

## 🔐 Keamanan

- **PIN Protection**: Semua operasi penting (create, update, delete, export) memerlukan PIN 4-digit
- **Default PIN**: `6745` (dapat diubah melalui environment variable `VITE_PIN_CODE` di Netlify)
- **CORS**: Backend dikonfigurasi untuk menerima request dari semua origin (untuk production, pertimbangkan membatasi ke domain Netlify)

### Mengubah PIN

Untuk mengubah PIN di production:

1. Buka Netlify Dashboard → Site settings → Environment variables
2. Tambahkan variable baru:
   - **Key**: `VITE_PIN_CODE`
   - **Value**: PIN 4-digit Anda (contoh: `1234`)
   - **Scope**: All scopes
3. Rebuild dengan "Clear cache and deploy site"

**Catatan**: Jika `VITE_PIN_CODE` tidak di-set, aplikasi akan menggunakan PIN default `6745`.

## 📝 Catatan Penting

- **Database Persistence**: Pastikan folder `data/` menggunakan persistent storage/volume di Railway agar database tidak hilang saat restart
- **WebSocket di Netlify**: Netlify tidak support WebSocket native, jadi Socket.IO akan menggunakan polling sebagai fallback (tetap memberikan real-time update)
- **Backup**: Disarankan untuk melakukan backup berkala untuk file `data/cashflow.db`
- **Tidak ada data bawaan**: Semua transaksi berasal dari input user

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express, Socket.IO, SQLite (sql.js)
- **Frontend**: React, Vite, Tailwind CSS, Socket.IO Client
- **Deployment**: Netlify (frontend), Railway (backend)

## 📄 License

MIT

## 👥 Credits

Developed by Pilar Labs
