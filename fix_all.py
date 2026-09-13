import os
import re

views_dir = r"c:\DIPAS\src\components\views"
views_files = [
    'MasterPedagangView.jsx',
    'PotensiPasarView.jsx',
    'TargetRealisasiView.jsx',
    'SiptbView.jsx',
    'LaporanPembayaranView.jsx',
    'InputPembayaranLapanganView.jsx',
    'LogAktivitasITView.jsx',
    'UserManagementITView.jsx',
    'AuditTransparansiView.jsx',
    'IzinPihakTigaView.jsx',
    'PengunjukanPenegakanView.jsx',
    'PotensiOkupansiView.jsx'
]

combined_code = ""

for vf in views_files:
    filepath = os.path.join(views_dir, vf)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove import statements
        content = re.sub(r'import\s+[\s\S]*?;\r?\n', '', content)
        
        # Remove export default function -> function
        content = re.sub(r'export\s+default\s+function', 'function', content)
        content = re.sub(r'export\s+function', 'function', content)
        content = re.sub(r'export\s+const', 'const', content)
        content = re.sub(r'export\s+let', 'let', content)
        
        combined_code += f"\n\n// --- FROM {vf} ---\n" + content

# Check for duplicate top-level constants in combined_code that might collide with index.html
# e.g., INFORMAL_SERVICES, VEHICLE_TYPES, TOILET_SERVICES
# If they are already in combined_code, we don't need them twice in index.html header!

print("Combined views length:", len(combined_code))

with open(r"c:\DIPAS\combined_views.js", "w", encoding="utf-8") as f:
    f.write(combined_code)

print("Saved combined_views.js successfully.")
