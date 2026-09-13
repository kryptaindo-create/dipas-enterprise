$utf8 = [System.Text.Encoding]::UTF8
$lines = [System.IO.File]::ReadAllLines('c:\DIPAS\index.html', $utf8)

$lineNum = 0
foreach ($line in $lines) {
  $lineNum++
  if ($line -like '*Beranda*') {
    Write-Host ("LINE " + $lineNum + ": " + $line)
  }
}
