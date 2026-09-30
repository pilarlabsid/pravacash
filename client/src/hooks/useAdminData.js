import { useState, useCallback, useEffect } from "react";
import { getApiUrl } from "./useApi";

export const useAdminData = ({ token, user, setToast }) => {
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminTransactions, setAdminTransactions] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState({ name: "", email: "", role: "user" });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  const getHeaders = () => {
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  };

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const fetchAdminStats = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/stats`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Gagal memuat statistik admin.");
      setAdminStats(await res.json());
    } catch (e) { console.error("Failed to fetch admin stats:", e); throw e; }
  }, [token, isAdmin]);

  const fetchAdminUsers = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Gagal memuat data pengguna.");
      setAdminUsers(await res.json());
    } catch (e) { console.error("Failed to fetch admin users:", e); throw e; }
  }, [token, isAdmin]);

  const fetchAdminTransactions = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/transactions`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Gagal memuat data transaksi.");
      setAdminTransactions(await res.json());
    } catch (e) { console.error("Failed to fetch admin transactions:", e); throw e; }
  }, [token, isAdmin]);

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setEditUserForm({ name: userData.name, email: userData.email, role: userData.role || 'user' });
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!token || !selectedUser) return;
    setAdminLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/users/${selectedUser.id}`, {
        method: "PUT", headers: getHeaders(), body: JSON.stringify(editUserForm),
      });
      if (res.ok) {
        setToast({ type: "success", message: "User berhasil diperbarui." });
        setIsEditUserModalOpen(false);
        fetchAdminUsers();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.message || "Gagal memperbarui user." });
      }
    } catch { setToast({ type: "error", message: "Gagal memperbarui user." }); }
    finally { setAdminLoading(false); }
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserTarget(userId);
    setIsDeleteUserConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!token || !deleteUserTarget) return;
    setAdminLoading(true);
    setIsDeleteUserConfirmOpen(false);
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/users/${deleteUserTarget}`, {
        method: "DELETE", headers: getHeaders(),
      });
      if (res.ok) {
        setToast({ type: "success", message: "User berhasil dihapus." });
        fetchAdminUsers();
      } else {
        const data = await res.json();
        setToast({ type: "error", message: data.message || "Gagal menghapus user." });
      }
    } catch { setToast({ type: "error", message: "Gagal menghapus user." }); }
    finally { setAdminLoading(false); setDeleteUserTarget(null); }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!token) return;
    setAddUserLoading(true);
    setAddUserError("");
    try {
      const res = await fetch(`${getApiUrl()}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(addUserForm),
      });
      const data = await res.json();
      if (!res.ok) { setAddUserError(data.message || "Gagal membuat user."); return; }
      setToast({ type: "success", message: `User ${data.user.name} berhasil ditambahkan.` });
      setIsAddUserModalOpen(false);
      setAddUserForm({ name: "", email: "", password: "", role: "user" });
      fetchAdminUsers();
      fetchAdminStats();
    } catch { setAddUserError("Gagal membuat user. Coba lagi."); }
    finally { setAddUserLoading(false); }
  };

  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;
    setAdminLoading(true);
    setAdminError("");

    Promise.all([fetchAdminStats(), fetchAdminUsers(), fetchAdminTransactions()])
      .catch((error) => {
        if (!cancelled) setAdminError(error.message || "Gagal memuat halaman admin.");
      })
      .finally(() => {
        if (!cancelled) setAdminLoading(false);
      });

    return () => { cancelled = true; };
  }, [isAdmin, fetchAdminStats, fetchAdminUsers, fetchAdminTransactions]);

  return {
    adminStats, setAdminStats,
    adminUsers, setAdminUsers,
    adminTransactions, setAdminTransactions,
    adminLoading, adminError, adminTab, setAdminTab,
    selectedUser, setSelectedUser,
    isEditUserModalOpen, setIsEditUserModalOpen,
    editUserForm, setEditUserForm,
    isAddUserModalOpen, setIsAddUserModalOpen,
    addUserForm, setAddUserForm,
    addUserLoading, addUserError, setAddUserError,
    isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen,
    deleteUserTarget, setDeleteUserTarget,
    fetchAdminStats, fetchAdminUsers, fetchAdminTransactions,
    handleEditUser, handleUpdateUser, handleDeleteUser, confirmDeleteUser,
    handleAddUser,
  };
};
