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


export const ImportFileModal = ({ isOpen, importFile, importPreview, importing, setImportFile, setIsImportFileOpen, handleFileUpload, closeImportFileModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        {importing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm">
             <div className="text-2xl font-semibold text-indigo-600">Mengimpor transaksi...</div>
          </div>
        )}
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
          Import Excel
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Upload File Excel
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Pilih file Excel yang akan diimpor. Format harus sesuai dengan file yang diunduh dari aplikasi ini.
        </p>
        <div className="mt-6 space-y-4">
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
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 transition ${importing
                ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                : "border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100"
                }`}
            >
              {importing ? (
                <>
                  <div className="mb-2 text-2xl">⏳</div>
                  <p className="text-sm font-semibold text-slate-600">
                    Memproses file...
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-2 text-2xl">📄</div>
                  <p className="text-sm font-semibold text-indigo-600">
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
        <div className="mt-6">
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
