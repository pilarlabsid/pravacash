import React from 'react';
import { LoadingButton, Field } from '../common/UIComponents';
import { inputClasses } from '../../constants';

export const DeleteConfirmModal = ({ isOpen, isPinStep, pin, pinError, deleting, deleteTarget, resetPinFlow, handleDelete, handlePinInput }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
          Hapus transaksi?
        </p>
        <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900">
          Tindakan tidak dapat dibatalkan
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Transaksi ini akan dihapus permanen dari database.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={resetPinFlow}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700"
          >
            Ya, hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export const ResetConfirmModal = ({ isOpen, isPinStep, resetting, resetPinFlow, handleReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-500">
          Bersihkan Data?
        </p>
        <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900">
          Semua transaksi akan dihapus
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Data ini akan dihapus permanen dari database.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={resetPinFlow}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Batalkan
          </button>
          <LoadingButton
            type="button"
            onClick={handleReset}
            loading={resetting}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700"
          >
            Ya, bersihkan
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};


export const LogoutConfirmModal = ({ isOpen, setIsLogoutConfirmOpen, handleLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <svg
                    className="h-6 w-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Konfirmasi Logout
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Apakah Anda yakin ingin logout? Anda perlu login kembali untuk mengakses aplikasi.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
  );
};


export const DeleteUserConfirmModal = ({ isOpen, deleteUserTarget, setIsDeleteUserConfirmOpen, handleConfirmDeleteUser }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="mb-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <svg
                    className="h-6 w-6 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Konfirmasi Hapus User
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Apakah Anda yakin ingin menghapus user ini? Semua transaksi yang terkait dengan user ini akan ikut terhapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteUserConfirmOpen(false);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
                <LoadingButton
                  type="button"
                  onClick={handleConfirmDeleteUser}
                  loading={false}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700"
                >
                  Hapus User
                </LoadingButton>
              </div>
            </div>
          </div>
  );
};
