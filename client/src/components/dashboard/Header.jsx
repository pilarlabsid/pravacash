import React from 'react';
import { getBrowserTimezone, getTimezoneLabel } from '../../lib/format';

export const Header = ({
  user, currentTime, isAdminPage, setIsAdminPage,
  isMenuOpen, setIsMenuOpen, setIsSettingsOpen, handleLogout,
  setIsConfirmOpen, handleImportExcel, handleDownloadExcel, handleDownloadPdf, openModal
}) => {
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const browserTimezone = getBrowserTimezone();
  const tzLabel = getTimezoneLabel(browserTimezone);

  return (
    <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] p-5 sm:p-7 text-white shadow-xl">
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-md">
            <rect width="48" height="48" rx="14" fill="#047857"/>
            <rect x="10" y="24" width="7" height="15" rx="3.5" fill="#a7f3d0"/>
            <rect x="20" y="16" width="7" height="23" rx="3.5" fill="#34d399"/>
            <rect x="30" y="9"  width="7" height="30" rx="3.5" fill="#ffffff"/>
          </svg>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate">Prava Cash</span>
              {isAdmin && (
                <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  Admin
                </span>
              )}
            </div>
            {user && (
              <p className="text-xs text-emerald-100/80 font-medium truncate">
                Halo, {user.name}
              </p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[11px] sm:text-xs font-medium text-emerald-200/80">
            {currentTime.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: browserTimezone,
            })}
          </p>
          <div className="flex items-center justify-end gap-1.5">
            <p className="text-base sm:text-lg font-bold tracking-tight text-white">
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: browserTimezone,
              })}
            </p>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
              {tzLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-2.5 pt-1">
        {/* Tambah Transaksi Button */}
        {!isAdmin ? (
          <div className="flex w-full gap-2 sm:w-auto sm:flex-1">
            <button
              type="button"
              onClick={() => openModal && openModal()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-emerald-950 shadow-md transition hover:bg-emerald-50 active:scale-98 sm:flex-initial"
            >
              <span className="text-base leading-none font-bold text-emerald-700">+</span>
              Tambah Transaksi
            </button>

            {/* Mobile: Menu Button */}
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 active:scale-98"
                aria-label="Menu"
              >
                <span className="mr-1.5">Menu</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu Mobile */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/15 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Pengaturan & PIN
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleImportExcel();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Import Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadExcel();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Download Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadPdf();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsConfirmOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
                    >
                      Bersihkan Data
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-rose-400 transition hover:bg-rose-500/10"
                    >
                      Keluar (Logout)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between sm:w-auto">
            <span className="text-xs font-semibold text-emerald-200/80">Panel Pengelola Akun</span>
            <div className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-98"
                aria-label="Menu"
              >
                <span className="mr-1.5">Menu</span>
                <svg
                  className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/15 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Pengaturan Profil
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-rose-400 transition hover:bg-rose-500/10"
                    >
                      Keluar (Logout)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Desktop: Secondary Actions */}
        <div className="hidden items-center gap-2 sm:flex">
          {!isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={handleImportExcel}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Import Excel
              </button>
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Download Excel
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-300/30 bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
              >
                Bersihkan Data
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
