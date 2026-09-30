import os

def extract_modals():
    with open('/Users/ujang/Startup/Accountant/client/src/MainApp.jsx', 'r') as f:
        lines = f.readlines()

    def get_block(start_idx):
        count = 0
        in_block = False
        for i in range(start_idx, len(lines)):
            line = lines[i]
            count += line.count('{')
            count -= line.count('}')
            if not in_block and line.count('{') > 0:
                in_block = True
            if in_block and count <= 0:
                return i
        return -1

    modals = [
        ("isModalOpen", "TransactionModal"),
        ("isDeleteConfirmOpen", "DeleteConfirmModal"),
        ("isExportPinOpen", "ExportPinModal"),
        ("isImportPinOpen", "ImportPinModal"),
        ("isImportFileOpen", "ImportFileModal"),
        ("isLogoutConfirmOpen", "LogoutConfirmModal"),
        ("isDeleteUserConfirmOpen", "DeleteUserConfirmModal"),
        ("isEditUserModalOpen", "EditUserModal"),
        ("isAddUserModalOpen", "AddUserModal"),
        ("isSettingsOpen", "SettingsModal")
    ]

    replacements = []
    
    for search, comp_name in modals:
        for i, line in enumerate(lines):
            if f"{{{search} && (" in line:
                start_idx = i
                end_idx = get_block(start_idx)
                if end_idx != -1:
                    content = "".join(lines[start_idx:end_idx+1])
                    replacements.append({
                        "search": search,
                        "comp_name": comp_name,
                        "start": start_idx,
                        "end": end_idx,
                        "content": content
                    })
                break

    # We will just print the boundaries and check if it worked
    for r in replacements:
        print(f"Found {r['comp_name']} from {r['start']} to {r['end']}")

if __name__ == "__main__":
    extract_modals()
