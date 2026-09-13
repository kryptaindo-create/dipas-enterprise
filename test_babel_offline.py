import re

with open(r'c:\DIPAS\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<script type="text/babel"')
if start == -1:
    print("ERROR: <script type=\"text/babel\" not found!")
else:
    tag_end = html.find('>', start)
    end = html.find('</script>', tag_end)
    js = html[tag_end + 1:end]
    print(f"Babel script length: {len(js)} characters.")

    # Check for invalid characters or unescaped template literals
    # Check for duplicate function declarations
    funcs = re.findall(r'function\s+([A-Za-z0-9_]+)', js)
    print(f"Declared functions: {len(funcs)}")
    from collections import Counter
    counts = Counter(funcs)
    duplicates = [fn for fn, count in counts.items() if count > 1]
    print(f"Duplicate function names: {duplicates}")

    # Check for duplicate top level const declarations
    consts = re.findall(r'const\s+([A-Za-z0-9_]+)\s*=', js)
    const_counts = Counter(consts)
    dup_consts = [c for c, count in const_counts.items() if count > 1]
    print(f"Duplicate const names: {dup_consts}")
