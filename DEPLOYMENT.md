# Panduan Deployment

## Persiapan

1. Pastikan semua perubahan sudah di-commit ke Git
2. Pastikan `.gitignore` sudah mengabaikan file sensitif (node_modules, .env, dll)

## Deploy ke GitHub

```bash
# Jika belum ada Git repository
git init
git add .
git commit -m "Initial commit"

# Tambahkan remote GitHub
git remote add origin https://github.com/username/accountant.git
git branch -M main
git push -u origin main
```

## Deploy Frontend ke Netlify

1. Login ke [Netlify](https://netlify.com)
2. Klik "Add new site" → "Import an existing project"
3. Pilih GitHub dan pilih repository Anda
4. Konfigurasi build settings:
   - **Base directory**: `client`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `client/dist`
5. Klik "Show advanced" dan tambahkan environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: URL backend Anda (contoh: `https://your-backend.herokuapp.com`)
6. Klik "Deploy site"

## Deploy Backend

### Menggunakan Render.com

1. Login ke [Render.com](https://render.com)
2. Klik "New" → "Web Service"
3. Connect GitHub repository
4. Konfigurasi:
   - **Name**: `accountant-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Tambahkan **Disk** untuk folder `data/` agar database persisten
6. Deploy

### Menggunakan Railway.app

1. Login ke [Railway.app](https://railway.app)
2. Klik "New Project" → "Deploy from GitHub repo"
3. Pilih repository Anda
4. Railway akan otomatis detect Node.js
5. Tambahkan **Volume** untuk folder `data/`
6. Deploy

## Setelah Deploy

1. **Update Environment Variable di Netlify**: Set `VITE_API_URL` dengan URL backend yang sudah di-deploy
2. **Test**: Buka URL Netlify dan pastikan aplikasi berfungsi
3. **Monitor**: Cek logs di Netlify dan backend service untuk memastikan tidak ada error

## Troubleshooting

- **CORS Error**: Pastikan backend mengizinkan origin Netlify Anda
- **API tidak terhubung**: Pastikan `VITE_API_URL` sudah di-set dengan benar di Netlify
- **Database hilang**: Pastikan folder `data/` menggunakan persistent storage/volume

