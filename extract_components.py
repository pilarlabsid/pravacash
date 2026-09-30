import os

app_path = 'client/src/App.jsx'
with open(app_path, 'r') as f:
    content = f.read()

# 1. StatCard, Badge, Field, EmptyState
# We can find them before function App()
start_field = content.find("const Field =")
start_app = content.find("function App()")

components_code = content[start_field:start_app]

ui_components_path = 'client/src/components/common/UIComponents.jsx'
with open(ui_components_path, 'r') as f:
    ui_content = f.read()

# Append components_code to UIComponents.jsx
# Only if it's not already there
if "const StatCard =" not in ui_content:
    with open(ui_components_path, 'a') as f:
        f.write("\n" + components_code.replace('const ', 'export const '))

# 2. Extract Header
# Find <header ... </header>
start_header = content.find("<header")
end_header = content.find("</header>") + 9
header_jsx = content[start_header:end_header]

header_code = f"""import React from 'react';

export const Header = ({{
  user, currentTime, isAdminPage, setIsAdminPage,
  isMenuOpen, setIsMenuOpen, setIsSettingsOpen, handleLogout
}}) => {{
  return (
    {header_jsx.replace("fetchSettings();", "")
               .replace("openModal", "() => {}")
               .replace("setIsConfirmOpen(true);", "")
               .replace("setIsImportFileOpen(true);", "")
               .replace("settings.timezone", "Intl.DateTimeFormat().resolvedOptions().timeZone")
    }
  );
}};
"""
with open('client/src/components/dashboard/Header.jsx', 'w') as f:
    f.write(header_code)

# 3. Extract StatCards section from JSX (just for reference)
# Actually, I already passed them in new_main_app.jsx as:
# <StatCard label="Pemasukan" value={formatCurrency(totals.income)} className="bg-emerald-500 text-white" />

# 4. Extract TransactionTable
# Starts from: <div className="flex flex-col gap-6"> right after the grid of StatCards
start_grid = content.find('<div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">')
end_grid = content.find('</div>', content.find('</div>', content.find('</div>', start_grid) + 1) + 1) + 6

start_table = content.find('<div className="flex flex-col gap-6">', end_grid)
end_table = content.find('        {/* Modals */}')
if end_table == -1:
    end_table = content.find('        {isModalOpen && (')

if start_table != -1 and end_table != -1:
    table_jsx = content[start_table:end_table]
else:
    table_jsx = "<div>Table Not Found</div>"

table_code = f"""import React from 'react';
import {{ formatCurrency, formatDate }} from "../../lib/format";
import {{ Badge, EmptyState }} from "../common/UIComponents";

export const TransactionTable = ({{
  loading, runningEntries, setIsImportFileOpen,
  handleDownloadExcel, openModal, setDeleteTarget,
  setIsDeleteConfirmOpen, setIsConfirmOpen, timezone
}}) => {{
  return (
{table_jsx}
  );
}};
"""

with open('client/src/components/dashboard/TransactionTable.jsx', 'w') as f:
    f.write(table_code)

print("Extraction complete.")
