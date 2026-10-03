import React, { useState } from 'react';
import { StatCard } from '../common/UIComponents';
import { formatCurrency } from '../../lib/format';
import { UserFinancialCharts } from './UserFinancialCharts';
import { TransactionTable } from './TransactionTable';

export const UserDashboard = ({ totals, sortedEntries, runningEntries, txHook, settings, validatePin, modalRef, chartGranularity, setChartGranularity }) => {
  return (
    <>
      <section className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
        {/* Mobile View: Hero Saldo + 2 side-by-side cards */}
        <div className="block sm:hidden space-y-3">
          {/* Main Balance Hero Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-5 text-white shadow-lg border border-emerald-900/40">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Total Saldo Kas
                </p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                  {formatCurrency(totals.balance)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Income & Expense Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px]">↓</span>
                Pemasukan
              </div>
              <p className="mt-1.5 text-base font-extrabold text-emerald-600 truncate">
                {formatCurrency(totals.income)}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-[10px]">↑</span>
                Pengeluaran
              </div>
              <p className="mt-1.5 text-base font-extrabold text-rose-600 truncate">
                {formatCurrency(totals.expense)}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop View: 3 StatCards */}
        <div className="hidden sm:contents">
          <StatCard
            label="Saldo"
            value={formatCurrency(totals.balance)}
            className="from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-900/40"
          />
          <StatCard
            label="Pemasukan"
            value={formatCurrency(totals.income)}
            className="from-emerald-600 to-teal-600 text-white"
          />
          <StatCard
            label="Pengeluaran"
            value={formatCurrency(totals.expense)}
            className="from-rose-500 to-red-600 text-white"
          />
        </div>
      </section>

      <section className="grid min-w-0 gap-4">
        <UserFinancialCharts entries={sortedEntries} totals={totals} timezone={settings?.timezone} chartGranularity={chartGranularity} setChartGranularity={setChartGranularity} />

        <TransactionTable
          loading={txHook.loading} runningEntries={runningEntries}
          setIsImportFileOpen={txHook.setIsImportFileOpen}
          handleDownloadExcel={() => txHook.handleDownloadExcel(runningEntries, validatePin, () => txHook.confirmExportWithPin(runningEntries, validatePin))}
          openModal={(entry) => txHook.openModal(entry, modalRef)}
          setDeleteTarget={txHook.setDeleteTarget}
          setIsDeleteConfirmOpen={txHook.setIsDeleteConfirmOpen}
          setIsConfirmOpen={txHook.setIsConfirmOpen}
          timezone={settings.timezone}
        />
      </section>
    </>
  );
};
