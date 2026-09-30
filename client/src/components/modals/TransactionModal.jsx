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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {isPinStep ? "Keamanan PIN" : "Input Transaksi"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {modalTitle}
            </h2>
            {modalSubtitle && (
              <p className="text-sm text-slate-500">{modalSubtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
            aria-label="Tutup form"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isPinStep ? (
            <>
              <Field label="Uraian">
                <input
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  placeholder="Contoh: Warung Biru"
                  className={inputClasses}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nominal">
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1">
                    <span className="text-sm font-semibold text-slate-500">Rp</span>
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
                      className="ml-2 w-full border-none bg-transparent px-0 py-2 text-base font-semibold text-slate-900 outline-none focus:ring-0"
                      placeholder="0"
                    />
                  </div>
                </Field>
                <Field label="Jenis">
                  <select
                    name="type"
                    value={form.type || "expense"}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </select>
                </Field>
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
                <Field label="Tanggal">
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date || getNow(settings.timezone || "Asia/Jakarta")}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </Field>
              </div>
              <Field label="Bukti Transaksi (Opsional)">
                {form.proof_url ? (
                  <div className="flex items-center gap-3 mt-1 rounded-2xl border border-slate-200 p-2">
                    <img src={form.proof_url} alt="Bukti" className="h-12 w-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{form.proof_url.split('/').pop()}</p>
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
                    className={`${inputClasses} file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                  />
                )}
              </Field>
            </>
          ) : settings.pinEnabled ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-slate-500">
                {pinDescriptions[pinMode ?? "create"]}
              </p>
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
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-slate-500">
                Konfirmasi untuk melanjutkan.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={isPinStep ? handlePinBack : closeModal}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:flex-1"
            >
              {isPinStep ? "Kembali" : "Batalkan"}
            </button>
            {isPinStep && pinMode === "reset" ? (
              <button
                type="button"
                onClick={confirmResetWithPin}
                disabled={resetting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 sm:w-auto sm:flex-1"
              >
                {resetting ? "Menghapus..." : settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </button>
            ) : isPinStep && pinMode === "delete" ? (
              <LoadingButton
                type="button"
                onClick={confirmDeleteWithPin}
                loading={deleting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300 sm:w-auto sm:flex-1"
              >
                {settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </LoadingButton>
            ) : isPinStep && pinMode === "export" ? (
              <LoadingButton
                type="button"
                onClick={confirmExportWithPin}
                loading={exporting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 sm:w-auto sm:flex-1"
              >
                {settings.pinEnabled ? "Konfirmasi PIN" : "Konfirmasi"}
              </LoadingButton>
            ) : (
              <LoadingButton
                type="submit"
                loading={submitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 sm:w-auto sm:flex-1"
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
