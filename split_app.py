import re

with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'r') as f:
    content = f.read()

# We want to extract everything inside `function App() { ... }` up to the `return (`
# The return statement is at line ~1900.

# Find the start of function App() {
match_app_start = re.search(r'function App\(\) \{', content)
if not match_app_start:
    print("Could not find function App()")
    exit(1)

# Find the return statement
match_return = re.search(r'^\s*return \(\s*$', content, re.MULTILINE)
if not match_return:
    print("Could not find return (")
    exit(1)

imports = content[:match_app_start.start()]
app_logic = content[match_app_start.end():match_return.start()]
app_ui = content[match_return.start():content.rfind('}')] # up to the end of App function

print("App logic length:", len(app_logic))
print("App UI length:", len(app_ui))

