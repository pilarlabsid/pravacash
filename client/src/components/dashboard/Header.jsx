import React from 'react';

export const Header = ({
  user, currentTime, isAdminPage, setIsAdminPage,
  isMenuOpen, setIsMenuOpen, setIsSettingsOpen, handleLogout,
  setIsConfirmOpen, handleImportExcel, handleDownloadExcel, openModal
}) => {
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

  return (
    <header className="flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 px-6 py-8 text-white shadow-soft sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Prava Cash
                </p>
                {user && (
                  <p className="mt-1 text-sm font-medium text-white/80">
                    Halo, {user.name}
                  </p>
                )}
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm font-medium text-white/90">
                  {currentTime.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
                  })}
                </p>
                <p className="text-lg font-semibold text-white">
                  {currentTime.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Mobile: Side-by-side buttons, Desktop: Full width primary button */}
              {!isAdmin && (
                <div className="flex w-full gap-2 sm:w-auto sm:flex-1">
                  {/* Primary Button */}
                  <button
                    type="button"
                    onClick={() => openModal && openModal()}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-soft transition hover:bg-slate-100 sm:flex-initial"
                  >
                    + Tambah Transaksi
                  </button>

                  {/* Mobile: Menu Button - Side by side with primary button */}
                  <div className="relative sm:hidden">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      aria-label="Menu"
                    >
                      <span className="mr-2">Menu</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsMenuOpen(false)}
                        />
                        {/* Menu Items */}
                        <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-white/20 bg-slate-800 shadow-2xl">
                          <div className="py-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSettingsOpen(true);
                                
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Settings
                            </button>
                            <div className="my-1 border-t border-white/20" />
                            <button
                              type="button"
                              onClick={() => {
                                setIsConfirmOpen(true);
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Bersihkan Data
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleImportExcel();
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Import Excel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleDownloadExcel();
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                              Download Excel
                            </button>
                            <div className="my-1 border-t border-white/20" />
                            <button
                              type="button"
                              onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm font-semibold text-rose-400 transition hover:bg-white/10"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile: Menu Button for Admin */}
              {isAdmin && (
                <div className="relative sm:hidden">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    aria-label="Menu"
                  >
                    <span className="mr-2">Menu</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu for Admin */}
                  {isMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      {/* Menu Items */}
                      <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-white/20 bg-slate-800 shadow-2xl">
                        <div className="py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsSettingsOpen(true);
                              
                              setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                          >
                            Settings
                          </button>
                          <div className="my-1 border-t border-white/20" />
                          <button
                            type="button"
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-semibold text-rose-400 transition hover:bg-white/10"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Desktop: Secondary Actions - Horizontal */}
              <div className="hidden items-center gap-2 sm:flex">
                {!isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        
                      }}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmOpen(true)}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Bersihkan Data
                    </button>
                    <button
                      type="button"
                      onClick={handleImportExcel}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Import Excel
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadExcel}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Download Excel
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Logout
                    </button>
                  </>
                )}
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        
                      }}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4"
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
