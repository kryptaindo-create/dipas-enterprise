import re

with open(r'c:\DIPAS\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_idx = html.find('<script type="text/babel">')
end_idx = html.find('</script>', start_idx)

js_code = html[start_idx + len('<script type="text/babel">'):end_idx]

print(f"JS code length: {len(js_code)}")

# Check for import statements
imports = re.findall(r'import\s+[\s\S]*?from\s+[\'"].*?[\'"];?', js_code)
print(f"Imports found: {len(imports)}")
for imp in imports[:10]:
    print("IMPORT:", imp)

# Check for export statements
exports = re.findall(r'export\s+[\s\S]*?;', js_code)
print(f"Exports found: {len(exports)}")

# Check for used Lucide icons vs declared
used_icons = set(re.findall(r'<([A-Z][a-zA-Z0-9]+)\s', js_code))
print(f"Used JSX components/icons count: {len(used_icons)}")

declared_funcs = set(re.findall(r'function\s+([A-Z][a-zA-Z0-9]+)\b', js_code))
declared_consts = set(re.findall(r'const\s+([A-Z][a-zA-Z0-9]+)\b', js_code))
all_declared = declared_funcs.union(declared_consts)

missing = used_icons - all_declared
print(f"Missing JSX components: {missing}")
