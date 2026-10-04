import React, { useState } from 'react';
import { DEFAULT_DATA_TIMEZONE, formatCurrency, formatDate } from '../../lib/format';
import { LoadingSpinner, LoadingOverlay, StatCard, Badge } from '../common/UIComponents';
import { UserFinancialCharts } from '../dashboard/UserFinancialCharts';
import { SettingsModal } from '../modals/SettingsModal';

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

const AdminUserTable = ({ accounts, currentUserId, emptyLabel, onEditUserClick, onDeleteUserClick }) => (
  accounts.length === 0 ? (
    <p className="px-4 py-8 text-center text-sm text-slate-500">{emptyLabel}</p>
  ) : (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nama</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Transaksi</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Login Terakhir</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Dibuat</th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {accounts.map((account) => (
            <tr key={account.id} className="transition-colors hover:bg-slate-50">
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">{account.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{account.email}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{account.transaction_count || 0}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{account.last_login_at ? formatDate(account.last_login_at) : 'Belum pernah'}</td>
              <td className="px-4 py-3 text-sm text-slate-500">
                {new Date(account.created_at).toLocaleDateString('id-ID', { timeZone: DEFAULT_DATA_TIMEZONE })}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEditUserClick(account)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Edit</button>
                  {account.id !== currentUserId && (
                    <button onClick={() => onDeleteUserClick(account.id)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100">Hapus</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {accounts.map((account) => (
          <article key={account.id} className="space-y-3 p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">{account.name}</h3>
                <p className="mt-0.5 break-all text-xs text-slate-500">{account.email}</p>
              </div>
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {account.transaction_count || 0} transaksi
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Login terakhir</p>
                <p className="mt-0.5 font-medium text-slate-700">{account.last_login_at ? formatDate(account.last_login_at) : 'Belum pernah'}</p>
              </div>
              <div>
                <p className="text-slate-500">Dibuat</p>
                <p className="mt-0.5 font-medium text-slate-700">
                  {new Date(account.created_at).toLocaleDateString('id-ID', { timeZone: DEFAULT_DATA_TIMEZONE })}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => onEditUserClick(account)} className="min-h-9 rounded-lg bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">Edit</button>
              {account.id !== currentUserId && (
                <button onClick={() => onDeleteUserClick(account.id)} className="min-h-9 rounded-lg bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-100">Hapus</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
);

export const AdminSection = ({
  user,
  currentTime,
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
  isDarkMode,
  onToggleDarkMode,
  onLogoutClick,
  settings,
  settingsForm,
  setSettingsForm,
  settingsError,
  setSettingsError,
  settingsLoading,
  passwordForm,
  setPasswordForm,
  passwordError,
  handleUpdateProfile,
  handleUpdatePassword,
  handleUpdatePin,
}) => {
  const [selectedTransactionUser, setSelectedTransactionUser] = useState(null);
  const adminAccounts = adminUsers.filter((account) => String(account.role || '').toLowerCase() === 'admin');
  const userAccounts = adminUsers.filter((account) => String(account.role || '').toLowerCase() !== 'admin');
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'admins', label: 'Admin', count: adminAccounts.length, icon: 'users' },
    { id: 'users', label: 'Pengguna', count: userAccounts.length, icon: 'users' },
    { id: 'transactions', label: 'Transaksi', count: adminTransactions.length, icon: 'transactions' },
    { id: 'settings', label: 'Pengaturan', icon: 'settings' },
  ];
  const pageTitle = selectedTransactionUser
    ? 'Detail Transaksi'
    : navigation.find((item) => item.id === adminTab)?.label || 'Dashboard';
  const sidebarSurface = isDarkMode
    ? 'border-r border-white/10 bg-[#18232e] text-slate-100'
    : 'border-r border-slate-200 bg-white text-slate-800';
  const sidebarMutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const sidebarInactiveItem = isDarkMode
    ? 'text-slate-300 hover:bg-white/5 hover:text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const sidebarCount = isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600';
  const sidebarProfile = isDarkMode ? 'bg-white/5' : 'bg-slate-50';
  const sidebarAvatar = isDarkMode ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-800';
  const sidebarLogout = isDarkMode
    ? 'text-slate-300 hover:bg-rose-500/15 hover:text-rose-200'
    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700';

  if (String(user?.role || '').toLowerCase() !== 'admin') return null;

  return (
    <div className="admin-page flex h-screen min-h-0 flex-col overflow-hidden lg:flex-row">
      <aside className={`flex shrink-0 flex-col ${sidebarSurface} lg:h-screen lg:w-64`}>
        <div className="flex items-center gap-2.5 px-3 py-3 lg:gap-3 lg:px-6 lg:py-7">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 shrink-0 drop-shadow-sm lg:h-10 lg:w-10" aria-hidden="true">
            <rect width="48" height="48" rx="14" fill="#047857" />
            <rect x="10" y="24" width="7" height="15" rx="3.5" fill="#a7f3d0" />
            <rect x="20" y="16" width="7" height="23" rx="3.5" fill="#34d399" />
            <rect x="30" y="9" width="7" height="30" rx="3.5" fill="#ffffff" />
          </svg>
          <div>
            <p className="text-base font-extrabold">Prava Cash</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Admin Console</p>
          </div>
        </div>

        <nav aria-label="Navigasi admin" className={`fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1.5 rounded-full border p-1.5 shadow-xl backdrop-blur-md ${isDarkMode ? 'border-white/10 bg-[#18232e]/95' : 'border-slate-200 bg-white/95'} lg:static lg:flex lg:flex-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-5 lg:shadow-none lg:backdrop-blur-none`}>
          <p className={`hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-widest lg:block ${isDarkMode ? 'text-emerald-300/70' : 'text-emerald-700/70'}`}>Menu</p>
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setAdminTab(item.id); setSelectedTransactionUser(null); }}
              aria-label={item.label}
              aria-current={adminTab === item.id ? 'page' : undefined}
              title={item.label}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-[10px] font-semibold leading-tight transition-[color,box-shadow] sm:text-xs lg:min-h-11 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:rounded-lg lg:px-3 lg:py-0 lg:text-left lg:text-sm ${adminTab === item.id
                ? `${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'} lg:bg-emerald-600 lg:text-white`
                : sidebarInactiveItem
                }`}
            >
              <span className={`flex shrink-0 items-center justify-center rounded-full lg:h-auto lg:w-auto lg:rounded-none ${adminTab === item.id ? 'h-11 w-11 bg-emerald-600 text-white lg:bg-transparent' : 'h-9 w-9'}`}>
                <svg className="h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {item.icon === 'dashboard' && <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="11" width="7" height="10" rx="1.5" /><rect x="3" y="14" width="8" height="7" rx="1.5" /></>}
                  {item.icon === 'users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>}
                  {item.icon === 'transactions' && <><path d="M4 7h16M4 12h16M4 17h10" /><circle cx="18" cy="17" r="3" /></>}
                  {item.icon === 'settings' && <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1A1.7 1.7 0 0 0 4.2 12H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2v-.3a1.7 1.7 0 0 1 3.4 0V2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.3a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 3.1Z" /></>}
                </svg>
              </span>
              <span className="sr-only lg:not-sr-only lg:max-w-full lg:truncate lg:whitespace-nowrap">{item.label}</span>
              {item.count !== undefined && <span className={`ml-auto hidden rounded-md px-2 py-0.5 text-xs lg:inline-flex ${adminTab === item.id ? 'bg-white/20 text-white' : sidebarCount}`}>{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className={`hidden border-t p-4 lg:block ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className={`flex min-w-0 items-center gap-3 rounded-lg p-3 ${sidebarProfile}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${sidebarAvatar}`}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className={`truncate text-xs ${sidebarMutedText}`}>Administrator</p>
            </div>
          </div>
          <button type="button" onClick={onLogoutClick} className={`mt-2 flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${sidebarLogout}`}>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
            Keluar
          </button>
        </div>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pb-20 lg:pb-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:gap-4 sm:px-7 sm:py-4 lg:px-9">
          <div>
            <p className="text-xs font-semibold text-slate-500">Panel administrasi</p>
            <h1 className="mt-0.5 text-xl font-bold text-slate-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="hidden text-right text-xs font-medium text-slate-500 sm:block">
              {currentTime?.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <button type="button" onClick={onToggleDarkMode} title={isDarkMode ? 'Mode terang' : 'Mode gelap'} aria-label={isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'} aria-pressed={isDarkMode} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-emerald-700">
              {isDarkMode ? <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg> : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></svg>}
            </button>
            <button type="button" onClick={onLogoutClick} title="Keluar" aria-label="Keluar" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 lg:hidden">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-7 sm:py-7 lg:px-9">
              {adminTab === 'settings' && (
                <SettingsModal
                  asPage
                  isOpen
                  settingsForm={settingsForm}
                  settingsError={settingsError}
                  settingsLoading={settingsLoading}
                  settings={settings}
                  setSettingsForm={setSettingsForm}
                  setSettingsError={setSettingsError}
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                  passwordError={passwordError}
                  handleUpdateProfile={handleUpdateProfile}
                  handleUpdatePassword={handleUpdatePassword}
                  handleUpdatePin={handleUpdatePin}
                />
              )}

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
                        className="admin-metric-total from-emerald-700 via-emerald-600 to-green-600 text-white"
                      />
                      <StatCard
                        label="Active Users (7d)"
                        value={adminStats.activeUsers || 0}
                        className="admin-metric-active from-green-600 via-emerald-500 to-emerald-400 text-white"
                      />
                      <StatCard
                        label="Inactive Users (30d)"
                        value={adminStats.inactiveUsers || 0}
                        className="admin-metric-inactive from-emerald-800 via-emerald-700 to-green-700 text-white"
                      />
                      <StatCard
                        label="Total Transactions"
                        value={adminStats.totalTransactions}
                        className="admin-metric-transactions from-teal-700 via-teal-600 to-emerald-600 text-white"
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

              {/* Admin Accounts Tab */}
              {adminTab === "admins" && (
                <div className="relative space-y-5">
                  {adminLoading && adminUsers.length === 0 ? (
                    <div className="py-20 text-center">
                      <LoadingSpinner size="lg" className="mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500">Memuat data akun...</p>
                    </div>
                  ) : (
                    <section className="overflow-hidden rounded-2xl bg-white shadow-soft">
                      <div className="border-b border-slate-100 px-4 py-3.5">
                        <h2 className="text-base font-bold text-slate-900">Akun Admin</h2>
                        <p className="mt-0.5 text-xs text-slate-500">{adminAccounts.length} akun admin</p>
                      </div>
                      <AdminUserTable
                        accounts={adminAccounts}
                        currentUserId={user.id}
                        emptyLabel="Belum ada akun admin."
                        onEditUserClick={onEditUserClick}
                        onDeleteUserClick={onDeleteUserClick}
                      />
                    </section>
                  )}
                </div>
              )}

              {/* Regular User Accounts Tab */}
              {adminTab === "users" && (
                <div className="relative space-y-5">
                  {adminLoading && adminUsers.length === 0 ? (
                    <div className="py-20 text-center">
                      <LoadingSpinner size="lg" className="mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500">Memuat data akun...</p>
                    </div>
                  ) : (
                    <section className="overflow-hidden rounded-2xl bg-white shadow-soft">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">Pengguna</h2>
                          <p className="mt-0.5 text-xs text-slate-500">{userAccounts.length} akun user</p>
                        </div>
                        <button
                          id="btn-add-user"
                          onClick={onAddUserClick}
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Tambah User
                        </button>
                      </div>
                      <AdminUserTable
                        accounts={userAccounts}
                        currentUserId={user.id}
                        emptyLabel="Belum ada akun user."
                        onEditUserClick={onEditUserClick}
                        onDeleteUserClick={onDeleteUserClick}
                      />
                    </section>
                  )}
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
                          <button type="button" onClick={() => setSelectedTransactionUser(userGroup)} className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
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
        </main>
      </div>
    </div>
  );
};

export default AdminSection;
