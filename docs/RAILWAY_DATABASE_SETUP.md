# Setup PostgreSQL Database di Railway - Quick Guide

## ✅ Database Sudah Dibuat

Connection string Anda:
```
postgresql://postgres:tWaivcGDiodBdDpCsMMteNpjUvpanjjM@caboose.proxy.rlwy.net:15421/railway
```

## 🔧 Langkah Setup di Railway Backend Service

### 1. Buka Backend Service di Railway

1. Login ke [Railway.app](https://railway.app)
2. Buka project Anda
3. Klik **backend service** (bukan database service)

### 2. Set Environment Variable

1. Di backend service, klik tab **"Variables"**
2. Klik **"New Variable"** atau **"Add Variable"**
3. Isi:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:tWaivcGDiodBdDpCsMMteNpjUvpanjjM@caboose.proxy.rlwy.net:15421/railway`
4. Klik **"Add"** atau **"Save"**

### 3. Redeploy Backend

Setelah set environment variable, Railway akan otomatis redeploy. Atau:

1. Klik tab **"Deployments"**
2. Klik **"Redeploy"** (jika tidak auto-redeploy)

### 4. Verifikasi Koneksi

1. **Cek Logs:**
   - Klik tab **"Deploy Logs"**
   - Scroll ke bagian bawah
   - Harus ada log:
     ```
     Connected to PostgreSQL database
     Database schema initialized
     ```

2. **Test Health Endpoint:**
   ```bash
   curl https://your-backend.railway.app/health
   ```
   Harus return: `{"ok":true,"timestamp":...}`

3. **Test API:**
   - Buka frontend aplikasi
   - Coba register user baru
   - Coba login
   - Jika berhasil, database sudah terhubung dengan benar!

## ✅ Checklist

- [ ] Database PostgreSQL sudah dibuat di Railway
- [ ] Connection string sudah di-copy
- [ ] Environment variable `DATABASE_URL` sudah di-set di backend service
- [ ] Backend sudah di-redeploy
- [ ] Logs menunjukkan "Connected to PostgreSQL database"
- [ ] Health endpoint return `{"ok":true}`
- [ ] Bisa register dan login user baru

## 🚨 Troubleshooting

### Error: "Database tidak ditemukan"

**Penyebab:** Connection string salah atau database belum aktif.

**Solusi:**
1. Pastikan connection string lengkap dan benar
2. Pastikan database service masih "Active" di Railway
3. Cek apakah ada typo di connection string

### Error: "Gagal autentikasi ke PostgreSQL"

**Penyebab:** Password salah atau user tidak memiliki permission.

**Solusi:**
1. Pastikan connection string yang digunakan adalah yang terbaru dari Railway
2. Jika password berubah, update `DATABASE_URL` di backend service
3. Redeploy backend setelah update

### Logs Tidak Menampilkan "Connected to PostgreSQL database"

**Penyebab:** Environment variable belum di-set atau aplikasi belum di-redeploy.

**Solusi:**
1. Pastikan `DATABASE_URL` sudah di-set di backend service (bukan di database service)
2. Pastikan backend sudah di-redeploy setelah set environment variable
3. Cek logs untuk error lainnya

## 📝 Catatan Penting

1. **Jangan Commit Connection String:**
   - Jangan commit connection string ke Git
   - Gunakan environment variables di Railway

2. **Backup Connection String:**
   - Simpan connection string di tempat aman
   - Jika lupa, bisa lihat di Railway database service → Variables

3. **Password Security:**
   - Railway generate password secara otomatis
   - Jangan share connection string ke publik

## 🔗 Link Dokumentasi Terkait

- [POSTGRESQL_DEPLOYMENT.md](./POSTGRESQL_DEPLOYMENT.md) - Panduan lengkap deploy PostgreSQL
- [RAILWAY_SETUP.md](./RAILWAY_SETUP.md) - Setup backend di Railway
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment umum
