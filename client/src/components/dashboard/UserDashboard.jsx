import React, { useState } from 'react';
import { StatCard } from '../common/UIComponents';
import { formatCurrency } from '../../lib/format';
import { UserFinancialCharts } from './UserFinancialCharts';
import { TransactionTable } from './TransactionTable';

export const UserDashboard = ({ totals, sortedEntries, runningEntries, txHook, settings, validatePin, modalRef }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <>
      <section className="relative pb-2 sm:grid sm:grid-cols-3 sm:gap-6">
        <div className="relative overflow-hidden sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
          <div
            className="flex transition-transform duration-300 ease-in-out sm:contents"
            style={{
              transform: `translateX(-${currentCardIndex * 100}%)`,
            }}
          >
            <div className="min-w-full flex-shrink-0 sm:min-w-0">
              <StatCard
                label="Saldo"
                value={formatCurrency(totals.balance)}
                className="bg-indigo-600 text-white"
              />
            </div>
            <div className="min-w-full flex-shrink-0 sm:min-w-0">
              <StatCard
                label="Pemasukan"
                value={formatCurrency(totals.income)}
                className="bg-emerald-500 text-white"
              />
            </div>
            <div className="min-w-full flex-shrink-0 sm:min-w-0">
              <StatCard
                label="Pengeluaran"
                value={formatCurrency(totals.expense)}
                className="bg-rose-500 text-white"
              />
            </div>
          </div>
        </div>

        {/* Carousel Dots Indicator - hanya tampil di mobile */}
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentCardIndex(index)}
              className={`h-2 rounded-full transition-all ${currentCardIndex === index
                ? "w-8 bg-indigo-500"
                : "w-2 bg-slate-300"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <UserFinancialCharts entries={sortedEntries} totals={totals} />

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
