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

$utf8 = [System.Text.Encoding]::UTF8
$combined = ""
foreach ($v in $views) {
  $file = "c:\DIPAS\src\components\views\$v"
  if (Test-Path $file) {
    $raw = [System.IO.File]::ReadAllText($file, $utf8)
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

[System.IO.File]::WriteAllText("c:\DIPAS\combined_views.js", $combined, $utf8)
Write-Host "Combined views size:" $combined.Length "UTF8 intact!"
