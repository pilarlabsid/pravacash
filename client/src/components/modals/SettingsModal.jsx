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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
              Pengaturan
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Profile & Keamanan
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(false);
              setSettingsError("");
            }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
            aria-label="Tutup settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">Timezone</label>
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
                <p className="mt-2 text-xs text-slate-500">
                  Pilih timezone untuk menampilkan waktu dan tanggal sesuai lokasi Anda.
                </p>
              </div>
              {settingsError && (
                <p className="text-sm font-semibold text-rose-500">{settingsError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
              >
                Simpan Profile
              </LoadingButton>
            </form>
          </div>

          {/* PIN Settings Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Pengaturan PIN</h3>
            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Aktifkan PIN</p>
                  <p className="mt-1 text-xs text-slate-500">
                    PIN diperlukan untuk operasi penting (tambah, edit, hapus, export, import)
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settingsForm.pinEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, pinEnabled: e.target.checked, pin: "" })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300"></div>
                </label>
              </div>

              {settingsForm.pinEnabled && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">PIN 4 Digit</label>
                  <input
                    type="password"
                    value={settingsForm.pin}
                    onChange={(e) => setSettingsForm({ ...settingsForm, pin: e.target.value.slice(0, 4) })}
                    className={`${inputClasses} text-center tracking-[0.5em]`}
                    placeholder="••••"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    required={settingsForm.pinEnabled}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    {settings?.pinEnabled
                      ? "Masukkan PIN baru untuk mengubah, atau kosongkan untuk menghapus PIN."
                      : "Masukkan PIN 4 digit untuk mengaktifkan proteksi PIN."}
                  </p>
                </div>
              )}

              {settingsError && (
                <p className="text-sm font-semibold text-rose-500">{settingsError}</p>
              )}
              <LoadingButton
                type="submit"
                loading={settingsLoading}
                disabled={settingsForm.pinEnabled && !settingsForm.pin}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 disabled:opacity-50"
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
