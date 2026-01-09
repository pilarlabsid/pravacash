// Load environment variables first
require("dotenv").config();

const Database = require("better-sqlite3");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Database file path - store in ./data directory
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "prava-cash.db");

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log("✅ Created data directory:", dataDir);
}

// Create SQLite database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

console.log("\n📊 Database Configuration:");
console.log(`   Database: SQLite`);
console.log(`   File: ${dbPath}`);
console.log(`   Journal Mode: WAL`);
console.log("");

async function initDb() {
    try {
        console.log("✅ Connected to SQLite database");

        // Create tables if not exist
        createSchema();
        console.log("Database schema initialized");
    } catch (error) {
        console.error("❌ Database initialization error:", error.message);
        throw error;
    }
}

function createSchema() {
    // Create users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      pin TEXT DEFAULT NULL,
      pin_enabled INTEGER DEFAULT 0,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      last_login_at TEXT DEFAULT NULL,
      is_active INTEGER DEFAULT 1,
      login_count INTEGER DEFAULT 0,
      timezone TEXT DEFAULT 'Asia/Jakarta',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

    // Create transactions table with user_id foreign key
    db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income','expense')),
      amount INTEGER NOT NULL CHECK (amount >= 0),
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

    // Create indexes for better performance
    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}

// Helper function to generate UUID
function generateUUID() {
    return crypto.randomUUID();
}

// User management functions
function createUser({ email, passwordHash, name }) {
    const id = generateUUID();
    const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name) 
    VALUES (?, ?, ?, ?)
  `);

    stmt.run(id, email.toLowerCase().trim(), passwordHash, name.trim());

    const user = db.prepare("SELECT id, email, name, created_at FROM users WHERE id = ?").get(id);
    return user;
}

function getUserByEmail(email) {
    const stmt = db.prepare(`
    SELECT id, email, password_hash, name, role, last_login_at, is_active, login_count, timezone, created_at 
    FROM users 
    WHERE email = ?
  `);
    return stmt.get(email.toLowerCase().trim()) || null;
}

function getUserById(id) {
    const stmt = db.prepare(`
    SELECT id, email, name, pin, pin_enabled, role, last_login_at, is_active, login_count, timezone, created_at 
    FROM users 
    WHERE id = ?
  `);
    const user = stmt.get(id);
    if (user) {
        user.pin_enabled = Boolean(user.pin_enabled);
        user.is_active = Boolean(user.is_active);
    }
    return user || null;
}

// Update last login timestamp
function updateLastLogin(userId) {
    const stmt = db.prepare(`
    UPDATE users 
    SET last_login_at = datetime('now'), 
        login_count = COALESCE(login_count, 0) + 1,
        updated_at = datetime('now')
    WHERE id = ?
  `);
    stmt.run(userId);
}

// Get user settings (without sensitive data)
function getUserSettings(id) {
    const stmt = db.prepare(`
    SELECT id, email, name, pin_enabled, timezone, created_at 
    FROM users 
    WHERE id = ?
  `);
    const user = stmt.get(id);
    if (user) {
        user.pin_enabled = Boolean(user.pin_enabled);
    }
    return user || null;
}

// Update user profile
function updateUserProfile({ id, name, email, timezone }) {
    const updates = [];
    const values = [];

    if (name !== undefined) {
        updates.push("name = ?");
        values.push(name.trim());
    }

    if (email !== undefined) {
        // Check if email already exists for another user
        const existingUser = getUserByEmail(email);
        if (existingUser && existingUser.id !== id) {
            throw new Error("Email sudah digunakan oleh user lain.");
        }
        updates.push("email = ?");
        values.push(email.toLowerCase().trim());
    }

    if (timezone !== undefined) {
        updates.push("timezone = ?");
        values.push(timezone);
    }

    if (updates.length === 0) {
        return null;
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`
    UPDATE users 
    SET ${updates.join(", ")}
    WHERE id = ?
  `);

    stmt.run(...values);

    const user = db.prepare("SELECT id, email, name, pin_enabled, timezone, created_at FROM users WHERE id = ?").get(id);
    if (user) {
        user.pin_enabled = Boolean(user.pin_enabled);
    }
    return user || null;
}

// Update user PIN
function updateUserPin({ id, pin, pinEnabled }) {
    const updates = [];
    const values = [];

    if (pin !== undefined) {
        if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
            throw new Error("PIN harus berupa 4 digit angka.");
        }
        updates.push("pin = ?");
        values.push(pin || null);
    }

    if (pinEnabled !== undefined) {
        updates.push("pin_enabled = ?");
        values.push(pinEnabled ? 1 : 0);
    }

    if (updates.length === 0) {
        return null;
    }

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const stmt = db.prepare(`
    UPDATE users 
    SET ${updates.join(", ")}
    WHERE id = ?
  `);

    stmt.run(...values);

    const user = db.prepare("SELECT id, email, name, pin, pin_enabled, created_at FROM users WHERE id = ?").get(id);
    if (user) {
        user.pin_enabled = Boolean(user.pin_enabled);
    }
    return user || null;
}

// Verify user PIN
function verifyUserPin(userId, pin) {
    const user = getUserById(userId);
    if (!user || !user.pin_enabled || !user.pin) {
        return false;
    }
    return user.pin === pin;
}

// Transaction functions (user-specific)
function listTransactions(userId) {
    const stmt = db.prepare(`
    SELECT id, description, type, amount, date, created_at as createdAt
    FROM transactions
    WHERE user_id = ?
    ORDER BY date ASC, created_at ASC
  `);

    return stmt.all(userId).map((row) => ({
        ...row,
        amount: Number(row.amount),
    }));
}

function createTransaction({ userId, description, type, amount, date }) {
    const id = generateUUID();
    const stmt = db.prepare(`
    INSERT INTO transactions (id, user_id, description, type, amount, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    stmt.run(id, userId, description.trim(), type, Math.round(amount), date);
    return id;
}

function updateTransaction({ id, userId, description, type, amount, date }) {
    const stmt = db.prepare(`
    UPDATE transactions
    SET description = ?, type = ?, amount = ?, date = ?, updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `);

    const result = stmt.run(description.trim(), type, Math.round(amount), date, id, userId);
    return result.changes > 0;
}

function deleteTransaction(id, userId) {
    const stmt = db.prepare(`
    DELETE FROM transactions 
    WHERE id = ? AND user_id = ?
  `);

    const result = stmt.run(id, userId);
    return result.changes > 0;
}

function deleteAllTransactions(userId) {
    const stmt = db.prepare("DELETE FROM transactions WHERE user_id = ?");
    stmt.run(userId);
}

// Get transaction by ID (for ownership verification)
function getTransactionById(id, userId) {
    const stmt = db.prepare(`
    SELECT id, user_id, description, type, amount, date
    FROM transactions
    WHERE id = ? AND user_id = ?
  `);

    return stmt.get(id, userId) || null;
}

// Admin functions
function getAllUsers() {
    const stmt = db.prepare(`
    SELECT 
      u.id, 
      u.email, 
      u.name, 
      u.role, 
      u.pin_enabled, 
      u.last_login_at, 
      u.is_active, 
      u.login_count, 
      u.created_at,
      (SELECT COUNT(*) FROM transactions WHERE user_id = u.id) as transaction_count,
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = u.id AND type = 'income') as total_income,
      (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = u.id AND type = 'expense') as total_expense
    FROM users u
    ORDER BY u.created_at DESC
  `);

    return stmt.all().map(user => ({
        ...user,
        pin_enabled: Boolean(user.pin_enabled),
        is_active: Boolean(user.is_active),
    }));
}

function getAllTransactions() {
    const stmt = db.prepare(`
    SELECT t.id, t.user_id, t.description, t.type, t.amount, t.date, t.created_at,
    u.name as user_name, u.email as user_email
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
  `);

    return stmt.all();
}

function getAdminStats() {
    // Total users
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;

    // Active users (login dalam 7 hari terakhir)
    const activeUsers = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE last_login_at >= datetime('now', '-7 days') OR last_login_at IS NULL
  `).get().count;

    // New users (hari ini, minggu ini, bulan ini)
    const newUsersToday = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE date(created_at) = date('now')
  `).get().count;

    const newUsersThisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE created_at >= datetime('now', '-7 days')
  `).get().count;

    const newUsersThisMonth = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE created_at >= datetime('now', 'start of month')
  `).get().count;

    // Total transactions
    const totalTransactions = db.prepare("SELECT COUNT(*) as count FROM transactions").get().count;

    // New transactions (hari ini, minggu ini, bulan ini)
    const newTransToday = db.prepare(`
    SELECT COUNT(*) as count FROM transactions 
    WHERE date(created_at) = date('now')
  `).get().count;

    const newTransThisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM transactions 
    WHERE created_at >= datetime('now', '-7 days')
  `).get().count;

    const newTransThisMonth = db.prepare(`
    SELECT COUNT(*) as count FROM transactions 
    WHERE created_at >= datetime('now', 'start of month')
  `).get().count;

    // Transactions by type (count only, not amount)
    const typeResult = db.prepare(`
    SELECT type, COUNT(*) as count
    FROM transactions
    GROUP BY type
  `).all();

    // Average transaction value
    const avgTransResult = db.prepare(`
    SELECT COALESCE(AVG(amount), 0) as avg FROM transactions
  `).get();
    const avgTransactionValue = parseFloat(avgTransResult.avg) || 0;

    // Inactive users (tidak login dalam 30 hari)
    const inactiveUsers = db.prepare(`
    SELECT COUNT(*) as count FROM users 
    WHERE (last_login_at < datetime('now', '-30 days') OR last_login_at IS NULL)
    AND created_at < datetime('now', '-30 days')
  `).get().count;

    // Total income and expense
    const totalIncome = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'
  `).get().total;

    const totalExpense = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'
  `).get().total;

    // Min/Max per user untuk income, expense, dan balance
    const userStats = db.prepare(`
    SELECT 
      u.id,
      u.name,
      u.email,
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense,
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as balance
    FROM users u
    LEFT JOIN transactions t ON u.id = t.user_id
    GROUP BY u.id, u.name, u.email
    HAVING COUNT(t.id) > 0
  `).all();

    // Find min/max - handle multiple users with same value
    const findMaxUsers = (stats, field) => {
        if (stats.length === 0) return [];
        const maxValue = Math.max(...stats.map(u => parseInt(u[field])));
        return stats.filter(u => parseInt(u[field]) === maxValue);
    };

    const findMinUsers = (stats, field) => {
        if (stats.length === 0) return [];
        const minValue = Math.min(...stats.map(u => parseInt(u[field])));
        return stats.filter(u => parseInt(u[field]) === minValue);
    };

    const maxIncomeUsers = findMaxUsers(userStats, 'total_income');
    const minIncomeUsers = findMinUsers(userStats, 'total_income');
    const maxExpenseUsers = findMaxUsers(userStats, 'total_expense');
    const minExpenseUsers = findMinUsers(userStats, 'total_expense');
    const maxBalanceUsers = findMaxUsers(userStats, 'balance');
    const minBalanceUsers = findMinUsers(userStats, 'balance');

    // Format untuk response
    const formatUserList = (users, field) => {
        if (users.length === 0) return null;
        const amount = parseInt(users[0][field]);
        return {
            amount,
            users: users.map(u => ({
                name: u.name,
                email: u.email
            })),
            count: users.length
        };
    };

    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newUsers: {
            today: newUsersToday,
            thisWeek: newUsersThisWeek,
            thisMonth: newUsersThisMonth,
        },
        totalTransactions,
        newTransactions: {
            today: newTransToday,
            thisWeek: newTransThisWeek,
            thisMonth: newTransThisMonth,
        },
        avgTransactionValue,
        transactionsByType: typeResult,
        totalIncome,
        totalExpense,
        totalBalance: totalIncome - totalExpense,
        maxIncome: formatUserList(maxIncomeUsers, 'total_income'),
        minIncome: formatUserList(minIncomeUsers, 'total_income'),
        maxExpense: formatUserList(maxExpenseUsers, 'total_expense'),
        minExpense: formatUserList(minExpenseUsers, 'total_expense'),
        maxBalance: formatUserList(maxBalanceUsers, 'balance'),
        minBalance: formatUserList(minBalanceUsers, 'balance'),
    };
}

function updateUserRole(userId, role) {
    if (!['user', 'admin'].includes(role)) {
        throw new Error("Role harus 'user' atau 'admin'");
    }

    const stmt = db.prepare(`
    UPDATE users 
    SET role = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

    stmt.run(role, userId);

    return db.prepare("SELECT id, email, name, role, created_at FROM users WHERE id = ?").get(userId) || null;
}

function deleteUser(userId) {
    // Delete user (transactions will be deleted via CASCADE)
    const user = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(userId);

    if (!user) {
        return null;
    }

    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(userId);

    return user;
}

module.exports = {
    db,
    initDb,
    createUser,
    getUserByEmail,
    getUserById,
    getUserSettings,
    updateUserProfile,
    updateUserPin,
    verifyUserPin,
    listTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    getTransactionById,
    getAllUsers,
    getAllTransactions,
    getAdminStats,
    updateUserRole,
    deleteUser,
    updateLastLogin,
};
