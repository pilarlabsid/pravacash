import React from 'react';
import { LoadingButton } from '../common/UIComponents';
import { inputClasses } from '../../constants';

export const SettingsModal = ({
  isOpen, settingsForm, settingsError, settingsLoading, settings,
  setSettingsForm, setIsSettingsOpen, setSettingsError,
  passwordForm, setPasswordForm, passwordError,
  handleUpdateProfile, handleUpdatePassword, handleUpdatePin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-2xl bg-white p-4 sm:p-5 shadow-2xl">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Pengaturan
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              Profile & Keamanan
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(false);
              setSettingsError("");
            }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-95"
            aria-label="Tutup settings"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {/* Profile Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4">
            <h3 className="mb-2.5 text-sm font-bold text-slate-900">Profile Pengguna</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-2.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Nama</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className={`${inputClasses} !rounded-xl !py-2`}
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  readOnly
                  aria-readonly="true"
                  className={`${inputClasses} !rounded-xl !py-2 cursor-not-allowed bg-slate-100 text-slate-500`}
                />
              </div>
              {settingsError && (
                <p className="text-xs sm:text-sm font-semibold text-rose-500">{settingsError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
              >
                Simpan Profile
              </LoadingButton>
            </form>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 sm:p-4">
            <h3 className="mb-2.5 text-sm font-bold text-slate-900">Ganti Password</h3>
            <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">Password Lama</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`${inputClasses} !rounded-xl !py-2`}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Password Baru</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`${inputClasses} !rounded-xl !py-2`}
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`${inputClasses} !rounded-xl !py-2`}
                  minLength={6}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-xs font-semibold text-rose-500 sm:col-span-2">{passwordError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98 sm:col-span-2"
              >
                Simpan Password
              </LoadingButton>
            </form>
          </div>

          {/* PIN Settings Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 lg:col-span-2 lg:p-4">
            <h3 className="mb-2.5 text-sm font-bold text-slate-900">Keamanan PIN</h3>
            <form onSubmit={handleUpdatePin} className="space-y-2.5">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                <div className="pr-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Proteksi PIN</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    PIN 4 digit saat menghapus, mengedit, atau ekspor data
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={settingsForm.pinEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, pinEnabled: e.target.checked, pin: "" })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300"></div>
                </label>
              </div>

              {settingsForm.pinEnabled && (
                <div>
                  <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">PIN 4 Digit</label>
                  <input
                    type="password"
                    value={settingsForm.pin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, pin: e.target.value.slice(0, 4) })}
                    className={`${inputClasses} !rounded-xl !py-2 text-center text-xl font-bold tracking-[0.6em]`}
                    placeholder="••••"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    required={settingsForm.pinEnabled}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    {settings?.pinEnabled
                      ? "Masukkan PIN baru untuk mengubah, atau kosongkan untuk menghapus PIN."
                      : "Masukkan 4 angka untuk mengaktifkan proteksi PIN."}
                  </p>
                </div>
              )}

              {settingsError && (
                <p className="text-xs sm:text-sm font-semibold text-rose-500">{settingsError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                disabled={settingsForm.pinEnabled && !settingsForm.pin}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/15 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 active:scale-98"
              >
                Simpan Pengaturan PIN
              </LoadingButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
