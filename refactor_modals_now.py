import os
import re

main_app_path = '/Users/ujang/Startup/Accountant/client/src/MainApp.jsx'

with open(main_app_path, 'r') as f:
    content = f.read()

# We need to find the start of the modals section.
# The modals start with `{isModalOpen && (` at line 2278.
# And end with the SettingsModal at line 3235.
# Let's use a regex to capture the entire block.

start_str = "        {isModalOpen && ("
# The settings modal ends with:
#                 </form>
#               </div>
#             </div>
#           </div>
#         )}
# We'll find the start_str, and the last `)}` before the closing `</div>` of the App.

start_idx = content.find(start_str)
last_div = content.rfind("      </div>")
end_idx = content.rfind("        )}", start_idx, last_div) + 10

if start_idx == -1 or end_idx == -1:
    print("Could not find bounds")
    exit(1)

modals_block = content[start_idx:end_idx]

# We will replace the modals_block with component calls.
replacement = """
        <TransactionModal 
          isOpen={isModalOpen}
          isPinStep={isPinStep}
          form={form}
          pin={pin}
          pinError={pinError}
          pinMode={pinMode}
          submitting={submitting}
          resetPinFlow={resetPinFlow}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handlePinInput={handlePinInput}
          pinDescriptions={pinDescriptions}
        />

        <DeleteConfirmModal 
          isOpen={isDeleteConfirmOpen}
          isPinStep={isPinStep}
          pin={pin}
          pinError={pinError}
          deleting={deleting}
          deleteTarget={deleteTarget}
          resetPinFlow={resetPinFlow}
          handleDelete={handleDelete}
          handlePinInput={handlePinInput}
        />

        <ExportPinModal 
          isOpen={isExportPinOpen}
          pin={pin}
          pinError={pinError}
          exporting={exporting}
          setPin={setPin}
          setPinError={setPinError}
          setIsExportPinOpen={setIsExportPinOpen}
          handlePinInput={handlePinInput}
        />

        <ImportFileModal 
          isOpen={isImportFileOpen}
          importFile={importFile}
          importPreview={importPreview}
          setImportFile={setImportFile}
          setIsImportFileOpen={setIsImportFileOpen}
          handleImportFileChange={handleImportFileChange}
          handleProcessImport={handleProcessImport}
        />

        <ImportPinModal 
          isOpen={isImportPinOpen}
          pin={pin}
          pinError={pinError}
          importing={importing}
          setPin={setPin}
          setPinError={setPinError}
          setIsImportPinOpen={setIsImportPinOpen}
          handlePinInput={handlePinInput}
        />

        <LogoutConfirmModal 
          isOpen={isLogoutConfirmOpen}
          setIsLogoutConfirmOpen={setIsLogoutConfirmOpen}
          handleLogout={handleLogout}
        />

        <SettingsModal 
          isOpen={isSettingsOpen}
          settingsForm={settingsForm}
          settingsError={settingsError}
          settingsLoading={settingsLoading}
          setSettingsForm={setSettingsForm}
          setIsSettingsOpen={setIsSettingsOpen}
          handleSettingsSubmit={handleSettingsSubmit}
        />

        <DeleteUserConfirmModal 
          isOpen={isDeleteUserConfirmOpen}
          deleteUserTarget={deleteUserTarget}
          setIsDeleteUserConfirmOpen={setIsDeleteUserConfirmOpen}
          handleConfirmDeleteUser={handleConfirmDeleteUser}
        />

        <EditUserModal 
          isOpen={isEditUserModalOpen}
          editUserForm={editUserForm}
          adminLoading={adminLoading}
          setEditUserForm={setEditUserForm}
          setIsEditUserModalOpen={setIsEditUserModalOpen}
          handleSaveUserEdit={handleSaveUserEdit}
        />

        <AddUserModal 
          isOpen={isAddUserModalOpen}
          addUserForm={addUserForm}
          addUserError={addUserError}
          addUserLoading={addUserLoading}
          setAddUserForm={setAddUserForm}
          setIsAddUserModalOpen={setIsAddUserModalOpen}
          handleAddUser={handleAddUser}
        />
"""

new_content = content[:start_idx] + replacement + content[end_idx:]

# Also add the imports at the top
imports = """
import { TransactionModal } from "./components/modals/TransactionModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import { DeleteConfirmModal, LogoutConfirmModal, DeleteUserConfirmModal } from "./components/modals/ConfirmModals";
import { ImportFileModal, ImportPinModal, ExportPinModal } from "./components/modals/ImportExportModals";
import { EditUserModal, AddUserModal } from "./components/modals/UserModals";
"""

# Insert after first import
first_import_end = new_content.find(";") + 1
new_content = new_content[:first_import_end] + imports + new_content[first_import_end:]

with open(main_app_path, 'w') as f:
    f.write(new_content)

print("MainApp updated")
