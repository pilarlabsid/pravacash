require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const MAX_DB_CONNECT_ATTEMPTS = 5;

const isTransientConnectionError = (error) => {
  return error.errorCode === "P1001" || error.errorCode === "P1002" ||
    /Can't reach database server|Timed out fetching a new connection|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN/i.test(error.message);
};

async function initDb() {
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);

  for (let attempt = 1; attempt <= MAX_DB_CONNECT_ATTEMPTS; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Connected to PostgreSQL database via Prisma");
      return;
    } catch (error) {
      const shouldRetry = attempt < MAX_DB_CONNECT_ATTEMPTS && isTransientConnectionError(error);
      if (!shouldRetry) {
        console.error("❌ Tidak bisa connect ke PostgreSQL!");
        console.error("Database initialization error:", error.message);
        throw error;
      }

      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 8000);
      console.warn(`Koneksi database gagal (${attempt}/${MAX_DB_CONNECT_ATTEMPTS}); mencoba lagi dalam ${delayMs / 1000} detik.`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

// User management functions
async function createUser({ email, passwordHash, name }) {
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      name: name.trim(),
    },
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
    }
  });
  return user;
}

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      email: true,
      password_hash: true,
      name: true,
      role: true,
      last_login_at: true,
      is_active: true,
      login_count: true,
      timezone: true,
      created_at: true,
    }
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      pin: true,
      pin_enabled: true,
      role: true,
      last_login_at: true,
      is_active: true,
      login_count: true,
      timezone: true,
      created_at: true,
    }
  });
}

async function updateLastLogin(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      last_login_at: new Date(),
      login_count: { increment: 1 },
      updated_at: new Date(),
    }
  });
}

async function getUserSettings(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      pin_enabled: true,
      timezone: true,
      created_at: true,
    }
  });
}

async function updateUserProfile({ id, name, email, timezone }) {
  const data = { updated_at: new Date() };

  if (name !== undefined) data.name = name.trim();
  if (timezone !== undefined) data.timezone = timezone;
  if (email !== undefined) {
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.id !== id) {
      throw new Error("Email sudah digunakan oleh user lain.");
    }
    data.email = email.toLowerCase().trim();
  }

  if (Object.keys(data).length === 1) return null; // only updated_at

  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      pin_enabled: true,
      timezone: true,
      created_at: true,
    }
  });
}

async function updateUserPin({ id, pin, pinEnabled }) {
  const data = { updated_at: new Date() };

  if (pin !== undefined) {
    if (pin && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      throw new Error("PIN harus berupa 4 digit angka.");
    }
    data.pin = pin || null;
  }
  if (pinEnabled !== undefined) {
    data.pin_enabled = pinEnabled;
  }

  if (Object.keys(data).length === 1) return null;

  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      pin: true,
      pin_enabled: true,
      created_at: true,
    }
  });
}

async function verifyUserPin(userId, pin) {
  const user = await getUserById(userId);
  if (!user || !user.pin_enabled || !user.pin) {
    return false;
  }
  return user.pin === pin;
}

// Transaction functions
async function listTransactions(userId) {
  const txs = await prisma.transaction.findMany({
    where: { user_id: userId },
    orderBy: [
      { date: 'asc' },
      { created_at: 'asc' }
    ],
    select: {
      id: true,
      description: true,
      category: true,
      type: true,
      amount: true,
      date: true,
      proof_url: true,
      created_at: true,
    }
  });

  return txs.map(t => ({
    ...t,
    createdAt: t.created_at
  }));
}

async function createTransaction({ userId, description, category, type, amount, date, proof_url }) {
  const tx = await prisma.transaction.create({
    data: {
      user_id: userId,
      description: description.trim(),
      category: category ? category.trim() : null,
      type,
      amount: Math.round(amount),
      date: new Date(date),
      proof_url: proof_url ? proof_url.trim() : null,
    }
  });
  return tx.id;
}

async function updateTransaction({ id, userId, description, category, type, amount, date, proof_url }) {
  try {
    const tx = await getTransactionById(id, userId);
    if (!tx) return false;

    await prisma.transaction.update({
      where: { id },
      data: {
        description: description.trim(),
        category: category ? category.trim() : null,
        type,
        amount: Math.round(amount),
        date: new Date(date),
        proof_url: proof_url ? proof_url.trim() : null,
        updated_at: new Date(),
      }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

async function deleteTransaction(id, userId) {
  try {
    // verify ownership first
    const tx = await getTransactionById(id, userId);
    if (!tx) return false;
    
    await prisma.transaction.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

async function deleteAllTransactions(userId) {
  await prisma.transaction.deleteMany({
    where: { user_id: userId }
  });
}

async function getTransactionById(id, userId) {
  const tx = await prisma.transaction.findUnique({
    where: { id }
  });
  if (tx && tx.user_id === userId) {
    return tx;
  }
  return null;
}

// Admin functions
async function getAllUsers() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      transactions: {
        select: { type: true, amount: true }
      }
    }
  });

  return users.map(u => {
    const total_income = u.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const total_expense = u.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      pin_enabled: u.pin_enabled,
      last_login_at: u.last_login_at,
      is_active: u.is_active,
      login_count: u.login_count,
      created_at: u.created_at,
      transaction_count: u.transactions.length,
      total_income,
      total_expense
    };
  });
}

async function getAllTransactions() {
  const txs = await prisma.transaction.findMany({
    orderBy: { created_at: 'desc' },
    include: { user: { select: { name: true, email: true } } }
  });

  return txs.map(t => ({
    ...t,
    user_name: t.user?.name,
    user_email: t.user?.email,
  }));
}

async function getAdminStats() {
  const totalUsers = await prisma.user.count();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  const activeUsers = await prisma.user.count({
    where: {
      OR: [
        { last_login_at: { gte: sevenDaysAgo } },
        { last_login_at: null } // treating null as active as in original sql
      ]
    }
  });

  const inactiveUsers = await prisma.user.count({
    where: {
      OR: [
        { last_login_at: { lt: thirtyDaysAgo } },
        { last_login_at: null }
      ],
      created_at: { lt: thirtyDaysAgo }
    }
  });

  const newUsersToday = await prisma.user.count({ where: { created_at: { gte: startOfDay } } });
  const newUsersThisWeek = await prisma.user.count({ where: { created_at: { gte: sevenDaysAgo } } });
  const newUsersThisMonth = await prisma.user.count({ where: { created_at: { gte: startOfMonth } } });

  const totalTransactions = await prisma.transaction.count();
  const newTransToday = await prisma.transaction.count({ where: { created_at: { gte: startOfDay } } });
  const newTransThisWeek = await prisma.transaction.count({ where: { created_at: { gte: sevenDaysAgo } } });
  const newTransThisMonth = await prisma.transaction.count({ where: { created_at: { gte: startOfMonth } } });

  const transactions = await prisma.transaction.findMany({
    select: { type: true, amount: true, user: { select: { id: true, name: true, email: true } } }
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  const userStats = {};

  for (const t of transactions) {
    if (t.type === 'income') {
      totalIncome += t.amount;
      incomeCount++;
    } else {
      totalExpense += t.amount;
      expenseCount++;
    }

    if (!userStats[t.user.id]) {
      userStats[t.user.id] = { name: t.user.name, email: t.user.email, total_income: 0, total_expense: 0, balance: 0 };
    }
    
    if (t.type === 'income') {
      userStats[t.user.id].total_income += t.amount;
      userStats[t.user.id].balance += t.amount;
    } else {
      userStats[t.user.id].total_expense += t.amount;
      userStats[t.user.id].balance -= t.amount;
    }
  }

  const avgTransactionValue = totalTransactions > 0 ? (totalIncome + totalExpense) / totalTransactions : 0;
  const transactionsByType = [
    { type: 'income', count: incomeCount },
    { type: 'expense', count: expenseCount }
  ];

  const statsArray = Object.values(userStats);

  const findMaxUsers = (stats, field) => {
    if (stats.length === 0) return [];
    const maxValue = Math.max(...stats.map(u => u[field]));
    return stats.filter(u => u[field] === maxValue);
  };
  const findMinUsers = (stats, field) => {
    if (stats.length === 0) return [];
    const minValue = Math.min(...stats.map(u => u[field]));
    return stats.filter(u => u[field] === minValue);
  };

  const formatUserList = (users, field) => {
    if (users.length === 0) return null;
    return {
      amount: users[0][field],
      users: users.map(u => ({ name: u.name, email: u.email })),
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
    transactionsByType,
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
    maxIncome: formatUserList(findMaxUsers(statsArray, 'total_income'), 'total_income'),
    minIncome: formatUserList(findMinUsers(statsArray, 'total_income'), 'total_income'),
    maxExpense: formatUserList(findMaxUsers(statsArray, 'total_expense'), 'total_expense'),
    minExpense: formatUserList(findMinUsers(statsArray, 'total_expense'), 'total_expense'),
    maxBalance: formatUserList(findMaxUsers(statsArray, 'balance'), 'balance'),
    minBalance: formatUserList(findMinUsers(statsArray, 'balance'), 'balance'),
  };
}

async function updateUserRole(userId, role) {
  if (!['user', 'admin'].includes(role)) {
    throw new Error("Role harus 'user' atau 'admin'");
  }
  
  return await prisma.user.update({
    where: { id: userId },
    data: { role, updated_at: new Date() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    }
  });
}

async function deleteUser(userId) {
  return await prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    }
  });
}

module.exports = {
  prisma, // Exported prisma instead of pool, though most codebase calls these wrapper functions
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
