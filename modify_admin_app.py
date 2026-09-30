import sys
import re

with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'r') as f:
    content = f.read()

start_str = "          {/* Admin Page - Auto show if user is admin */}"
end_str = "          {/* Normal Dashboard - Only for non-admin users */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx == -1 or end_idx == -1:
    print(f"Indices not found: start_idx={start_idx}, end_idx={end_idx}")
    sys.exit(1)

# Include the ending block `          )}` before the normal dashboard
end_bracket_idx = content.rfind("          )}\n", start_idx, end_idx)
if end_bracket_idx == -1:
    end_bracket_idx = end_idx # Just cut up to the Normal Dashboard comment if bracket is missing

replacement = """          <AdminSection
            user={user}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            adminLoading={adminLoading}
            adminStats={adminStats}
            adminUsers={adminUsers}
            adminTransactions={adminTransactions}
            expandedUsers={expandedUsers}
            setExpandedUsers={setExpandedUsers}
            expandedUserDetails={userDetailCache}
            toggleUserDetail={toggleUserDetail}
            onAddUserClick={() => { setAddUserForm({ name: "", email: "", password: "", role: "user" }); setAddUserError(""); setIsAddUserModalOpen(true); }}
            onEditUserClick={(u) => { setEditUserForm({ name: u.name, email: u.email, role: u.role }); setSelectedUser(u); setIsEditUserModalOpen(true); }}
            onDeleteUserClick={(u) => { setDeleteUserTarget(u); setIsDeleteUserConfirmOpen(true); }}
            settings={settings}
          />
\n"""

new_content = content[:start_idx] + replacement + content[end_bracket_idx + 13:]

with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'w') as f:
    f.write(new_content)
    
print("Replaced admin section successfully.")
