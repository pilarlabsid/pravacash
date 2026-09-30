import { useState, useCallback } from "react";
import { getApiUrl } from "./useApi";

export const useAuth = ({ setToast, fetchEntries, fetchSettings, setIsAdminPage }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", name: "" });
  const [authError, setAuthError] = useState("");
  const [authFormLoading, setAuthFormLoading] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const performLogout = useCallback((silent = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsLogoutConfirmOpen(false);
    if (!silent) setToast({ type: "success", message: "Anda telah logout." });
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    if (setIsAdminPage) setIsAdminPage(false);
  }, [setToast, setIsAdminPage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthFormLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      // Keep the admin view state in sync immediately after a fresh login.
      // Previously this was only set after token verification, leaving the
      // admin flow dependent on a later refresh/reload.
      if (String(data.user.role || "").toLowerCase() === "admin") {
        setIsAdminPage?.(true);
      }
      setIsLoginModalOpen(false);
      setLoginForm({ email: "", password: "" });
      setToast({ type: "success", message: `Selamat datang, ${data.user.name}!` });
      fetchEntries?.();
      setTimeout(() => fetchSettings?.(), 100);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthFormLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthFormLoading(true);
    if (registerForm.password.length < 6) {
      setAuthError("Password minimal 6 karakter.");
      setAuthFormLoading(false);
      return;
    }
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      if (String(data.user.role || "").toLowerCase() === "admin") {
        setIsAdminPage?.(true);
      }
      setIsRegisterModalOpen(false);
      setRegisterForm({ email: "", password: "", name: "" });
      setToast({ type: "success", message: `Akun berhasil dibuat, ${data.user.name}!` });
      fetchEntries?.();
      setTimeout(() => fetchSettings?.(), 100);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthFormLoading(false);
    }
  };

  const handleLogout = () => setIsLogoutConfirmOpen(true);
  const confirmLogout = () => performLogout();

  return {
    user, setUser,
    token, setToken,
    isAuthenticated, setIsAuthenticated,
    authLoading, setAuthLoading,
    isLoginModalOpen, setIsLoginModalOpen,
    isRegisterModalOpen, setIsRegisterModalOpen,
    loginForm, setLoginForm,
    registerForm, setRegisterForm,
    authError, setAuthError,
    authFormLoading,
    isLogoutConfirmOpen, setIsLogoutConfirmOpen,
    performLogout, handleLogin, handleRegister,
    handleLogout, confirmLogout,
  };
};
