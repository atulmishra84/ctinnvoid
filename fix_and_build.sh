#!/bin/bash
cd ~/ctinnvoid-backend

# Step 1: Fix split newlines
python3 -c "
with open('ctinnvoid-frontend/src/App.jsx','rb') as f:
    raw = f.read()
raw = raw.replace(b'split(\"\n\")', b'split(\"\\\\n\")')
with open('ctinnvoid-frontend/src/App.jsx','wb') as f:
    f.write(raw)
"

# Step 2: Fix all extraInstruction broken lines
python3 -c "
with open('ctinnvoid-frontend/src/App.jsx','r') as f:
    lines = f.readlines()

i = 0
while i < len(lines):
    line = lines[i]
    if 'extraInstruction' in line and ('extraInstruction\`' in line or ('extraInstruction=\"' in line and line.count('\"') % 2 != 0)):
        # Clear next lines until we hit real code
        j = i + 1
        while j < len(lines) and not lines[j].strip().startswith('if(') and not lines[j].strip().startswith('const ') and not lines[j].strip().startswith('let ') and not lines[j].strip().startswith('await '):
            lines[j] = ''
            j += 1
        # Replace the broken line with clean version
        if 'isCrud' in line:
            lines[i] = '      if(isCrud) extraInstruction=\`This is an identity CRUD request. Simulate and show a RESULT_CARD block.\`;\n'
        elif 'isSiem' in line:
            lines[i] = '      if(isSiem) extraInstruction=\`This is a SIEM query. Include a SIEM_ALERT block.\`;\n'
        elif 'isConfig' in line:
            lines[i] = '      if(isConfig) extraInstruction=\`This is a config request. Provide step-by-step instructions.\`;\n'
        print(f'Fixed line {i+1}')
    i += 1

with open('ctinnvoid-frontend/src/App.jsx','w') as f:
    f.writelines(lines)
print('All fixed')
"

# Step 3: Build
cd ctinnvoid-frontend && npm run build 2>&1 | tail -6 && cd ..
