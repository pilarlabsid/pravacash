const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const database = require("./src/database");
const os = require("os");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

// Fungsi untuk mendapatkan IP address lokal
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (i.e. 127.0.0.1) dan non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Fungsi helper untuk broadcast perubahan data ke semua client
const broadcastTransactionUpdate = async () => {
  const transactions = await database.listTransactions();
  io.emit("transactions:updated", transactions);
};

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.get(
  "/api/transactions",
  asyncHandler(async (_req, res) => {
    const transactions = await database.listTransactions();
    res.json(transactions);
  })
);

app.post("/api/transactions", asyncHandler(async (req, res) => {
  const { description, type, amount, date } = req.body ?? {};

  if (
    typeof description !== "string" ||
    !description.trim() ||
    !["income", "expense"].includes(type)
  ) {
    return res
      .status(400)
      .json({ message: "Deskripsi dan jenis transaksi wajib diisi." });
  }

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Nominal harus berupa angka lebih dari nol." });
  }

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: "Tanggal tidak valid." });
  }

  const id = await database.createTransaction({
    description: description.trim(),
    type,
    amount: Math.round(numericAmount),
    date,
  });
  
  // Broadcast update ke semua client
  await broadcastTransactionUpdate();
  
  return res.status(201).json({ id });
}));

app.delete("/api/transactions/:id", asyncHandler(async (req, res) => {
  const success = await database.deleteTransaction(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Transaksi tidak ditemukan." });
  }
  
  // Broadcast update ke semua client
  await broadcastTransactionUpdate();
  
  return res.status(204).send();
}));

app.delete(
  "/api/transactions",
  asyncHandler(async (_req, res) => {
    await database.deleteAllTransactions();
    
    // Broadcast update ke semua client
    await broadcastTransactionUpdate();
    
    res.status(204).send();
  })
);

app.put(
  "/api/transactions/:id",
  asyncHandler(async (req, res) => {
    const { description, type, amount, date } = req.body ?? {};
    const { id } = req.params;

    if (
      typeof description !== "string" ||
      !description.trim() ||
      !["income", "expense"].includes(type)
    ) {
      return res
        .status(400)
        .json({ message: "Deskripsi dan jenis transaksi wajib diisi." });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Nominal harus berupa angka lebih dari nol." });
    }

    if (!date || Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: "Tanggal tidak valid." });
    }

    const updated = await database.updateTransaction({
      id,
      description: description.trim(),
      type,
      amount: Math.round(numericAmount),
      date,
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan." });
    }

    // Broadcast update ke semua client
    await broadcastTransactionUpdate();

    return res.status(204).send();
  })
);

const clientDir = path.join(__dirname, "client", "dist");
const clientBuildExists = fs.existsSync(clientDir);

if (clientBuildExists) {
  app.use(express.static(clientDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.send(
      "Frontend build belum tersedia. Jalankan `npm run client` untuk mode dev atau `npm run client:build` untuk produksi."
    );
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

database
  .initDb()
  .then(() => {
    const HOST = "0.0.0.0"; // Listen pada semua interface network
    const localIP = getLocalIPAddress();
    
    // Setup WebSocket connection
    io.on("connection", (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);
      
      socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });
    
    server.listen(PORT, HOST, () => {
      console.log("\n" + "=".repeat(60));
      console.log("🚀 Cashflow dashboard ready!");
      console.log("=".repeat(60));
      console.log(`📍 Local:    http://localhost:${PORT}`);
      console.log(`🌐 Network:  http://${localIP}:${PORT}`);
      console.log("=".repeat(60));
      console.log("🔌 WebSocket enabled for realtime updates");
      console.log("=".repeat(60));
      console.log("\n💡 Akses dari perangkat lain di jaringan yang sama:");
      console.log(`   Gunakan: http://${localIP}:${PORT}`);
      console.log("\n");
    });
  })
  .catch((error) => {
    console.error("Gagal menginisialisasi database:", error);
    process.exit(1);
  });

