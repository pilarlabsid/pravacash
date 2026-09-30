import sys
import re

with open('/Users/ujang/Startup/Accountant/client/src/App.jsx', 'r') as f:
    lines = f.readlines()

app_start_idx = -1
return_idx = -1

for i, line in enumerate(lines):
    if line.startswith("function App() {"):
        app_start_idx = i
    if line.startswith("  return (") and i > 1500: # The main return is far down
        return_idx = i
        break

if app_start_idx == -1 or return_idx == -1:
    print("Could not find boundaries")
    sys.exit(1)

# The logic is from app_start_idx + 1 to return_idx
app_logic_lines = lines[app_start_idx + 1 : return_idx]

# We want to capture all states and functions to pass them as props to AppUI.
# A simple way: extract all top-level const, let, function names.
props = []
for line in app_logic_lines:
    match = re.match(r'^\s*const \[(.*?),\s*(.*?)\] = useState', line)
    if match:
        props.append(match.group(1))
        props.append(match.group(2))
    
    match = re.match(r'^\s*const ([a-zA-Z0-9_]+) = ', line)
    if match:
        if match.group(1) not in ["getApiUrl"]: # exclude some internal ones if needed
            props.append(match.group(1))
            
    match = re.match(r'^\s*function ([a-zA-Z0-9_]+)', line)
    if match:
        props.append(match.group(1))
        
    match = re.match(r'^\s*const ([a-zA-Z0-9_]+)Ref = useRef', line)
    if match:
        props.append(match.group(1) + "Ref")
        
# Deduplicate and sort
props = sorted(list(set(props)))

# There are hundreds of props. It might be better to just pass everything in an object `state`.
# But wait, creating a massive hook is better.
print("Found props count:", len(props))
