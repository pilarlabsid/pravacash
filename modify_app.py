import sys
import re

with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'r') as f:
    content = f.read()

# We want to replace the block starting at `{/* User Financial Charts */}`
# and ending after the `Daftar Transaksi` section.

# Let's find the exact indices
start_str = "{/* User Financial Charts */}"
end_str = "                  )}<br/>                </div><br/>              </section>"

start_idx = content.find(start_str)
if start_idx == -1:
    print("Start not found")
    sys.exit(1)

# Finding the end is a bit trickier because of whitespace.
# Let's just use regular expressions to replace the block.
# The block starts with `{/* User Financial Charts */}`
# and ends with the `</section>` after `histori arus kas`

pattern = re.compile(r'\{\/\* User Financial Charts \*\/}.*?Histori arus kas.*?<\/section>', re.DOTALL)
match = pattern.search(content)

if match:
    replacement = """{/* User Financial Charts */}
              <UserFinancialCharts entries={entries} totals={totals} />

              {/* User Transaction Table */}
              <UserTransactionTable 
                loading={loading}
                entries={entries}
                runningEntries={runningEntries}
                settings={settings}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />"""
    new_content = content[:match.start()] + replacement + content[match.end():]
    
    with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'w') as f:
        f.write(new_content)
    print("Replaced successfully.")
else:
    print("Pattern not found")
