import React, { useState } from 'react';
import { LoadingButton, Field } from '../common/UIComponents';
import { inputClasses, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants';
import { getNow } from '../../lib/format';

export const TransactionModal = ({
  isOpen, isPinStep, form, pin, pinError, pinMode, submitting,
  handleSubmit, handleChange, handlePinInput,
  settings, editingTarget, deleting, exporting, resetting,
  pinDescriptions, modalRef, modalTitle, modalSubtitle,
  closeModal, handlePinBack, confirmResetWithPin, confirmDeleteWithPin, confirmExportWithPin,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProofSectionOpen, setIsProofSectionOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl transition-all"
      >
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="mb-3 flex items-start justify-between gap-3 sm:mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {isPinStep ? "Keamanan PIN" : "Input Transaksi"}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {modalTitle}
            </h2>
            {modalSubtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{modalSubtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-95"
            aria-label="Tutup form"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isPinStep ? (
            <>
              {/* Jenis Transaksi Segmented Control */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange({ target: { name: 'type', value: 'expense' } });
                      handleChange({ target: { name: 'category', value: EXPENSE_CATEGORIES[0] } });
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold transition-all sm:py-2.5 ${
                      (form.type || "expense") === "expense"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>↑</span> Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange({ target: { name: 'type', value: 'income' } });
                      handleChange({ target: { name: 'category', value: INCOME_CATEGORIES[0] } });
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold transition-all sm:py-2.5 ${
                      form.type === "income"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>↓</span> Pemasukan
                  </button>
                </div>
              </div>

              {/* Nominal */}
              <Field label="Nominal">
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-1.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition sm:py-2">
                  <span className="text-base font-bold text-emerald-600">Rp</span>
                  <input
                    type="text"
                    name="amount"
                    inputMode="numeric"
                    value={
                      form.amount && form.amount !== "" && !Number.isNaN(Number(form.amount))
                        ? Number(form.amount).toLocaleString("id-ID")
                        : ""
                    }
                    onChange={handleChange}
                    className="ml-2 w-full border-none bg-transparent px-0 py-1 text-lg sm:text-xl font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                    placeholder="0"
                    autoFocus={!form.amount}
                  />
                </div>
              </Field>

              {/* Uraian */}
              <Field label="Uraian">
                <input
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  placeholder="Contoh: Belanja bahan baku / Gaji bulanan"
                  className={inputClasses}
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kategori">
                  <select
                    name="category"
                    value={form.category || (form.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    {(form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tanggal & Waktu">
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date || getNow(settings.timezone || "Asia/Jakarta")}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </Field>
              </div>

              {!form.proof_url && !isProofSectionOpen ? (
                <button
                  type="button"
                  onClick={() => setIsProofSectionOpen(true)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-base">+</span>
                  Tambah bukti transaksi (opsional)
                </button>
              ) : (
              <Field label="Bukti Transaksi (Opsional)">
                {form.proof_url ? (
                  <div className="flex items-center gap-3 mt-1 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <img src={form.proof_url} alt="Bukti" className="h-14 w-14 object-cover rounded-xl border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{form.proof_url.split('/').pop()}</p>
                      <a href={form.proof_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline">
                        Lihat gambar penuh
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'proof_url', value: '' } })}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label="Hapus gambar"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setIsUploading(true);
                      const token = localStorage.getItem("token");
                      const formData = new FormData();
                      formData.append("image", file);
                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData
                        });
                        const data = await res.json();
                        if (res.ok) {
                          handleChange({ target: { name: 'proof_url', value: data.url } });
                        } else {
                          alert(data.message || "Gagal mengunggah gambar");
                        }
                      } catch (err) {
                        alert("Terjadi kesalahan saat mengunggah gambar");
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    className={`${inputClasses} file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                  />
                )}
              </Field>
              )}
            </>
          ) : settings.pinEnabled ? (
            <div className="space-y-4 py-2">
              <p className="text-center text-sm font-medium text-slate-600">
                {pinDescriptions[pinMode ?? "create"]}
              </p>
              <Field label="PIN Keamanan">
                <input
                  type="password"
                  name="pin"
                  value={pin || ""}
                  onChange={handlePinInput}
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  className={`${inputClasses} text-center text-2xl font-bold tracking-[0.6em] py-3.5`}
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
          ) : (
            <div className="space-y-3 py-2">
              <p className="text-center text-sm font-medium text-slate-600">
                Konfirmasi untuk melanjutkan aksi ini.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={isPinStep ? handlePinBack : closeModal}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-98 sm:w-auto sm:flex-1"
            >
              {isPinStep ? "Kembali" : "Batalkan"}
            </button>
            {isPinStep && pinMode === "reset" ? (
              <button
                type="button"
                onClick={confirmResetWithPin}
                disabled={resetting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 active:scale-98 sm:w-auto sm:flex-1"
              >
                {resetting ? "Menghapus..." : settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </button>
            ) : isPinStep && pinMode === "delete" ? (
              <LoadingButton
                type="button"
                onClick={confirmDeleteWithPin}
                loading={deleting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-soft transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 active:scale-98 sm:w-auto sm:flex-1"
              >
                {settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </LoadingButton>
            ) : isPinStep && pinMode === "export" ? (
              <LoadingButton
                type="button"
                onClick={confirmExportWithPin}
                loading={exporting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-soft transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:bg-emerald-300 active:scale-98 sm:w-auto sm:flex-1"
              >
                {settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                loading={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-98 sm:w-auto sm:flex-1"
              >
                {isPinStep
                  ? settings.pinEnabled
                    ? "Konfirmasi PIN"
                    : "Konfirmasi"
                  : editingTarget
                    ? "Simpan Perubahan"
                    : "Lanjutkan"}
              </LoadingButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
