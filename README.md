# Prava Cash - Cashflow Management Dashboard

Dashboard arus kas modern dengan backend **Node.js + Express + SQLite** serta frontend **React (Vite) + Tailwind CSS**. Dilengkapi dengan **WebSocket (Socket.IO)** untuk real-time update otomatis di semua client yang terhubung. **Multi-user support** dengan sistem autentikasi lengkap dan **Admin Panel** untuk manajemen user.

## ✨ Fitur

- 👥 **Multi-User**: Setiap user memiliki data transaksi terpisah
- 🔐 **Authentication**: Sistem login dan register dengan JWT token
- 🛡️ **Admin Panel**: Dashboard khusus admin untuk mengelola user (create, edit, delete)
- 📊 **Dashboard Real-time**: Auto-update otomatis menggunakan WebSocket ketika ada perubahan data
- 💰 **Manajemen Transaksi**: Input, edit, dan hapus transaksi dengan validasi lengkap
- 🔒 **Keamanan PIN**: Proteksi dengan PIN 4-digit untuk semua operasi penting (default: `6745`)
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
│   │   ├── App.jsx      # Komponen utama dengan WebSocket & Dashboard
│   │   └── lib/
│   └── package.json
├── docs/                # Dokumentasi
├── src/
│   ├── database.sqlite.js # Helper SQLite (create/read/update/delete)
│   └── auth.js          # Authentication helpers (JWT, bcrypt)
├── server.js            # Express API + Socket.IO + static file server
├── package.json         # Backend dependencies
└── database.sqlite      # File database SQLite (auto-generated)
```

## 🚀 Menjalankan Secara Lokal

### Prasyarat
- Node.js ≥18
- npm atau yarn

### Setup Environment Variables

1. **Buat file .env di root project:**
   ```bash
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

   # Terminal 2 -> Frontend (Proxy ke port 4000)
   npm run dev
   ```
   - Backend: `http://localhost:4000`
   - Frontend: `http://localhost:5173` (atau port Vite default lainnya)

### Inisialisasi Admin Pertama
Untuk membuat akun admin pertama kali, gunakan endpoint khusus:
```bash
curl -X POST http://localhost:4000/api/admin/create-first \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pravapos.com",
    "password": "password",
    "name": "Administrator"
  }'
```

## 📡 API Endpoints

### Authentication (Public)
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| POST   | `/api/auth/register`      | Daftar user baru                    |
| POST   | `/api/auth/login`         | Login user                          |
| GET    | `/api/auth/verify`        | Verify token (protected)            |

### Admin (Protected - requires Admin role)
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/api/admin/users`        | Ambil daftar semua user             |
| POST   | `/api/admin/users`        | Buat user baru oleh admin           |
| PUT    | `/api/admin/users/:id`    | Update data user                    |
| DELETE | `/api/admin/users/:id`    | Hapus user                          |
| GET    | `/api/admin/stats`        | Statistik global dashboard admin    |

### Transactions (Protected - requires JWT token)
| Method | Path                      | Deskripsi                           |
| ------ | ------------------------- | ----------------------------------- |
| GET    | `/api/transactions`       | Ambil semua transaksi user          |
| POST   | `/api/transactions`       | Tambah transaksi baru               |
| PUT    | `/api/transactions/:id`   | Update transaksi                    |
| DELETE | `/api/transactions/:id`   | Hapus satu transaksi                |
| DELETE | `/api/transactions`       | Hapus semua transaksi user          |

## 🔌 WebSocket / Real-time Updates

Aplikasi menggunakan **Socket.IO** untuk sinkronisasi data antar client:
- Event `transactions:updated`: Dikirim ketika ada perubahan data transaksi.
- Event `admin:users:updated`: Dikirim ke semua admin ketika ada perubahan data user.

## 🌐 Deployment

### Backend (Node.js + SQLite)
- Gunakan host yang mendukung persistent storage (seperti VPS, Railway with Volumes, atau Heroku with Docker).
- Pastikan file `database.sqlite` tidak terhapus saat redeploy.

### Frontend
- Dapat di-deploy di Netlify, Vercel, atau static hosting lainnya.
- Set `VITE_API_URL` mengarah ke URL backend Anda.

## ⚙️ Environment Variables

### Frontend
| Variable      | Deskripsi                                  | Default |
| ------------- | ------------------------------------------ | ------- |
| `VITE_API_URL` | URL backend (API & WebSocket)             | -       |
| `VITE_PIN_CODE`| PIN 4-digit untuk proteksi transaksi       | `6745`  |

### Backend
| Variable      | Deskripsi                          | Wajib |
| ------------- | ---------------------------------- | ----- |
| `JWT_SECRET`   | Secret key untuk JWT token         | ✅ Ya  |
| `PORT`         | Port server (default: 4000)        | ❌ Tidak|

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express, Socket.IO, SQLite3
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Auth**: JWT (jsonwebtoken), bcrypt

## 📄 License

MIT

## 👥 Credits

Developed by Pilar Labs
