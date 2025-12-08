# Flowchart Prava Cash

Dokumentasi flowchart untuk aplikasi Prava Cash - Cashflow Management Dashboard.

## 📊 Flowchart Aplikasi Utama

```mermaid
flowchart TD
    A[User Membuka Aplikasi] --> B[Load Initial Data]
    B --> C[Connect WebSocket]
    C --> D[Display Dashboard]
    D --> E{User Action?}
    
    E -->|Tambah Transaksi| F[Form Input Transaksi]
    E -->|Edit Transaksi| G[Form Edit Transaksi]
    E -->|Hapus Transaksi| H[Konfirmasi Hapus]
    E -->|Export Excel| I[Export Data]
    E -->|Bersihkan Data| J[Konfirmasi Reset]
    
    F --> K[Validasi Form]
    G --> K
    K -->|Valid| L[Input PIN]
    K -->|Invalid| M[Show Error Toast]
    M --> F
    
    L --> N{Validasi PIN}
    N -->|PIN Benar| O[Submit ke API]
    N -->|PIN Salah| P[Show PIN Error]
    P --> L
    
    O --> Q[Server Process]
    Q --> R[Save ke Database]
    R --> S[Broadcast via WebSocket]
    S --> T[Update All Clients]
    T --> D
    
    H --> L
    I --> L
    J --> L
    
    style A fill:#e1f5ff
    style D fill:#c8e6c9
    style O fill:#fff9c4
    style S fill:#f3e5f5
    style T fill:#e8f5e9
```

## 🔐 Flowchart Autentikasi PIN

```mermaid
flowchart TD
    A[User Memilih Aksi] --> B{Aksi Type?}
    
    B -->|Create/Edit| C[Isi Form Transaksi]
    B -->|Delete| D[Pilih Transaksi]
    B -->|Export| E[Klik Export]
    B -->|Reset| F[Klik Reset]
    
    C --> G[Validasi Form]
    D --> G
    E --> G
    F --> G
    
    G -->|Valid| H[Tampilkan Modal PIN]
    G -->|Invalid| I[Show Error]
    I --> C
    
    H --> J[User Input PIN]
    J --> K{Validasi PIN}
    
    K -->|PIN Benar| L[Lanjutkan Proses]
    K -->|PIN Salah| M[Show PIN Error]
    M --> J
    
    L -->|Create| N[POST /api/transactions]
    L -->|Edit| O[PUT /api/transactions/:id]
    L -->|Delete| P[DELETE /api/transactions/:id]
    L -->|Export| Q[Generate Excel]
    L -->|Reset| R[DELETE /api/transactions]
    
    N --> S[Success]
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S --> T[Close Modal]
    T --> U[Update UI]
    
    style H fill:#fff9c4
    style K fill:#ffccbc
    style S fill:#c8e6c9
```

## 🔄 Flowchart Real-time Update (WebSocket)

```mermaid
flowchart TD
    A[App Start] --> B[Initialize Socket.IO]
    B --> C{Environment?}
    
    C -->|Production| D[Connect via Polling]
    C -->|Development| E[Connect via WebSocket/Polling]
    
    D --> F[Socket Connected]
    E --> F
    
    F --> G[Listen: transactions:updated]
    
    H[User Action di Client 1] --> I[API Request]
    I --> J[Server Process]
    J --> K[Update Database]
    K --> L[Broadcast Event]
    
    L --> M[Socket.IO Emit]
    M --> N[All Connected Clients Receive]
    
    N --> O[Client 1: Update UI]
    N --> P[Client 2: Update UI]
    N --> Q[Client N: Update UI]
    
    O --> R[No Refresh Needed]
    P --> R
    Q --> R
    
    G --> N
    
    style F fill:#c8e6c9
    style L fill:#f3e5f5
    style M fill:#e1bee7
    style R fill:#e8f5e9
```

## 🏗️ Flowchart Arsitektur Deployment

```mermaid
flowchart TB
    subgraph "GitHub Repository"
        A[Source Code]
    end
    
    subgraph "Netlify - Frontend"
        B[Build Process]
        C[Static Files]
        D[Environment Variables]
        E[VITE_API_URL]
        F[VITE_PIN_CODE]
    end
    
    subgraph "Railway - Backend"
        G[Node.js Server]
        H[Express API]
        I[Socket.IO]
        J[SQLite Database]
        K[Volume: /app/data]
    end
    
    subgraph "User Browser"
        L[React App]
        M[Socket.IO Client]
    end
    
    A -->|Push Code| B
    B -->|Build| C
    D --> E
    D --> F
    C --> L
    
    L -->|API Calls| H
    L -->|WebSocket| I
    M -->|Polling/WebSocket| I
    
    H -->|Read/Write| J
    J -->|Persist| K
    
    I -->|Broadcast| M
    
    style A fill:#e1f5ff
    style C fill:#c8e6c9
    style H fill:#fff9c4
    style J fill:#f3e5f5
    style L fill:#e8f5e9
```

## 📝 Flowchart Proses Transaksi (Detail)

```mermaid
flowchart TD
    A[User Klik Tambah/Edit] --> B[Open Modal]
    B --> C[Isi Form: Description, Amount, Type, Date]
    C --> D[Klik Submit/Lanjutkan]
    
    D --> E{Validasi Form}
    E -->|Description Empty| F[Show Error: Uraian wajib diisi]
    E -->|Amount <= 0| G[Show Error: Nominal harus lebih dari 0]
    E -->|Type Invalid| H[Show Error: Jenis transaksi wajib dipilih]
    E -->|Date Invalid| I[Show Error: Tanggal wajib diisi]
    E -->|All Valid| J[Show PIN Input]
    
    F --> C
    G --> C
    H --> C
    I --> C
    
    J --> K[User Input PIN]
    K --> L[Klik Konfirmasi PIN]
    
    L --> M{PIN Valid?}
    M -->|PIN Salah| N[Show Error: PIN salah]
    M -->|PIN Benar| O{Action Type?}
    
    N --> K
    
    O -->|Create| P[POST /api/transactions]
    O -->|Edit| Q[PUT /api/transactions/:id]
    
    P --> R[Server Validasi]
    Q --> R
    
    R -->|Valid| S[Save to Database]
    R -->|Invalid| T[Return 400 Error]
    
    T --> U[Show Error Toast]
    U --> B
    
    S --> V[Broadcast WebSocket Event]
    V --> W[All Clients Update]
    W --> X[Close Modal]
    X --> Y[Show Success Toast]
    Y --> Z[Reset Form]
    
    style J fill:#fff9c4
    style M fill:#ffccbc
    style S fill:#c8e6c9
    style V fill:#f3e5f5
```

## 🗑️ Flowchart Hapus Transaksi

```mermaid
flowchart TD
    A[User Klik Hapus] --> B[Show Confirm Dialog]
    B --> C{User Confirm?}
    
    C -->|Cancel| D[Close Dialog]
    C -->|Ya, Hapus| E[Show PIN Input]
    
    D --> F[Back to List]
    
    E --> G[User Input PIN]
    G --> H[Klik Konfirmasi PIN]
    
    H --> I{PIN Valid?}
    I -->|PIN Salah| J[Show Error: PIN salah]
    I -->|PIN Benar| K[DELETE /api/transactions/:id]
    
    J --> G
    
    K --> L{Transaction Exists?}
    L -->|Not Found| M[Return 404]
    L -->|Found| N[Delete from Database]
    
    M --> O[Show Error Toast]
    O --> F
    
    N --> P[Broadcast WebSocket Event]
    P --> Q[All Clients Update]
    Q --> R[Close Modal]
    R --> S[Show Success Toast]
    S --> F
    
    style E fill:#fff9c4
    style I fill:#ffccbc
    style N fill:#c8e6c9
    style P fill:#f3e5f5
```

## 📥 Flowchart Export Excel

```mermaid
flowchart TD
    A[User Klik Download Excel] --> B{Data Available?}
    
    B -->|No Data| C[Show Error: Belum ada transaksi]
    B -->|Has Data| D[Show PIN Input Modal]
    
    C --> E[Back to Dashboard]
    
    D --> F[User Input PIN]
    F --> G[Klik Konfirmasi PIN]
    
    G --> H{PIN Valid?}
    H -->|PIN Salah| I[Show Error: PIN salah]
    H -->|PIN Benar| J[Generate Excel Data]
    
    I --> F
    
    J --> K[Format Data: Tanggal, Uraian, Pemasukan, Pengeluaran, Saldo]
    K --> L[Create Workbook]
    L --> M[Download File: prava-cash-transactions-YYYY-MM-DD.xlsx]
    M --> N[Show Success Toast]
    N --> O[Close Modal]
    O --> E
    
    style D fill:#fff9c4
    style H fill:#ffccbc
    style M fill:#c8e6c9
```

## 🔄 Flowchart Database Operations

```mermaid
flowchart TD
    A[API Request] --> B{Operation Type?}
    
    B -->|GET| C[List All Transactions]
    B -->|POST| D[Create Transaction]
    B -->|PUT| E[Update Transaction]
    B -->|DELETE| F[Delete Transaction]
    
    C --> G[Query SQLite]
    D --> H[Validate Data]
    E --> H
    F --> I[Check Transaction Exists]
    
    H -->|Valid| J[Insert/Update SQLite]
    H -->|Invalid| K[Return 400 Error]
    
    I -->|Found| L[Delete from SQLite]
    I -->|Not Found| M[Return 404 Error]
    
    G --> N[Return JSON Array]
    J --> O[Return Success]
    L --> O
    
    O --> P[Broadcast WebSocket Event]
    P --> Q[All Clients Receive Update]
    
    style J fill:#c8e6c9
    style L fill:#c8e6c9
    style P fill:#f3e5f5
    style K fill:#ffcdd2
    style M fill:#ffcdd2
```

## 📱 Flowchart Responsive Design

```mermaid
flowchart TD
    A[User Access App] --> B{Device Type?}
    
    B -->|Mobile| C[Mobile Layout]
    B -->|Tablet| D[Tablet Layout]
    B -->|Desktop| E[Desktop Layout]
    
    C --> F[Single Column Cards]
    C --> G[Carousel Stats]
    C --> H[Mobile Transaction List]
    
    D --> I[2 Column Layout]
    D --> J[Grid Stats]
    D --> K[Table Transaction List]
    
    E --> L[3 Column Layout]
    E --> M[Grid Stats]
    E --> N[Full Table Transaction List]
    
    F --> O[Touch Optimized]
    I --> P[Hybrid Touch/Mouse]
    L --> Q[Mouse Optimized]
    
    style C fill:#e3f2fd
    style D fill:#f3e5f5
    style E fill:#e8f5e9
```

## 🚀 Flowchart Build & Deploy Process

```mermaid
flowchart TD
    A[Developer Push to GitHub] --> B[GitHub Webhook Triggered]
    
    B --> C{Service?}
    
    C -->|Frontend| D[Netlify Build]
    C -->|Backend| E[Railway Build]
    
    D --> F[Install Dependencies]
    F --> G[Read Environment Variables]
    G --> H[VITE_API_URL]
    G --> I[VITE_PIN_CODE]
    H --> J[Build React App]
    I --> J
    J --> K[Generate Static Files]
    K --> L[Deploy to CDN]
    
    E --> M[Install Dependencies]
    M --> N[Start Node.js Server]
    N --> O[Express + Socket.IO Running]
    O --> P[Connect to Database]
    P --> Q[Volume Mount: /app/data]
    
    L --> R[Frontend Live]
    Q --> S[Backend Live]
    
    R --> T[User Access App]
    S --> T
    
    style D fill:#00c7b7
    style E fill:#0b0d0e
    style R fill:#c8e6c9
    style S fill:#c8e6c9
```

## 📋 Legend

- 🟦 **Blue**: Start/Entry Point
- 🟩 **Green**: Success/Completion
- 🟨 **Yellow**: Process/Processing
- 🟪 **Purple**: WebSocket/Real-time
- 🟥 **Red**: Error/Failure
- 🟧 **Orange**: Validation/Check

## 📝 Catatan

1. **WebSocket**: Di production menggunakan polling karena Netlify tidak support WebSocket native
2. **PIN**: Dapat diatur melalui environment variable `VITE_PIN_CODE`
3. **Database**: SQLite dengan persistent volume di Railway
4. **Real-time**: Semua perubahan otomatis ter-update di semua client yang terhubung
5. **Responsive**: Aplikasi mendukung mobile, tablet, dan desktop

