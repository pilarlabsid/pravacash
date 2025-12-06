const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const initSqlJs = require("sql.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "cashflow.db");

let db;
let initPromise;

async function initDb() {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const SQL = await initSqlJs({
      locateFile: (file) =>
        path.join(__dirname, "..", "node_modules", "sql.js", "dist", file),
    });

    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(new Uint8Array(fileBuffer));
    } else {
      db = new SQL.Database();
      createSchema();
      persist();
    }

    return db;
  })();

  return initPromise;
}

async function listTransactions() {
  const database = await ensureDb();
  const statement = database.prepare(
    `
      SELECT id, description, type, amount, date, created_at as createdAt
      FROM transactions
      ORDER BY date ASC, created_at ASC
    `
  );
  const rows = [];
  while (statement.step()) {
    rows.push(statement.getAsObject());
  }
  statement.free();
  return rows.map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));
}

async function createTransaction({ description, type, amount, date }) {
  const database = await ensureDb();
  const id = crypto.randomUUID();
  const statement = database.prepare(
    `
      INSERT INTO transactions (id, description, type, amount, date)
      VALUES (?, ?, ?, ?, ?)
    `
  );
  statement.run([id, description, type, amount, date]);
  statement.free();
  persist();
  return id;
}

async function updateTransaction({ id, description, type, amount, date }) {
  const database = await ensureDb();
  const statement = database.prepare(
    `
      UPDATE transactions
      SET description = ?, type = ?, amount = ?, date = ?
      WHERE id = ?
    `
  );
  statement.run([description, type, amount, date, id]);
  const affected = database.getRowsModified();
  statement.free();
  if (affected) {
    persist();
  }
  return affected > 0;
}

async function deleteTransaction(id) {
  const database = await ensureDb();
  const statement = database.prepare(
    `DELETE FROM transactions WHERE id = ?`
  );
  statement.run([id]);
  const affected = database.getRowsModified();
  statement.free();
  if (affected) {
    persist();
  }
  return affected > 0;
}

async function deleteAllTransactions() {
  const database = await ensureDb();
  database.run(`DELETE FROM transactions`);
  persist();
}

function createSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      amount INTEGER NOT NULL CHECK (amount >= 0),
      date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function ensureDb() {
  if (db) return db;
  return initDb();
}

function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = {
  initDb,
  listTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  deleteAllTransactions,
};
