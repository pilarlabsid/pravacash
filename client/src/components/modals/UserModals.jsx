import React from 'react';
import { LoadingButton } from '../common/UIComponents';
import { inputClasses } from '../../constants';

export const EditUserModal = ({
  isOpen, editUserForm, adminLoading, selectedUser,
  setEditUserForm, setIsEditUserModalOpen, setSelectedUser,
  handleUpdateUser,
}) => {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Admin</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Edit User</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditUserModalOpen(false);
              setSelectedUser(null);
            }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-95"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              value={editUserForm.name}
              onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
              className={inputClasses}
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={editUserForm.email}
              onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
              className={inputClasses}
              placeholder="nama@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Role Pengguna</label>
            <select
              value={editUserForm.role}
              onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
              className={inputClasses}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditUserModalOpen(false);
                setSelectedUser(null);
              }}
              className="w-full sm:flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-98"
            >
              Batal
            </button>
            <LoadingButton
              type="submit"
              loading={adminLoading}
              className="w-full sm:flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
            >
              Simpan Perubahan
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};


export const AddUserModal = ({
  isOpen, addUserForm, addUserError, addUserLoading,
  setAddUserForm, setAddUserError, setIsAddUserModalOpen,
  handleAddUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl">
        {/* Mobile handle indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden" />

        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Admin</p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tambah User Baru</h2>
          </div>
          <button
            type="button"
            onClick={() => { setIsAddUserModalOpen(false); setAddUserError(""); }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-95"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              value={addUserForm.name}
              onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
              className={inputClasses}
              placeholder="Nama Lengkap"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={addUserForm.email}
              onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
              className={inputClasses}
              placeholder="nama@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={addUserForm.password}
              onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
              className={inputClasses}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-700">Role Pengguna</label>
            <select
              value={addUserForm.role}
              onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
              className={inputClasses}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {addUserError && (
            <p className="text-sm font-semibold text-rose-500">{addUserError}</p>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => { setIsAddUserModalOpen(false); setAddUserError(""); }}
              className="w-full sm:flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-98"
            >
              Batal
            </button>
            <LoadingButton
              type="submit"
              loading={addUserLoading}
              className="w-full sm:flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-teal-700 active:scale-98"
            >
              Buat User
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
