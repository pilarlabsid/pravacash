import React, { useLayoutEffect, useState } from "react";
import { useAppLogic } from "./hooks/useAppLogic";

// Components
import { Header } from "./components/dashboard/Header";
import { AdminSection } from "./components/admin/AdminSection";
import { AuthModals } from "./components/modals/AuthModals";
import { LoadingSpinner } from "./components/common/UIComponents";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { AppModals } from "./components/modals/AppModals";

export default function App() {
  const [chartGranularity, setChartGranularity] = useState("week");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("prava-cash-theme");
      return savedTheme ? savedTheme === "dark" : true;
    } catch {
      return true;
    }
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    try {
      localStorage.setItem("prava-cash-theme", isDarkMode ? "dark" : "light");
    } catch {
      // Theme still applies for this session when storage is unavailable.
    }
  }, [isDarkMode]);

  const {
    toast, currentTime, isMenuOpen, setIsMenuOpen, isAdminPage, setIsAdminPage, modalRef,
    user, isAuthenticated, authLoading, isLoginModalOpen, setIsLoginModalOpen,
    isRegisterModalOpen, setIsRegisterModalOpen, loginForm, setLoginForm,
    registerForm, setRegisterForm, authError, setAuthError, authFormLoading,
    isLogoutConfirmOpen, setIsLogoutConfirmOpen, handleLogin, handleRegister,
    handleLogout, confirmLogout,
    isSettingsOpen, setIsSettingsOpen, settings, settingsForm, setSettingsForm,
    passwordForm, setPasswordForm, passwordError,
    settingsLoading, settingsError, setSettingsError, handleUpdateProfile, handleUpdatePassword, handleUpdatePin,
    adminHook, txHook,
    pinMode, setPinMode, isPinStep, setIsPinStep, pin, setPin, pinError, setPinError,
    validatePin, resetPinFlow, handlePinInput,
    sortedEntries, runningEntries, totals,
    handleSubmitTx, confirmDeleteWithPin, confirmResetWithPin, closeModal, backFromPin
  } = useAppLogic();

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthModals
        toast={toast}
        isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((current) => !current)}
        isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}
        isRegisterModalOpen={isRegisterModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen}
        loginForm={loginForm} setLoginForm={setLoginForm}
        registerForm={registerForm} setRegisterForm={setRegisterForm}
        authError={authError} setAuthError={setAuthError}
        authFormLoading={authFormLoading}
        handleLogin={handleLogin} handleRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-4">
      {toast && (
        <div className={`fixed left-4 right-4 top-4 z-50 rounded-2xl px-4 py-3 text-white shadow-2xl transition-all sm:left-auto sm:right-6 sm:top-6 ${toast.type === "error" ? "bg-rose-500/90" : "bg-emerald-500/90"}`}>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-3 pt-4 sm:gap-8 sm:px-6 sm:pt-8 lg:px-8">
        <Header
          user={user} currentTime={currentTime} isAdminPage={isAdminPage}
          isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((current) => !current)}
          setIsAdminPage={setIsAdminPage} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
          setIsSettingsOpen={setIsSettingsOpen} handleLogout={handleLogout}
          setIsConfirmOpen={txHook.setIsConfirmOpen}
          handleImportExcel={() => txHook.setIsImportFileOpen(true)}
          handleDownloadExcel={() => txHook.handleDownloadExcel(runningEntries, validatePin, () => txHook.confirmExportWithPin(runningEntries, validatePin))}
          handleDownloadPdf={() => txHook.handleDownloadPdf(runningEntries, totals, user, validatePin, chartGranularity)}
          openModal={() => txHook.openModal(null, modalRef)}
        />

        {isAdmin ? (
          <AdminSection
            user={user}
            adminTab={adminHook.adminTab} setAdminTab={adminHook.setAdminTab}
            adminStats={adminHook.adminStats} adminUsers={adminHook.adminUsers} adminTransactions={adminHook.adminTransactions}
            adminLoading={adminHook.adminLoading} adminError={adminHook.adminError}
            onAddUserClick={() => adminHook.setIsAddUserModalOpen(true)}
            onEditUserClick={adminHook.handleEditUser}
            onDeleteUserClick={adminHook.handleDeleteUser}
          />
        ) : (
          <UserDashboard
            totals={totals}
            sortedEntries={sortedEntries}
            runningEntries={runningEntries}
            txHook={txHook}
            validatePin={validatePin}
            modalRef={modalRef}
            chartGranularity={chartGranularity}
            setChartGranularity={setChartGranularity}
          />
        )}

        <AppModals
          txHook={txHook} adminHook={adminHook}
          isPinStep={isPinStep} setIsPinStep={setIsPinStep}
          pin={pin} setPin={setPin}
          pinError={pinError} setPinError={setPinError}
          pinMode={pinMode} setPinMode={setPinMode}
          settings={settings} modalRef={modalRef}
          handleSubmitTx={handleSubmitTx} handlePinInput={handlePinInput}
          closeModal={closeModal} backFromPin={backFromPin}
          confirmResetWithPin={confirmResetWithPin} confirmDeleteWithPin={confirmDeleteWithPin}
          validatePin={validatePin} runningEntries={runningEntries}
          resetPinFlow={resetPinFlow}
          isLogoutConfirmOpen={isLogoutConfirmOpen} setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
          confirmLogout={confirmLogout}
          isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen}
          settingsForm={settingsForm} setSettingsForm={setSettingsForm}
          settingsError={settingsError} setSettingsError={setSettingsError}
          settingsLoading={settingsLoading}
          passwordForm={passwordForm} setPasswordForm={setPasswordForm} passwordError={passwordError}
          handleUpdateProfile={handleUpdateProfile} handleUpdatePassword={handleUpdatePassword} handleUpdatePin={handleUpdatePin}
        />
      </div>

      <footer className="mx-auto mb-1 mt-5 w-full max-w-6xl px-3 text-center text-xs font-semibold text-slate-400 sm:mt-8 sm:px-6 lg:px-8">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://pilarlabs.id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-emerald-500 transition-colors duration-200"
        >
          Pilar Labs
        </a>
      </footer>
    </div>
  );
}
