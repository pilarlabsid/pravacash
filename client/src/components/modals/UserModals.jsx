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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Admin</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Edit User</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditUserModalOpen(false);
              setSelectedUser(null);
            }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
            <select
              value={editUserForm.role}
              onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
              className={inputClasses}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditUserModalOpen(false);
                setSelectedUser(null);
              }}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <LoadingButton
              type="submit"
              loading={adminLoading}
              className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
            >
              Simpan
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Admin</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tambah User Baru</h2>
          </div>
          <button
            type="button"
            onClick={() => { setIsAddUserModalOpen(false); setAddUserError(""); }}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Lengkap</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
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
            <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
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
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsAddUserModalOpen(false); setAddUserError(""); }}
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <LoadingButton
              type="submit"
              loading={addUserLoading}
              className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
            >
              Buat User
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
