import glob

for file in glob.glob('/Users/ujang/Startup/Accountant/client/src/components/modals/*.jsx'):
    with open(file, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    seen_react = False
    for line in lines:
        if line.startswith("import React"):
            if not seen_react:
                new_lines.append(line)
                seen_react = True
        elif line.startswith("import { LoadingButton"):
            if new_lines.count(line) == 0:
                new_lines.append(line)
        elif line.startswith("import { inputClasses"):
            if new_lines.count(line) == 0:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    with open(file, 'w') as f:
        f.writelines(new_lines)

