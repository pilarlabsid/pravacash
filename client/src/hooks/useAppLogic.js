import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getApiUrl, useAuthenticatedFetch } from "./useApi";
import { useAuth } from "./useAuth";
import { useSettings } from "./useSettings";
import { usePin } from "./usePin";
import { useTransactions } from "./useTransactions";
import { useAdminData } from "./useAdminData";

const safeJson = async (response) => {
  try { return await response.json(); } catch { return {}; }
};

export const useAppLogic = () => {
  const [toast, setToast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Auth Hook
  const {
    user, setUser, token, setToken, isAuthenticated, setIsAuthenticated,
    authLoading, setAuthLoading, isLoginModalOpen, setIsLoginModalOpen,
    isRegisterModalOpen, setIsRegisterModalOpen, loginForm, setLoginForm,
    registerForm, setRegisterForm, authError, setAuthError,
    authFormLoading, isLogoutConfirmOpen, setIsLogoutConfirmOpen,
    performLogout, handleLogin, handleRegister, handleLogout, confirmLogout
  } = useAuth({ setToast, setIsAdminPage });

  // authenticatedFetch
  const authenticatedFetch = useAuthenticatedFetch(token, () => performLogout(true));

  // 2. Settings Hook
  const {
    isSettingsOpen, setIsSettingsOpen, settings, setSettings,
    settingsForm, setSettingsForm, settingsLoading, settingsError, setSettingsError,
    fetchSettings, handleUpdateProfile, handleUpdatePin
  } = useSettings({ token, isAuthenticated, user, setUser, setToast, authenticatedFetch });

  // 3. Admin Data Hook
  const adminHook = useAdminData({ token, user, setToast });

  // 4. Pin Hook
  const {
    pinMode, setPinMode, isPinStep, setIsPinStep, pin, setPin,
    pinError, setPinError, validatePin, resetPinFlow, handlePinInput, handlePinBack
  } = usePin({ token, settings, setToast, performLogout });

  // 5. Transactions Hook
  const txHook = useTransactions({ token, isAuthenticated, settings, setToast, authenticatedFetch });

  // ─── INITIALIZATION ──────────────────────────────────────────────────────────
  const hasVerified = useRef(false);
  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyToken = async () => {
      if (!token) {
        setAuthLoading(false);
        setIsLoginModalOpen(true);
        return;
      }
      try {
        const response = await fetch(`${getApiUrl()}/api/auth/verify`, {
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });
        if (response.status === 401) { performLogout(true); setAuthLoading(false); return; }
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
          if (String(data.user.role || "").toLowerCase() === "admin") {
            setIsAdminPage(true);
          }
        } else {
          performLogout(true);
        }
      } catch {
        performLogout(true);
      } finally {
        setAuthLoading(false);
      }
    };
    verifyToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFetchedInitial = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || hasFetchedInitial.current) return;
    hasFetchedInitial.current = true;
    txHook.fetchEntries();
    fetchSettings();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedInitial.current = false;
    }
  }, [isAuthenticated]);

  // ─── WEBSOCKET ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const socketUrl = getApiUrl() || window.location.origin;
    const isProduction = !import.meta.env.DEV;
    const socket = io(socketUrl, {
      transports: isProduction ? ["polling"] : ["polling", "websocket"],
      upgrade: !isProduction,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: { token }
    });

    socket.on("transactions:updated", (transactions) => {
      txHook.setEntries((transactions ?? []).map(e => ({ ...e, amount: Number(e.amount) || 0 })));
    });

    if (String(user?.role || "").toLowerCase() === 'admin') {
      socket.on("admin:stats:updated", adminHook.setAdminStats);
      socket.on("admin:users:updated", adminHook.setAdminUsers);
      socket.on("admin:transactions:updated", adminHook.setAdminTransactions);
    }

    return () => socket.disconnect();
  }, [isAuthenticated, token, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── UI EFFECTS ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const shouldLock = txHook.isModalOpen || txHook.isConfirmOpen || txHook.isDeleteConfirmOpen;
    if (!shouldLock) { document.body.style.overflow = ""; return; }
    const handleKey = (e) => {
      if (e.key === "Escape") {
        txHook.setIsModalOpen(false);
        txHook.setIsConfirmOpen(false);
        txHook.setIsDeleteConfirmOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [txHook.isModalOpen, txHook.isConfirmOpen, txHook.isDeleteConfirmOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e) => { if (!e.target.closest('.relative')) setIsMenuOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  // ─── COMPUTED DATA ────────────────────────────────────────────────────────────
  const sortedEntries = useMemo(() => {
    return [...txHook.entries].sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date);
      if (diff !== 0) return diff;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [txHook.entries]);

  const runningEntries = useMemo(() => {
    let balance = 0;
    return [...sortedEntries].reverse().map(e => {
      balance += e.type === "income" ? e.amount : -e.amount;
      return { ...e, runningBalance: balance };
    }).reverse();
  }, [sortedEntries]);

  const totals = useMemo(() => {
    return runningEntries.reduce((acc, e) => {
      if (e.type === "income") acc.income += e.amount;
      else acc.expense += e.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    }, { income: 0, expense: 0, balance: 0 });
  }, [runningEntries]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────────
  const handleSubmitTx = async (e) => {
    e.preventDefault();
    if (isPinStep && ["delete", "reset", "export"].includes(pinMode ?? "")) return;

    const form = txHook.form;
    const payload = {
      description: (form.description || "").trim(),
      category: form.category || (form.type === "income" ? "Gaji" : "Makanan"),
      amount: form.amount ? Number(form.amount.toString().replace(/[^\d]/g, "")) : 0,
      type: form.type === "income" || form.type === "expense" ? form.type : "expense",
      date: form.date || new Date().toISOString().split('T')[0],
    };

    if (!isPinStep) {
      if (!payload.description) { setToast({ type: "error", message: "Uraian wajib diisi." }); return; }
      if (payload.amount <= 0 || Number.isNaN(payload.amount)) { setToast({ type: "error", message: "Nominal > 0." }); return; }
      if (!payload.date) { setToast({ type: "error", message: "Tanggal wajib diisi." }); return; }

      txHook.setPendingPayload(payload);
      if (settings.pinEnabled) {
        setIsPinStep(true);
        setPin(""); setPinError(""); setPinMode(txHook.editingTarget ? "edit" : "create");
        setTimeout(() => modalRef.current?.querySelector("input[name='pin']")?.focus(), 0);
        return;
      }
      setPinMode(txHook.editingTarget ? "edit" : "create");
    }

    const finalPayload = txHook.pendingPayload ?? payload;
    txHook.setSubmitting(true);
    try {
      if (settings.pinEnabled) {
        if (!(await validatePin())) { txHook.setSubmitting(false); return; }
      }
      if (txHook.editingTarget) {
        const res = await authenticatedFetch(`${getApiUrl()}/api/transactions/${txHook.editingTarget}`, { method: "PUT", body: JSON.stringify(finalPayload) });
        if (!res.ok) throw new Error((await safeJson(res)).message || "Gagal perbarui");
        setToast({ type: "success", message: "Transaksi diperbarui." });
      } else {
        const res = await authenticatedFetch(`${getApiUrl()}/api/transactions`, { method: "POST", body: JSON.stringify(finalPayload) });
        if (!res.ok) throw new Error((await safeJson(res)).message || "Gagal simpan");
        setToast({ type: "success", message: "Transaksi tersimpan!" });
      }
      txHook.setForm(txHook.createInitialForm({}, settings.timezone || "Asia/Jakarta"));
      txHook.fetchEntries();
      resetPinFlow();
      txHook.setIsModalOpen(false);
    } catch (err) { setToast({ type: "error", message: err.message }); }
    finally { txHook.setSubmitting(false); }
  };

  const confirmDeleteWithPin = async () => {
    if (settings.pinEnabled && !(await validatePin())) return;
    await txHook.requestDelete();
    resetPinFlow();
  };

  const confirmResetWithPin = async () => {
    if (settings.pinEnabled && !(await validatePin())) return;
    await txHook.handleReset();
    resetPinFlow();
  };

  const closeModal = () => { txHook.setIsModalOpen(false); resetPinFlow(); };
  const backFromPin = () => handlePinBack(txHook.setPendingPayload, txHook.setDeleteTarget);

  return {
    toast, currentTime, isMenuOpen, setIsMenuOpen, isAdminPage, setIsAdminPage, modalRef,
    user, isAuthenticated, authLoading, isLoginModalOpen, setIsLoginModalOpen,
    isRegisterModalOpen, setIsRegisterModalOpen, loginForm, setLoginForm,
    registerForm, setRegisterForm, authError, setAuthError, authFormLoading,
    isLogoutConfirmOpen, setIsLogoutConfirmOpen, handleLogin, handleRegister,
    handleLogout, confirmLogout,
    isSettingsOpen, setIsSettingsOpen, settings, settingsForm, setSettingsForm,
    settingsLoading, settingsError, setSettingsError, handleUpdateProfile, handleUpdatePin,
    adminHook, txHook,
    pinMode, setPinMode, isPinStep, setIsPinStep, pin, setPin, pinError, setPinError,
    validatePin, resetPinFlow, handlePinInput,
    sortedEntries, runningEntries, totals,
    handleSubmitTx, confirmDeleteWithPin, confirmResetWithPin, closeModal, backFromPin
  };
};
