import os
import re

main_app_path = '/Users/ujang/Startup/Accountant/client/src/MainApp.jsx'

with open(main_app_path, 'r') as f:
    content = f.read()

def get_block(start_str):
    start_idx = content.find(start_str)
    if start_idx == -1: return ""
    count = 0
    in_block = False
    for i in range(start_idx, len(content)):
        char = content[i]
        if char == '{': count += 1
        elif char == '}': count -= 1
        
        if not in_block and char == '{':
            in_block = True
        
        if in_block and count <= 0:
            return content[start_idx:i+1]
    return ""

def create_component(name, props, block):
    # Remove the wrapper `{isOpen && (` and `)}` from the block.
    # The block looks like `{isModalOpen && (\n <div...>\n)}`
    
    # Strip leading/trailing
    block = block.strip()
    # Remove `{condition && (`
    start_paren = block.find('(')
    if start_paren != -1:
        block = block[start_paren+1:]
    # Remove trailing `)}`
    if block.endswith(')}'):
        block = block[:-2]
        
    block = block.strip()

    return f"""import React from 'react';
import {{ LoadingButton, Field }} from '../common/UIComponents';
import {{ inputClasses }} from '../../constants';

export const {name} = ({{ {', '.join(props)} }}) => {{
  if (!{props[0]}) return null;

  return (
    {block}
  );
}};
"""

# Definitions
modals = [
    {
        "file": "TransactionModal.jsx",
        "comps": [
            ("TransactionModal", ["isOpen", "isPinStep", "form", "pin", "pinError", "pinMode", "submitting", "resetPinFlow", "handleSubmit", "handleChange", "handlePinInput", "pinDescriptions"], "{isModalOpen && (")
        ]
    },
    {
        "file": "ConfirmModals.jsx",
        "comps": [
            ("DeleteConfirmModal", ["isOpen", "isPinStep", "pin", "pinError", "deleting", "deleteTarget", "resetPinFlow", "handleDelete", "handlePinInput"], "{isDeleteConfirmOpen && ("),
            ("LogoutConfirmModal", ["isOpen", "setIsLogoutConfirmOpen", "handleLogout"], "{isLogoutConfirmOpen && ("),
            ("DeleteUserConfirmModal", ["isOpen", "deleteUserTarget", "setIsDeleteUserConfirmOpen", "handleConfirmDeleteUser"], "{isDeleteUserConfirmOpen && (")
        ]
    },
    {
        "file": "ImportExportModals.jsx",
        "comps": [
            ("ExportPinModal", ["isOpen", "pin", "pinError", "exporting", "setPin", "setPinError", "setIsExportPinOpen", "handlePinInput"], "{isExportPinOpen && ("),
            ("ImportFileModal", ["isOpen", "importFile", "importPreview", "setImportFile", "setIsImportFileOpen", "handleImportFileChange", "handleProcessImport"], "{isImportFileOpen && ("),
            ("ImportPinModal", ["isOpen", "pin", "pinError", "importing", "setPin", "setPinError", "setIsImportPinOpen", "handlePinInput"], "{isImportPinOpen && (")
        ]
    },
    {
        "file": "UserModals.jsx",
        "comps": [
            ("EditUserModal", ["isOpen", "editUserForm", "adminLoading", "setEditUserForm", "setIsEditUserModalOpen", "handleSaveUserEdit"], "{isEditUserModalOpen && ("),
            ("AddUserModal", ["isOpen", "addUserForm", "addUserError", "addUserLoading", "setAddUserForm", "setIsAddUserModalOpen", "handleAddUser"], "{isAddUserModalOpen && (")
        ]
    },
    {
        "file": "SettingsModal.jsx",
        "comps": [
            ("SettingsModal", ["isOpen", "settingsForm", "settingsError", "settingsLoading", "setSettingsForm", "setIsSettingsOpen", "handleSettingsSubmit"], "{isSettingsOpen && (")
        ]
    }
]

out_dir = '/Users/ujang/Startup/Accountant/client/src/components/modals'

for group in modals:
    file_content = ""
    for name, props, search_str in group['comps']:
        block = get_block(search_str)
        comp_str = create_component(name, props, block)
        file_content += comp_str + "\n"
    
    with open(os.path.join(out_dir, group['file']), 'w') as f:
        f.write(file_content)
        
print("Generated component files")
