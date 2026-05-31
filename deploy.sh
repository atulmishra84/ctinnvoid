#!/bin/bash
set -e
echo "=== CTInnvoID Deploy Script ==="

# 1. Copy latest file
cp ~/Downloads/ctinnvoid.jsx ctinnvoid-frontend/src/App.jsx

# 2. Fix localhost URL
sed -i '' 's|http://localhost:3001/api|/api|g' ctinnvoid-frontend/src/App.jsx

# 3. Fix split newlines
python3 -c "
with open('ctinnvoid-frontend/src/App.jsx','rb') as f:
    raw = f.read()
raw = raw.replace(b'split(\"\n\")', b'split(\"\\\\n\")')
with open('ctinnvoid-frontend/src/App.jsx','wb') as f:
    f.write(raw)
print('Split fixed')
"

# 4. Fix extraInstruction broken strings
python3 -c "
with open('ctinnvoid-frontend/src/App.jsx','r') as f:
    lines = f.readlines()
i = 0
while i < len(lines):
    line = lines[i]
    if 'extraInstruction' in line and ('extraInstruction\`' in line or ('extraInstruction=\"' in line and line.count('\"') % 2 != 0)):
        j = i + 1
        while j < len(lines) and not any(lines[j].strip().startswith(x) for x in ['if(','const ','let ','await ','const res']):
            lines[j] = ''
            j += 1
        if 'isCrud' in line:
            lines[i] = '      if(isCrud) extraInstruction=\`This is an identity CRUD request. Simulate and show a RESULT_CARD block.\`;\n'
        elif 'isSiem' in line:
            lines[i] = '      if(isSiem) extraInstruction=\`This is a SIEM query. Include a SIEM_ALERT block.\`;\n'
        elif 'isConfig' in line:
            lines[i] = '      if(isConfig) extraInstruction=\`This is a config request. Provide step-by-step instructions.\`;\n'
        print(f'Fixed extraInstruction line {i+1}')
    i += 1
with open('ctinnvoid-frontend/src/App.jsx','w') as f:
    f.writelines(lines)
print('extraInstruction fixed')
"

# 5. Fix class names
python3 -c "
with open('ctinnvoid-frontend/src/App.jsx','r') as f:
    src = f.read()
pairs = [
    ('chat-wrap','cw'),('chat-topbar-left','cw-header-l'),('chat-topbar','cw-header'),
    ('chat-ai-avatar','cw-logo'),('chat-topbar-title','cw-title'),('chat-topbar-sub','cw-sub'),
    ('chat-body','cw-body'),('chat-sidebar-hd','cw-nav-section'),('chat-sidebar','cw-nav'),
    ('chat-main','cw-main'),('chat-messages','cw-msgs'),('chat-input-area','cw-footer'),
    ('chat-input-wrap','cw-footer'),('chat-suggestions','cw-suggestions'),
    ('chat-suggestion','cw-sug'),('chat-quick-row','cw-quick-row'),('chat-quick','cw-quick'),
    ('chat-input-row','cw-input-row'),('chat-input','cw-input'),('chat-send','cw-send'),
    ('chat-hint','cw-hint'),
]
for old,new in pairs:
    src = src.replace(f'className=\"{old}\"', f'className=\"{new}\"')
    src = src.replace(f'className={{\"chat-topic ', f'className={{\"cw-nav-item ')
with open('ctinnvoid-frontend/src/App.jsx','w') as f:
    f.write(src)
print('Class names fixed')
"

# 6. Build
echo "Building..."
cd ctinnvoid-frontend && npm run build 2>&1 | tail -5
cd ..

echo "=== Deploy complete ==="
