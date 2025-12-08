# Panduan Setup Railway untuk Backend

## ⚠️ PENTING: Hanya Deploy Backend di Railway

**Frontend akan di-deploy ke Netlify**, jadi di Railway kita **TIDAK perlu build client**.

## Settingan Railway untuk Backend

### Build Command:
```
npm install
```

**JANGAN gunakan:**
- ❌ `npm run build` (akan build client yang tidak diperlukan)
- ❌ `cd client && npm install && npm run build` (tidak diperlukan)

### Start Command:
```
npm start
```

### Root Directory:
*(kosongkan - biarkan default)*

## Konfigurasi Lengkap

| Field | Value | Keterangan |
|-------|-------|------------|
| **Service Type** | `Web Service` | Untuk backend API |
| **Build Command** | `npm install` | Hanya install dependencies backend |
| **Start Command** | `npm start` | Menjalankan server.js |
| **Root Directory** | *(kosongkan)* | Default root project |
| **Healthcheck Path** | `/health` | Optional, untuk monitoring |

## Environment Variables (Opsional)

| Key | Value | Keterangan |
|-----|-------|------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | *(kosongkan)* | Railway akan set otomatis |

## Database Configuration

⚠️ **PENTING**: Aplikasi menggunakan **PostgreSQL**, bukan SQLite. Anda perlu setup PostgreSQL database terpisah.

### Opsi 1: Railway PostgreSQL (Recommended)

1. Di Railway project, klik **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway akan otomatis membuat database PostgreSQL
3. Copy `DATABASE_URL` dari database service
4. Set sebagai environment variable di backend service:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste connection string dari PostgreSQL service)

### Opsi 2: Supabase / Neon / Self-Hosted

Lihat panduan lengkap: [POSTGRESQL_DEPLOYMENT.md](./POSTGRESQL_DEPLOYMENT.md)

### Environment Variables untuk Database

Set salah satu format berikut di backend service:

**Format 1: DATABASE_URL (Recommended)**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Format 2: Format Terpisah**
```
DB_HOST=hostname
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=database_name
DB_PORT=5432
```

## Catatan

- ✅ Backend di Railway: https://cashflow-backend-production-85bc.up.railway.app
- ✅ Frontend di Netlify: Deploy terpisah dengan build command `npm install && npm run build` di folder `client`
- ✅ Server.js sudah handle jika `client/dist` tidak ada (akan tampilkan pesan, tapi API tetap berfungsi)
- ✅ API endpoints tetap berfungsi meski frontend tidak di-build di Railway

## Troubleshooting

### Error "vite: not found"
- Pastikan Build Command adalah `npm install` saja, BUKAN `npm run build`
- Railway hanya perlu install dependencies backend, tidak perlu build frontend

### Database Connection Error
- Pastikan PostgreSQL database sudah dibuat (Railway/Supabase/Neon)
- Pastikan `DATABASE_URL` atau `DB_*` variables sudah di-set di Railway
- Cek logs untuk error connection: `Database tidak ditemukan` atau `Gagal autentikasi`
- Lihat panduan lengkap: [POSTGRESQL_DEPLOYMENT.md](./POSTGRESQL_DEPLOYMENT.md)

