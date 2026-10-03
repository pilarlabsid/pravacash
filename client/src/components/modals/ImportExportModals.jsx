import React from 'react';
import { LoadingButton, Field } from '../common/UIComponents';
import { inputClasses } from '../../constants';
import { formatCurrency, formatDate } from '../../lib/format';

export const ExportPinModal = ({ isOpen, pin, pinError, exporting, setPin, setPinError, setIsExportPinOpen, handlePinInput, closeExportPinModal, confirmExportWithPin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Keamanan PIN
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Konfirmasi PIN
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Masukkan PIN 4-digit untuk mengunduh transaksi.
        </p>
        <div className="mt-4 space-y-3 text-left">
          <Field label="PIN">
            <input
              type="password"
              name="pin"
              value={pin || ""}
              onChange={handlePinInput}
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              className={`${inputClasses} text-center tracking-[0.5em]`}
              placeholder="••••"
            />
          </Field>
          {pinError && (
            <p className="text-center text-xs font-semibold text-rose-500">
              {pinError}
            </p>
          )}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={closeExportPinModal}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={confirmExportWithPin}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700"
          >
            Konfirmasi PIN
          </button>
        </div>
      </div>
    </div>
  );
};


export const ImportFileModal = ({ isOpen, importFile, importPreview, importing, setImportFile, setIsImportFileOpen, handleFileUpload, downloadImportTemplate, closeImportFileModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/70 p-0 sm:items-center sm:p-4">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 text-center shadow-2xl sm:max-h-[88vh] sm:rounded-3xl sm:p-8">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        {importing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
             <div className="text-lg font-semibold text-emerald-700">Memproses file Excel...</div>
          </div>
        )}
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 sm:text-sm">
          Import Excel
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900 sm:mt-2 sm:text-2xl">
          Upload File Excel
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:mt-3 sm:text-sm">
          Gunakan file ekspor Prava Cash, atau kolom Tanggal, Uraian, Kategori, Tipe, dan Nominal. Kolom Pemasukan/Pengeluaran juga didukung.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 text-left sm:mt-5">
          <p className="bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">Contoh format yang dapat diimpor</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-slate-600">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">Tanggal & Waktu (WIB)</th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">Uraian</th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">Kategori</th>
                  <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">Tipe</th>
                  <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="whitespace-nowrap px-3 py-2">03/10/2026 08:30</td><td className="px-3 py-2">Penjualan harian</td><td className="px-3 py-2">Penjualan</td><td className="px-3 py-2">Pemasukan</td><td className="px-3 py-2 text-right">1500000</td></tr>
                <tr><td className="whitespace-nowrap px-3 py-2">03/10/2026 12:00</td><td className="px-3 py-2">Belanja bahan</td><td className="px-3 py-2">Makanan</td><td className="px-3 py-2">Pengeluaran</td><td className="px-3 py-2 text-right">250000</td></tr>
              </tbody>
            </table>
          </div>
          <p className="px-3 py-2 text-[11px] text-slate-500">Gunakan nilai angka tanpa “Rp”. Tipe: Pemasukan atau Pengeluaran.</p>
        </div>
        <button
          type="button"
          onClick={downloadImportTemplate}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
          Unduh template Excel
        </button>
        <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
              id="excel-file-input"
            />
            <label
              htmlFor="excel-file-input"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-5 transition sm:px-6 sm:py-8 ${importing
                ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                : "border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100"
                }`}
            >
              {importing ? (
                <>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" d="M20 12a8 8 0 1 1-2.34-5.66" /></svg></div>
                  <p className="text-sm font-semibold text-slate-600">
                    Memproses file...
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" /></svg></div>
                  <p className="text-sm font-bold text-emerald-700">
                    Klik untuk memilih file
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Format: .xlsx atau .xls
                  </p>
                </>
              )}
            </label>
          </div>
          {importFile && (
            <div className="rounded-xl bg-slate-50 p-3 text-left">
              <p className="text-xs font-semibold text-slate-500">File terpilih:</p>
              <p className="text-sm font-medium text-slate-900">{importFile.name}</p>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-6">
          <button
            type="button"
            onClick={closeImportFileModal}
            disabled={importing}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};


export const ImportPinModal = ({ isOpen, pin, pinError, importing, importPreview, settings, setPin, setPinError, setIsImportPinOpen, handlePinInput, closeImportPinModal, confirmImportWithPin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        {importing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
             <div className="text-2xl font-semibold text-indigo-600">Mengimpor transaksi...</div>
          </div>
        )}
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Keamanan PIN
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Konfirmasi PIN
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Masukkan PIN 4-digit untuk mengimpor {importPreview.length} transaksi dari Excel.
        </p>
        {importPreview.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-xl bg-slate-50 p-3 text-left">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Preview ({importPreview.length} transaksi):
            </p>
            <div className="space-y-1">
              {importPreview.slice(0, 5).map((t, idx) => (
                <p key={idx} className="text-xs text-slate-600">
                  • {formatDate(t.date, settings.timezone || "Asia/Jakarta")} - {t.description} - {formatCurrency(t.amount)} ({t.type === "income" ? "Pemasukan" : "Pengeluaran"})
                </p>
              ))}
              {importPreview.length > 5 && (
                <p className="text-xs text-slate-400">
                  ... dan {importPreview.length - 5} transaksi lainnya
                </p>
              )}
            </div>
          </div>
        )}
        <div className="mt-4 space-y-3 text-left">
          <Field label="PIN">
            <input
              type="password"
              name="pin"
              value={pin || ""}
              onChange={handlePinInput}
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              className={`${inputClasses} text-center tracking-[0.5em]`}
              placeholder="••••"
              autoFocus
            />
          </Field>
          {pinError && (
            <p className="text-center text-xs font-semibold text-rose-500">
              {pinError}
            </p>
          )}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={closeImportPinModal}
            disabled={importing}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={confirmImportWithPin}
            disabled={importing}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {importing ? "Mengimpor..." : "Konfirmasi PIN"}
          </button>
        </div>
      </div>
    </div>
  );
};
