$views = @(
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
)

$combined = ""
foreach ($v in $views) {
  $file = "c:\DIPAS\src\components\views\$v"
  if (Test-Path $file) {
    $raw = Get-Content $file -Raw
    $lines = $raw -split "\r?\n"
    $cleanLines = @()
    $inImport = $false

    foreach ($line in $lines) {
      if ($line -match '^\s*import\s') {
        if ($line -match ';\s*$') {
          $inImport = $false
        } else {
          $inImport = $true
        }
        continue
      }
      if ($inImport) {
        if ($line -match ';\s*$') {
          $inImport = $false
        }
        continue
      }

      $cleanLine = $line -replace 'export\s+default\s+function', 'function'
      $cleanLine = $cleanLine -replace 'export\s+function', 'function'
      $cleanLine = $cleanLine -replace 'export\s+const', 'const'
      $cleanLine = $cleanLine -replace 'export\s+let', 'let'
      
      $cleanLines += $cleanLine
    }

    $cleanText = $cleanLines -join "`n"
    $combined += "`n`n// --- FROM $v ---`n" + $cleanText
  }
}

# Remove any top-level duplicate constants from combined if they exist
# Write combined_views.js
$combined | Out-File "c:\DIPAS\combined_views.js" -Encoding utf8
Write-Host "Combined views size:" $combined.Length
