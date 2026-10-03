import React from 'react';
import { TransactionModal } from "./TransactionModal";
import { DeleteConfirmModal, LogoutConfirmModal, DeleteUserConfirmModal, ResetConfirmModal } from "./ConfirmModals";
import { SettingsModal } from "./SettingsModal";
import { ImportPinModal, ImportFileModal, ExportPinModal } from "./ImportExportModals";
import { AddUserModal, EditUserModal } from "./UserModals";

export const AppModals = ({
  txHook, adminHook, isPinStep, setIsPinStep, pin, setPin, pinError, setPinError, pinMode, setPinMode,
  settings, modalRef, handleSubmitTx, handlePinInput, closeModal, backFromPin, confirmResetWithPin,
  confirmDeleteWithPin, validatePin, runningEntries, resetPinFlow, isLogoutConfirmOpen, setIsLogoutConfirmOpen,
  confirmLogout, isSettingsOpen, setIsSettingsOpen, settingsForm, setSettingsForm, settingsError,
  setSettingsError, settingsLoading, passwordForm, setPasswordForm, passwordError,
  handleUpdateProfile, handleUpdatePassword, handleUpdatePin
}) => {
  return (
    <>
      <TransactionModal
        isOpen={txHook.isModalOpen || (isPinStep && (pinMode === 'delete' || pinMode === 'reset'))}
        isPinStep={isPinStep} form={txHook.form} pin={pin} pinError={pinError} pinMode={pinMode}
        submitting={txHook.submitting} deleting={txHook.deleting} exporting={txHook.exporting} resetting={txHook.resetting}
        settings={settings} editingTarget={txHook.editingTarget}
        modalRef={modalRef} modalTitle={txHook.editingTarget ? "Edit transaksi" : "Tambah data baru"} modalSubtitle={txHook.editingTarget ? "Perbarui detail transaksi dan simpan perubahan Anda." : "Nilai saldo akan diperbarui otomatis."}
        handleSubmit={handleSubmitTx} handleChange={txHook.handleChange} handlePinInput={handlePinInput}
        pinDescriptions={{ create: "Masukkan PIN untuk menyimpan.", edit: "Masukkan PIN untuk memperbarui.", delete: "Masukkan PIN untuk menghapus.", reset: "Masukkan PIN untuk mereset.", export: "Masukkan PIN untuk mengekspor.", import: "Masukkan PIN untuk mengimpor." }}
        closeModal={closeModal} handlePinBack={backFromPin}
        confirmResetWithPin={confirmResetWithPin} confirmDeleteWithPin={confirmDeleteWithPin} confirmExportWithPin={() => txHook.confirmExportWithPin(runningEntries, validatePin)}
      />

      <DeleteConfirmModal
        isOpen={txHook.isDeleteConfirmOpen} isPinStep={isPinStep} pin={pin} pinError={pinError} deleting={txHook.deleting} deleteTarget={txHook.deleteTarget}
        resetPinFlow={resetPinFlow} handleDelete={() => {
          if (settings.pinEnabled) { setIsPinStep(true); setPinMode("delete"); } else { txHook.requestDelete(); }
        }} handlePinInput={handlePinInput}
      />

      <ResetConfirmModal
        isOpen={txHook.isConfirmOpen} isPinStep={isPinStep} resetting={txHook.resetting}
        resetPinFlow={() => { txHook.setIsConfirmOpen(false); resetPinFlow(); }}
        handleReset={() => {
          if (settings.pinEnabled) { setIsPinStep(true); setPinMode("reset"); } else { txHook.handleReset(); }
        }}
      />

      <ExportPinModal
        isOpen={txHook.isExportPinOpen} pin={pin} pinError={pinError} exporting={txHook.exporting}
        setPin={setPin} setPinError={setPinError} setIsExportPinOpen={txHook.setIsExportPinOpen}
        handlePinInput={handlePinInput} closeExportPinModal={() => { txHook.setIsExportPinOpen(false); resetPinFlow(); }}
        confirmExportWithPin={() => txHook.confirmExportWithPin(runningEntries, validatePin)}
      />

      <ImportFileModal
        isOpen={txHook.isImportFileOpen} importFile={txHook.importFile} importPreview={txHook.importPreview} importing={txHook.importing}
        setImportFile={txHook.setImportFile} setIsImportFileOpen={txHook.setIsImportFileOpen}
        handleFileUpload={txHook.handleFileUpload} downloadImportTemplate={txHook.downloadImportTemplate} closeImportFileModal={() => { txHook.setIsImportFileOpen(false); txHook.setImportFile(null); txHook.setImportPreview([]); }}
      />

      <ImportPinModal
        isOpen={txHook.isImportPinOpen} pin={pin} pinError={pinError} importing={txHook.importing} importPreview={txHook.importPreview} settings={settings}
        setPin={setPin} setPinError={setPinError} setIsImportPinOpen={txHook.setIsImportPinOpen}
        handlePinInput={handlePinInput} closeImportPinModal={() => { txHook.setIsImportPinOpen(false); resetPinFlow(); }}
        confirmImportWithPin={() => txHook.confirmImportWithPin(validatePin)}
      />

      <LogoutConfirmModal isOpen={isLogoutConfirmOpen} setIsLogoutConfirmOpen={setIsLogoutConfirmOpen} handleLogout={confirmLogout} />

      <SettingsModal
        isOpen={isSettingsOpen} settingsForm={settingsForm} settingsError={settingsError} settingsLoading={settingsLoading} settings={settings}
        setSettingsForm={setSettingsForm} setIsSettingsOpen={setIsSettingsOpen} setSettingsError={setSettingsError}
        passwordForm={passwordForm} setPasswordForm={setPasswordForm} passwordError={passwordError}
        handleUpdateProfile={handleUpdateProfile} handleUpdatePassword={handleUpdatePassword} handleUpdatePin={handleUpdatePin}
      />

      <DeleteUserConfirmModal
        isOpen={adminHook.isDeleteUserConfirmOpen} deleteUserTarget={adminHook.deleteUserTarget} adminLoading={adminHook.adminLoading}
        setIsDeleteUserConfirmOpen={adminHook.setIsDeleteUserConfirmOpen} setDeleteUserTarget={adminHook.setDeleteUserTarget} handleConfirmDeleteUser={adminHook.confirmDeleteUser}
      />

      <EditUserModal
        isOpen={adminHook.isEditUserModalOpen} editUserForm={adminHook.editUserForm} adminLoading={adminHook.adminLoading} selectedUser={adminHook.selectedUser}
        setEditUserForm={adminHook.setEditUserForm} setIsEditUserModalOpen={adminHook.setIsEditUserModalOpen} setSelectedUser={adminHook.setSelectedUser} handleUpdateUser={adminHook.handleUpdateUser}
      />

      <AddUserModal
        isOpen={adminHook.isAddUserModalOpen} addUserForm={adminHook.addUserForm} addUserError={adminHook.addUserError} addUserLoading={adminHook.addUserLoading}
        setAddUserForm={adminHook.setAddUserForm} setAddUserError={adminHook.setAddUserError} setIsAddUserModalOpen={adminHook.setIsAddUserModalOpen} handleAddUser={adminHook.handleAddUser}
      />
    </>
  );
};
