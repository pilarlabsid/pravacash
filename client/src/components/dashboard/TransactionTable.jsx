import React from 'react';
import { formatCurrency, formatDate } from "../../lib/format";
import { LoadingSpinner, EmptyState, Badge } from "../common/UIComponents";

export const TransactionTable = ({
  loading,
  runningEntries = [],
  setIsImportFileOpen,
  handleDownloadExcel,
  openModal,
  setDeleteTarget,
  setIsDeleteConfirmOpen,
  setIsConfirmOpen,
  timezone,
}) => {
  const handleDelete = (id) => {
    setDeleteTarget(id);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <section className="grid min-w-0 gap-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Daftar Transaksi
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Histori arus kas
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {loading ? "Memuat data..." : `${runningEntries.length} transaksi tersimpan`}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Memuat transaksi...</p>
          </div>
        ) : runningEntries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="sticky top-0 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Uraian</th>
                      <th className="px-4 py-3 text-right">Pemasukan</th>
                      <th className="px-4 py-3 text-right">Pengeluaran</th>
                      <th className="px-4 py-3 text-right">Saldo</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {runningEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(entry.date, timezone || "Asia/Jakarta")}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px]">
                          <div className="truncate">{entry.description}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-500">
                            {entry.category || (entry.type === "income" ? "Gaji" : "Lainnya")}
                          </span>
                          {entry.proof_url && (
                            <a href={entry.proof_url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-block mt-0.5 px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                              Lihat Bukti
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-medium whitespace-nowrap">
                          {entry.type === "income" ? formatCurrency(entry.amount) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-rose-600 font-medium whitespace-nowrap">
                          {entry.type === "expense" ? formatCurrency(entry.amount) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                          {formatCurrency(entry.runningBalance)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openModal(entry)}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-100"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <div className="max-h-[360px] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-slate-100 p-1">
                <div className="space-y-2">
                {runningEntries.map((entry) => (
                  <div
                    key={`${entry.id}-mobile`}
                    className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <span className={`text-sm font-bold ${entry.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                          {entry.type === "income" ? "↓" : "↑"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {entry.description}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-semibold text-slate-400">
                                {formatDate(entry.date, timezone || "Asia/Jakarta")}
                              </span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                {entry.category || (entry.type === "income" ? "Gaji" : "Lainnya")}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <button
                              onClick={() => openModal(entry)}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-600 transition hover:bg-rose-100 active:scale-95"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>

                        {entry.proof_url && (
                          <a
                            href={entry.proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-[10px] font-bold text-emerald-600 hover:underline"
                          >
                            Lihat Bukti Foto
                          </a>
                        )}

                        <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-slate-50 pt-1.5">
                          <p className={`text-xs font-extrabold ${
                            entry.type === "income" ? "text-emerald-600" : "text-rose-600"
                          }`}>
                            {entry.type === "income" ? "+" : "-"}{formatCurrency(entry.amount)}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400">
                            Saldo: {formatCurrency(entry.runningBalance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
