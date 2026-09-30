import React from "react";
import { LoadingButton } from "../common/UIComponents";
import { inputClasses } from "../../constants";

// ─── Prava Cash Logo SVG ───────────────────────────────────────────────────
const PravaLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-bg" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0ea5e9" />
        <stop offset="1" stopColor="#22c55e" />
      </linearGradient>
      <linearGradient id="logo-bars" x1="32" y1="96" x2="96" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffffff" stopOpacity=".85" />
        <stop offset="1" stopColor="#f3f4f6" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="32" fill="url(#logo-bg)" />
    <g fill="url(#logo-bars)">
      <rect x="30" y="58" width="12" height="34" rx="6" />
      <rect x="52" y="46" width="12" height="46" rx="6" />
      <rect x="74" y="34" width="12" height="58" rx="6" />
      <rect x="96" y="22" width="12" height="70" rx="6" />
    </g>
    <path d="M28 82c16-8 32-20 48-32s24-12 24-12" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
  </svg>
);

// ─── Left Brand Panel ──────────────────────────────────────────────────────
const BrandPanel = () => (
  <div className="auth-brand-panel">
    <div className="auth-blob auth-blob-1" />
    <div className="auth-blob auth-blob-2" />

    <div className="auth-brand-content">
      {/* Logo */}
      <div className="auth-logo">
        <PravaLogo size={48} />
        <div>
          <p className="auth-logo-name">Prava Cash</p>
          <p className="auth-logo-tagline">Cashflow Management</p>
        </div>
      </div>

      {/* Headline */}
      <div className="auth-headline">
        <h1 className="auth-headline-title">Kelola Keuangan<br />Lebih Cerdas</h1>
        <p className="auth-headline-sub">
          Catat pemasukan & pengeluaran, pantau saldo, dan analisis cashflow bisnis Anda secara realtime.
        </p>
      </div>

      {/* Features — minimal, no emojis */}
      <div className="auth-features">
        {[
          { label: "Laporan visual interaktif" },
          { label: "Keamanan dengan autentikasi PIN" },
          { label: "Sinkronisasi data realtime" },
          { label: "Ekspor laporan ke Excel & PDF" },
        ].map((f) => (
          <div key={f.label} className="auth-feature-item">
            <span className="auth-feature-dot" />
            <span className="auth-feature-label">{f.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom */}
    <div className="auth-brand-footer">
      <p>© 2026 Prava Cash · Semua hak dilindungi</p>
      <p style={{ marginTop: '4px' }}>
        Development by <a href="https://pilarlabs.id" target="_blank" rel="noopener noreferrer" style={{ color: '#a7f3d0', textDecoration: 'none', fontWeight: 600 }}>Pilar Labs</a>
      </p>
    </div>
  </div>
);

// ─── Login Form ─────────────────────────────────────────────────────────────
export const LoginModal = ({
  isOpen, loginForm, setLoginForm, handleLogin, authError, authFormLoading, onSwitchToRegister
}) => {
  if (!isOpen) return null;
  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Masuk</h2>
        <p className="auth-form-subtitle">Selamat datang kembali di Prava Cash</p>
      </div>
      <form onSubmit={handleLogin} className="auth-form-body">
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            type="email" value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className={inputClasses} placeholder="nama@email.com" required
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            type="password" value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className={inputClasses} placeholder="••••••" required
          />
        </div>
        {authError && <div className="auth-error">{authError}</div>}
        <LoadingButton type="submit" loading={authFormLoading} className="auth-btn-primary">
          Masuk
        </LoadingButton>
        <p className="auth-switch">
          Belum punya akun?{" "}
          <button type="button" onClick={onSwitchToRegister} className="auth-switch-link">
            Daftar sekarang
          </button>
        </p>
      </form>
    </div>
  );
};

// ─── Register Form ──────────────────────────────────────────────────────────
export const RegisterModal = ({
  isOpen, registerForm, setRegisterForm, handleRegister, authError, authFormLoading, onSwitchToLogin
}) => {
  if (!isOpen) return null;
  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Daftar</h2>
        <p className="auth-form-subtitle">Buat akun Prava Cash Anda</p>
      </div>
      <form onSubmit={handleRegister} className="auth-form-body">
        <div className="auth-field">
          <label className="auth-label">Nama Lengkap</label>
          <input
            type="text" value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            className={inputClasses} placeholder="Nama Anda" required
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            type="email" value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className={inputClasses} placeholder="nama@email.com" required
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            type="password" value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            className={inputClasses} placeholder="Minimal 6 karakter" required minLength={6}
          />
        </div>
        {authError && <div className="auth-error">{authError}</div>}
        <LoadingButton type="submit" loading={authFormLoading} className="auth-btn-primary">
          Buat Akun
        </LoadingButton>
        <p className="auth-switch">
          Sudah punya akun?{" "}
          <button type="button" onClick={onSwitchToLogin} className="auth-switch-link">
            Masuk di sini
          </button>
        </p>
      </form>
    </div>
  );
};

// ─── Auth Page ──────────────────────────────────────────────────────────────
export const AuthModals = ({
  toast, isLoginModalOpen, setIsLoginModalOpen,
  isRegisterModalOpen, setIsRegisterModalOpen,
  loginForm, setLoginForm, registerForm, setRegisterForm,
  authError, setAuthError, authFormLoading,
  handleLogin, handleRegister
}) => {
  return (
    <div className="auth-page">
      {toast && (
        <div className={`auth-toast ${toast.type === "error" ? "auth-toast-error" : "auth-toast-success"}`}>
          {toast.message}
        </div>
      )}

      <BrandPanel />

      <div className="auth-right-panel">
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
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Selamat Datang</h2>
              <p className="auth-form-subtitle">Silakan login untuk melanjutkan</p>
            </div>
            <div className="auth-form-body">
              <button onClick={() => setIsLoginModalOpen(true)} className="auth-btn-primary">Masuk</button>
              <p className="auth-switch">
                Belum punya akun?{" "}
                <button onClick={() => setIsRegisterModalOpen(true)} className="auth-switch-link">Daftar di sini</button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
