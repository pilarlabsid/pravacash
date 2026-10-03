import React, { useState } from 'react';
import { DEFAULT_DATA_TIMEZONE, formatCurrency, formatDate } from '../../lib/format';
import { LoadingSpinner, LoadingOverlay, StatCard, Badge } from '../common/UIComponents';
import { UserFinancialCharts } from '../dashboard/UserFinancialCharts';

const UserTransactionDetail = ({ userGroup, onBack }) => {
  const income = Number(userGroup.total_income) || 0;
  const expense = Number(userGroup.total_expense) || 0;
  const totals = { income, expense, balance: income - expense };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Detail Transaksi Pengguna</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{userGroup.user_name}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{userGroup.user_email}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95"
        >
          ← Kembali ke daftar
        </button>
      </div>

      <UserFinancialCharts entries={userGroup.transactions} totals={totals} />

      <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <p className="text-xs sm:text-sm font-bold text-slate-700">{userGroup.transactions.length} transaksi</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Jenis</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {[...userGroup.transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">{transaction.description}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{transaction.category || 'Lainnya'}</p>
                    </td>
                    <td className="px-4 py-3"><Badge label={transaction.type} variant={transaction.type} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">{formatCurrency(transaction.amount)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Transaction List */}
        <div className="md:hidden divide-y divide-slate-100 p-2 space-y-2">
          {[...userGroup.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
              <div key={transaction.id} className="p-3 bg-slate-50/70 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{transaction.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(transaction.date)} • {transaction.category || 'Lainnya'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <Badge label={transaction.type} variant={transaction.type} size="sm" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const AdminSection = ({
  user,
  adminTab,
  setAdminTab,
  adminLoading,
  adminError,
  adminStats,
  adminUsers = [],
  adminTransactions = [],
  onAddUserClick,
  onEditUserClick,
  onDeleteUserClick,
  settings = {},
}) => {
  const [selectedTransactionUser, setSelectedTransactionUser] = useState(null);

  return (
    <>
      {/* Admin Page - Auto show if user is admin */}
      {String(user?.role || '').toLowerCase() === 'admin' && (
        <div className="space-y-5">
          {/* Admin Tabs */}
          <div className="flex gap-1.5 rounded-2xl bg-white p-1.5 shadow-soft border border-slate-100">
            <button
              type="button"
              onClick={() => { setAdminTab("dashboard"); setSelectedTransactionUser(null); }}
              className={`min-w-0 flex-1 truncate rounded-xl px-2.5 py-2.5 text-xs sm:text-sm font-bold transition sm:px-4 sm:py-3 ${adminTab === "dashboard"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setAdminTab("users"); setSelectedTransactionUser(null); }}
              className={`min-w-0 flex-1 truncate rounded-xl px-2.5 py-2.5 text-xs sm:text-sm font-bold transition sm:px-4 sm:py-3 ${adminTab === "users"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              Users ({adminUsers.length})
            </button>
            <button
              type="button"
              onClick={() => { setAdminTab("transactions"); setSelectedTransactionUser(null); }}
              className={`min-w-0 flex-1 truncate rounded-xl px-2.5 py-2.5 text-xs sm:text-sm font-bold transition sm:px-4 sm:py-3 ${adminTab === "transactions"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              Transaksi ({adminTransactions.length})
            </button>
          </div>

              {/* Admin Dashboard Tab */}
              {adminTab === "dashboard" && (
                adminLoading && !adminStats ? (
                  <div className="py-20 text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Memuat dashboard...</p>
                  </div>
                ) : adminError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                    {adminError} Silakan muat ulang halaman atau login kembali.
                  </div>
                ) : adminStats ? (
                  <div className="space-y-6">
                    {/* Key Metrics - System & User Activity */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                      <StatCard
                        label="Total Users"
                        value={adminStats.totalUsers}
                        className="from-purple-500 via-purple-400 to-purple-500 text-white"
                      />
                      <StatCard
                        label="Active Users (7d)"
                        value={adminStats.activeUsers || 0}
                        className="from-emerald-500 via-emerald-400 to-emerald-500 text-white"
                      />
                      <StatCard
                        label="Inactive Users (30d)"
                        value={adminStats.inactiveUsers || 0}
                        className="from-amber-500 via-amber-400 to-amber-500 text-white"
                      />
                      <StatCard
                        label="Total Transactions"
                        value={adminStats.totalTransactions}
                        className="from-teal-600 via-teal-500 to-emerald-600 text-white"
                      />
                    </div>

                    {/* Transaction Volume Metrics */}
                    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-soft sm:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Transaction Volume</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Income Transactions</span>
                            <span className="font-semibold text-slate-900">
                              {adminStats.transactionsByType?.find(t => t.type === 'income')?.count || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Expense Transactions</span>
                            <span className="font-semibold text-slate-900">
                              {adminStats.transactionsByType?.find(t => t.type === 'expense')?.count || 0}
                            </span>
                          </div>
                          <div className="mt-3 flex justify-between border-t border-slate-200 pt-2 text-sm font-semibold">
                            <span className="text-slate-900">Avg Transaction Value</span>
                            <span className="text-emerald-600 font-bold">
                              {formatCurrency(Math.round(adminStats.avgTransactionValue || 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">User Engagement</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Active Rate</span>
                            <span className="font-semibold text-slate-900">
                              {adminStats.totalUsers > 0
                                ? Math.round((adminStats.activeUsers / adminStats.totalUsers) * 100)
                                : 0}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Avg Transactions/User</span>
                            <span className="font-semibold text-slate-900">
                              {adminStats.totalUsers > 0
                                ? Math.round(adminStats.totalTransactions / adminStats.totalUsers)
                                : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Overview - Not in Cards */}
                    <div className="rounded-2xl bg-white p-6 shadow-soft">
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Financial Overview</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-sm text-slate-600">Total Income</p>
                          <p className="mt-1 text-xl font-semibold text-emerald-600">
                            {formatCurrency(adminStats.totalIncome || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Total Expense</p>
                          <p className="mt-1 text-xl font-semibold text-rose-600">
                            {formatCurrency(adminStats.totalExpense || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Total Balance</p>
                          <p className={`mt-1 text-xl font-semibold ${(adminStats.totalBalance || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                            {formatCurrency(adminStats.totalBalance || 0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Min/Max Statistics */}
                    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-soft sm:grid-cols-3">
                      {/* Income Min/Max */}
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Pemasukan</h3>
                        <div className="space-y-3">
                          {adminStats.maxIncome && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                              <p className="text-xs text-emerald-700">
                                Tertinggi {adminStats.maxIncome.count > 1 && `(${adminStats.maxIncome.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-emerald-900">
                                {formatCurrency(adminStats.maxIncome.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.maxIncome.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-emerald-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {adminStats.minIncome && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <p className="text-xs text-slate-700">
                                Terendah {adminStats.minIncome.count > 1 && `(${adminStats.minIncome.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {formatCurrency(adminStats.minIncome.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.minIncome.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-slate-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expense Min/Max */}
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Pengeluaran</h3>
                        <div className="space-y-3">
                          {adminStats.maxExpense && (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                              <p className="text-xs text-rose-700">
                                Tertinggi {adminStats.maxExpense.count > 1 && `(${adminStats.maxExpense.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-rose-900">
                                {formatCurrency(adminStats.maxExpense.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.maxExpense.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-rose-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {adminStats.minExpense && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                              <p className="text-xs text-slate-700">
                                Terendah {adminStats.minExpense.count > 1 && `(${adminStats.minExpense.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {formatCurrency(adminStats.minExpense.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.minExpense.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-slate-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Balance Min/Max */}
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Saldo</h3>
                        <div className="space-y-3">
                          {adminStats.maxBalance && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                              <p className="text-xs text-emerald-700">
                                Tertinggi {adminStats.maxBalance.count > 1 && `(${adminStats.maxBalance.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-emerald-900">
                                {formatCurrency(adminStats.maxBalance.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.maxBalance.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-emerald-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {adminStats.minBalance && (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                              <p className="text-xs text-rose-700">
                                Terendah {adminStats.minBalance.count > 1 && `(${adminStats.minBalance.count} user)`}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-rose-900">
                                {formatCurrency(adminStats.minBalance.amount)}
                              </p>
                              <div className="mt-2 space-y-1">
                                {adminStats.minBalance.users.map((u, idx) => (
                                  <p key={idx} className="text-xs text-rose-600">
                                    {u.name}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Growth Metrics */}
                    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-soft sm:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">New Users</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Today</span>
                            <span className="font-semibold text-slate-900">{adminStats.newUsers?.today || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">This Week</span>
                            <span className="font-semibold text-slate-900">{adminStats.newUsers?.thisWeek || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">This Month</span>
                            <span className="font-semibold text-slate-900">{adminStats.newUsers?.thisMonth || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">New Transactions</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Today</span>
                            <span className="font-semibold text-slate-900">{adminStats.newTransactions?.today || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">This Week</span>
                            <span className="font-semibold text-slate-900">{adminStats.newTransactions?.thisWeek || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">This Month</span>
                            <span className="font-semibold text-slate-900">{adminStats.newTransactions?.thisMonth || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null)}

              {/* Admin Users Tab */}
              {adminTab === "users" && (
                <div className="relative rounded-2xl bg-white shadow-soft">
                  {/* Header with Add User button */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-700">Total: {adminUsers.length} user</p>
                    <button
                      id="btn-add-user"
                      onClick={onAddUserClick}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-indigo-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Tambah User
                    </button>
                  </div>
                  {adminLoading && adminUsers.length === 0 && (
                    <LoadingOverlay message="Memuat data users..." />
                  )}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Transactions
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Last Login
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Created
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {adminUsers.map((u) => (
                              <tr key={u.id} className="transition-colors hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{u.name}</td>
                                <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {u.role || 'user'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600">{u.transaction_count || 0}</td>
                                <td className="px-4 py-3 text-sm text-slate-500">
                                  {u.last_login_at ? formatDate(u.last_login_at) : 'Never'}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-500">
                                  {new Date(u.created_at).toLocaleDateString('id-ID', { timeZone: DEFAULT_DATA_TIMEZONE })}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex justify-center gap-2">
                                    <button onClick={() => onEditUserClick(u)} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100">Edit</button>
                                    {u.id !== user.id && (
                                      <button onClick={() => onDeleteUserClick(u.id)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100">Delete</button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Admin Transactions Tab - Grouped by User */}
              {adminTab === "transactions" && (
                <div className="relative space-y-4">
                  {adminLoading && adminTransactions.length === 0 && (
                    <LoadingOverlay message="Memuat data transaksi..." />
                  )}
                  {(() => {
                    // Group transactions by user
                    const transactionsByUser = adminTransactions.reduce((acc, transaction) => {
                      const userId = transaction.user_id;
                      if (!acc[userId]) {
                        acc[userId] = {
                          user_id: userId,
                          user_name: transaction.user_name,
                          user_email: transaction.user_email,
                          transactions: [],
                          total_income: 0,
                          total_expense: 0,
                        };
                      }
                      acc[userId].transactions.push(transaction);
                      if (transaction.type === 'income') {
                        acc[userId].total_income += transaction.amount;
                      } else {
                        acc[userId].total_expense += transaction.amount;
                      }
                      return acc;
                    }, {});

                    const userGroups = Object.values(transactionsByUser).sort((a, b) =>
                      b.transactions.length - a.transactions.length
                    );

                    if (selectedTransactionUser) {
                      return (
                        <UserTransactionDetail
                          userGroup={selectedTransactionUser}
                          onBack={() => setSelectedTransactionUser(null)}
                        />
                      );
                    }

                    return userGroups.map((userGroup) => {
                      const income = Number(userGroup.total_income) || 0;
                      const expense = Number(userGroup.total_expense) || 0;
                      const balance = income - expense;

                      return (
                        <div key={userGroup.user_id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-slate-900">{userGroup.user_name}</h3>
                            <p className="truncate text-sm text-slate-500">{userGroup.user_email}</p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                              <span><span className="font-semibold">{userGroup.transactions.length}</span> transaksi</span>
                              <span>Pemasukan: <span className="font-semibold text-emerald-600">{formatCurrency(income)}</span></span>
                              <span>Pengeluaran: <span className="font-semibold text-rose-600">{formatCurrency(expense)}</span></span>
                              <span>Saldo: <span className={`font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(balance)}</span></span>
                            </div>
                          </div>
                          <button type="button" onClick={() => setSelectedTransactionUser(userGroup)} className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                            Detail
                          </button>
                        </div>
                      );
                    });
                  })()}

                  {adminTransactions.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
                      <p className="text-base font-semibold text-slate-800">
                        Belum ada transaksi
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Transaksi akan muncul di sini setelah user membuat transaksi.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
    </>  );
};

export default AdminSection;
