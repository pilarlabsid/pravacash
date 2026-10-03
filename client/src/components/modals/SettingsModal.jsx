import React from 'react';
import { LoadingButton } from '../common/UIComponents';
import { inputClasses } from '../../constants';

export const SettingsModal = ({
  isOpen, settingsForm, settingsError, settingsLoading, settings,
  setSettingsForm, setIsSettingsOpen, setSettingsError,
  handleUpdateProfile, handleUpdatePin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Pengaturan
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
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

        <div className="space-y-5">
          {/* Profile Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6">
            <h3 className="mb-3 text-base font-bold text-slate-900">Profile Pengguna</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Nama</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className={inputClasses}
                  placeholder="nama@email.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Zona Waktu (Timezone)</label>
                <select
                  value={settingsForm.timezone || "Asia/Jakarta"}
                  onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                  className={inputClasses}
                >
                  <optgroup label="Indonesia">
                    <option value="Asia/Jakarta">WIB (Jakarta) - GMT+7</option>
                    <option value="Asia/Makassar">WITA (Makassar) - GMT+8</option>
                    <option value="Asia/Jayapura">WIT (Jayapura) - GMT+9</option>
                  </optgroup>
                  <optgroup label="Asia">
                    <option value="Asia/Singapore">Singapore - GMT+8</option>
                    <option value="Asia/Kuala_Lumpur">Kuala Lumpur - GMT+8</option>
                    <option value="Asia/Bangkok">Bangkok - GMT+7</option>
                    <option value="Asia/Manila">Manila - GMT+8</option>
                    <option value="Asia/Tokyo">Tokyo - GMT+9</option>
                    <option value="Asia/Seoul">Seoul - GMT+9</option>
                    <option value="Asia/Hong_Kong">Hong Kong - GMT+8</option>
                    <option value="Asia/Shanghai">Shanghai - GMT+8</option>
                  </optgroup>
                  <optgroup label="Eropa">
                    <option value="Europe/London">London - GMT+0</option>
                    <option value="Europe/Paris">Paris - GMT+1</option>
                    <option value="Europe/Berlin">Berlin - GMT+1</option>
                    <option value="Europe/Moscow">Moscow - GMT+3</option>
                  </optgroup>
                  <optgroup label="Amerika">
                    <option value="America/New_York">New York - GMT-5</option>
                    <option value="America/Chicago">Chicago - GMT-6</option>
                    <option value="America/Denver">Denver - GMT-7</option>
                    <option value="America/Los_Angeles">Los Angeles - GMT-8</option>
                  </optgroup>
                  <optgroup label="Oceania">
                    <option value="Australia/Sydney">Sydney - GMT+10</option>
                    <option value="Australia/Melbourne">Melbourne - GMT+10</option>
                    <option value="Pacific/Auckland">Auckland - GMT+12</option>
                  </optgroup>
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  Waktu dan tanggal transaksi akan disesuaikan dengan zona waktu ini.
                </p>
              </div>
              {settingsError && (
                <p className="text-xs sm:text-sm font-semibold text-rose-500">{settingsError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
              >
                Simpan Profile
              </LoadingButton>
            </form>
          </div>

          {/* PIN Settings Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6">
            <h3 className="mb-3 text-base font-bold text-slate-900">Keamanan PIN</h3>
            <form onSubmit={handleUpdatePin} className="space-y-3.5">
              <div className="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200">
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
                    className={`${inputClasses} text-center text-xl font-bold tracking-[0.6em] py-3.5`}
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
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 active:scale-98"
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
