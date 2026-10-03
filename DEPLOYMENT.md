# Deployment Prava Cash

Panduan ini men-deploy frontend React/Vite ke Netlify dan backend Express + Prisma ke Railway sebagai dua service terpisah.

## Arsitektur

- Frontend: Netlify, dibangun dari folder `client/`.
- Backend API dan Socket.IO: Railway, dijalankan dari root repository.
- Database: PostgreSQL yang dapat diakses dari Railway. Backend memakai Prisma dan membutuhkan `DATABASE_URL`.

Jangan deploy frontend sebagai bagian dari service Railway. Konfigurasi Railway saat ini ada di `railway.toml` dan build command-nya masih membangun `client/`. Ganti menjadi backend-only:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npx prisma generate && npx prisma db push"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
```

`server.js` membaca port dari `process.env.PORT`. Jangan menetapkan port tetap di Railway. Jika deployment sebelumnya menjalankan frontend dan backend bersama-sama, perbarui konfigurasi build tersebut lalu deploy ulang service backend. Saat tidak ada hasil build client, halaman `/` menampilkan pesan frontend belum tersedia; endpoint API dan `/health` tetap dapat digunakan.

## Railway: Backend

1. Buat project/service Railway dari repository ini. Set **Root Directory** ke root repository (`/`) atau biarkan kosong.
2. Pastikan Railway menggunakan `railway.toml` pada root repository. Build command harus backend-only seperti contoh di atas; start command `npm start`. `build.watchPatterns` di file tersebut membatasi deploy Railway ke perubahan file backend (`server.js`, `create-admin.js`, `src/`, `prisma/`, `public/`, `data/`, manifest npm, dan `railway.toml`), sehingga perubahan khusus di `client/` tidak memicu deploy backend.
3. Sediakan PostgreSQL. Jika database dibuat di project Railway yang sama, hubungkan variable `DATABASE_URL` service backend ke connection string PostgreSQL. Jika memakai provider lain, gunakan connection string PostgreSQL provider tersebut.
4. Atur variables berikut di service backend:

| Variable | Nilai |
| --- | --- |
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_SECRET` | Secret acak yang kuat dan rahasia |
| `JWT_EXPIRES_IN` | `7d` (opsional, default aplikasi `7d`) |
| `NODE_ENV` | `production` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name dari Cloudinary |
| `CLOUDINARY_API_KEY` | API key dari Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret dari Cloudinary |

Tiga variable Cloudinary diperlukan untuk upload gambar. `PORT` tidak perlu diisi secara manual karena Railway menyediakan port untuk service.

5. Backend menggunakan domain publik `https://pravacash.up.railway.app`.
6. Atur health check service ke `/health` jika pengaturan health check tersedia.
7. Pastikan log deployment menampilkan koneksi PostgreSQL berhasil dan service berjalan.

> `npx prisma db push` menerapkan schema Prisma saat build/deploy. Pastikan database yang terhubung memang database environment yang dimaksud sebelum menjalankan deployment.

## Netlify: Frontend

1. Import repository yang sama sebagai site Netlify.
2. Gunakan pengaturan build berikut. Nilai-nilai ini juga sudah disimpan di `netlify.toml`:

| Pengaturan | Nilai |
| --- | --- |
| Base directory | `client` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` (relatif terhadap base directory) |
| Node version | `18` |

3. Tambahkan environment variable di site Netlify:

| Variable | Nilai |
| --- | --- |
| `VITE_API_URL` | `https://pravacash.up.railway.app` |

`VITE_API_URL` harus memakai URL HTTPS backend tanpa slash di akhir. Variable `VITE_*` dimasukkan ke dalam bundle frontend saat build, jadi trigger ulang deployment Netlify setelah mengubahnya.
PIN tidak perlu diatur sebagai environment variable Netlify. Setiap pengguna mengatur PIN sendiri melalui Settings setelah login. `VITE_PIN_CODE` saat ini tidak digunakan oleh alur aplikasi.

## Verifikasi

1. Buka `https://pravacash.up.railway.app/health`. Respons yang diharapkan berupa JSON dengan `ok: true`.
2. Buka URL site Netlify dan coba login, memuat transaksi, lalu periksa console/network browser jika request API gagal.
3. Pastikan request API dan koneksi Socket.IO menuju domain Railway, bukan domain Netlify.

Backend saat ini menggunakan CORS yang mengizinkan semua origin. Setelah deployment berjalan, batasi CORS HTTP dan Socket.IO ke domain Netlify untuk penggunaan produksi.

## Catatan Upload Gambar

Saat ini form upload di `client/src/components/modals/TransactionModal.jsx` memanggil `/api/upload` sebagai path relatif. Pada setup domain terpisah, request tersebut menuju Netlify, bukan Railway. Ubah request itu agar menggunakan base URL `VITE_API_URL` sebelum mengandalkan upload gambar. Endpoint backend dan konfigurasi Cloudinary tetap berada di Railway.
