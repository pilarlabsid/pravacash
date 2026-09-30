import React from "react";
import { LoadingButton } from "../common/UIComponents";
import { inputClasses } from "../../constants";

export const LoginModal = ({
  isOpen, loginForm, setLoginForm, handleLogin, authError, authFormLoading, onSwitchToRegister
}) => {
  if (!isOpen) return null;
  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <h2 className="mb-6 text-2xl font-semibold text-slate-900">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email" value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className={inputClasses} placeholder="nama@email.com" required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password" value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className={inputClasses} placeholder="••••••" required
          />
        </div>
        {authError && <p className="text-sm font-semibold text-rose-500">{authError}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onSwitchToRegister} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Daftar</button>
          <LoadingButton type="submit" loading={authFormLoading} className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700">Login</LoadingButton>
        </div>
      </form>
    </div>
  );
};

export const RegisterModal = ({
  isOpen, registerForm, setRegisterForm, handleRegister, authError, authFormLoading, onSwitchToLogin
}) => {
  if (!isOpen) return null;
  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <h2 className="mb-6 text-2xl font-semibold text-slate-900">Daftar</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
          <input
            type="text" value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            className={inputClasses} placeholder="Nama Lengkap" required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email" value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className={inputClasses} placeholder="nama@email.com" required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password" value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            className={inputClasses} placeholder="Minimal 6 karakter" required minLength={6}
          />
        </div>
        {authError && <p className="text-sm font-semibold text-rose-500">{authError}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onSwitchToLogin} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Login</button>
          <LoadingButton type="submit" loading={authFormLoading} className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700">Daftar</LoadingButton>
        </div>
      </form>
    </div>
  );
};

export const AuthModals = ({
  toast, isLoginModalOpen, setIsLoginModalOpen,
  isRegisterModalOpen, setIsRegisterModalOpen,
  loginForm, setLoginForm, registerForm, setRegisterForm,
  authError, setAuthError, authFormLoading,
  handleLogin, handleRegister
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center px-4">
      {toast && (
        <div className={`fixed right-6 top-6 z-50 rounded-2xl px-4 py-3 text-white shadow-2xl transition-all ${toast.type === "error" ? "bg-rose-500/90" : "bg-emerald-500/90"}`}>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Prava Cash</h1>
          <p className="text-indigo-200">Cashflow Management Dashboard</p>
        </div>
        <LoginModal 
          isOpen={isLoginModalOpen} loginForm={loginForm} setLoginForm={setLoginForm}
          handleLogin={handleLogin} authError={authError} authFormLoading={authFormLoading}
          onSwitchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); setAuthError(""); }}
        />
        <RegisterModal 
          isOpen={isRegisterModalOpen} registerForm={registerForm} setRegisterForm={setRegisterForm}
          handleRegister={handleRegister} authError={authError} authFormLoading={authFormLoading}
          onSwitchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); setAuthError(""); }}
        />
        {!isLoginModalOpen && !isRegisterModalOpen && (
          <div className="rounded-3xl bg-white p-8 shadow-2xl text-center">
            <p className="mb-6 text-slate-600">Silakan login untuk melanjutkan</p>
            <button onClick={() => setIsLoginModalOpen(true)} className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700">Login</button>
            <p className="mt-4 text-sm text-slate-500">
              Belum punya akun? <button onClick={() => setIsRegisterModalOpen(true)} className="font-semibold text-indigo-600 hover:text-indigo-700">Daftar di sini</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
