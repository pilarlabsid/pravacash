import { useState, useCallback } from "react";
import { getApiUrl } from "./useApi";

export const useSettings = ({ token, isAuthenticated, user, setUser, setToast, authenticatedFetch }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ name: "", email: "", pinEnabled: false });
  const [settingsForm, setSettingsForm] = useState({ name: "", email: "", pin: "", pinEnabled: false });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchSettings = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    try {
      const response = await fetch(`${getApiUrl()}/api/user/settings`, {
        headers: { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) }
      });
      if (response.status === 401) return; // let useAuth handle this
      if (response.ok) {
        const data = await response.json();
        setSettings({ name: data.name, email: data.email, pinEnabled: data.pinEnabled || false });
        setSettingsForm(prev => ({ ...prev, name: data.name, email: data.email, pinEnabled: data.pinEnabled || false }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  }, [token, isAuthenticated]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError("");
    try {
      const response = await authenticatedFetch(`${getApiUrl()}/api/user/profile`, {
        method: "PUT", body: JSON.stringify({ name: settingsForm.name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memperbarui profile.");
      setUser({ ...user, name: data.name, email: data.email });
      setSettings({ ...settings, name: data.name, email: data.email });
      setToast({ type: "success", message: "Profile berhasil diperbarui." });
    } catch (error) {
      setSettingsError(error.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    setSettingsLoading(true);
    try {
      const response = await authenticatedFetch(`${getApiUrl()}/api/user/password`, {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memperbarui password.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setToast({ type: "success", message: "Password berhasil diperbarui." });
    } catch (error) {
      setPasswordError(error.message || "Gagal memperbarui password.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError("");
    if (settingsForm.pinEnabled && settingsForm.pin) {
      if (settingsForm.pin.length !== 4 || !/^\d{4}$/.test(settingsForm.pin)) {
        setSettingsError("PIN harus berupa 4 digit angka.");
        setSettingsLoading(false);
        return;
      }
    }
    try {
      const response = await authenticatedFetch(`${getApiUrl()}/api/user/pin`, {
        method: "PUT", body: JSON.stringify({ pin: settingsForm.pinEnabled ? settingsForm.pin : null, pinEnabled: settingsForm.pinEnabled })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memperbarui PIN.");
      setSettings({ ...settings, pinEnabled: data.pinEnabled });
      setSettingsForm({ ...settingsForm, pin: "" });
      setToast({ type: "success", message: data.message || "Pengaturan PIN berhasil diperbarui." });
    } catch (error) {
      setSettingsError(error.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  return {
    isSettingsOpen, setIsSettingsOpen,
    settings, setSettings,
    settingsForm, setSettingsForm,
    passwordForm, setPasswordForm, passwordError,
    settingsLoading, settingsError, setSettingsError,
    fetchSettings, handleUpdateProfile, handleUpdatePassword, handleUpdatePin
  };
};
