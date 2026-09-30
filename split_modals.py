import re
import os

with open('/Users/ujang/Startup/Accountant/client/src/MainApp.jsx', 'r') as f:
    lines = f.readlines()

def find_modal_start(lines, search_str):
    for i, line in enumerate(lines):
        if search_str in line:
            return i
    return -1

def find_matching_brace(lines, start_idx):
    count = 0
    in_block = False
    for i in range(start_idx, len(lines)):
        line = lines[i]
        count += line.count('{')
        count -= line.count('}')
        if not in_block and line.count('{') > 0:
            in_block = True
        if in_block and count == 0:
            return i
    return -1

# Let's just output the exact lines
modals = [
    ("Transaction Modal", "{isModalOpen && ("),
    ("Delete Confirm", "{isDeleteConfirmOpen && ("),
    ("Export PIN", "{isExportPinOpen && ("),
    ("Import PIN", "{isImportPinOpen && ("),
    ("Import File", "{isImportFileOpen && ("),
    ("Logout Confirm", "{isLogoutConfirmOpen && ("),
    ("Settings Modal", "{isSettingsOpen && ("),
    ("Delete User Confirm", "{isDeleteUserConfirmOpen && ("),
    ("Edit User", "{isEditUserModalOpen && ("),
    ("Add User", "{isAddUserModalOpen && (")
]

for name, search in modals:
    start = find_modal_start(lines, search)
    if start != -1:
        # We need to find where the outermost `{...}` or `&& (...)` ends.
        # But this is a bit complex in python.
        print(f"{name} starts at line {start + 1}")
