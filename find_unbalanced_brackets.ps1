$lines = Get-Content 'c:\DIPAS\index.html'
$balance = 0
$lineNum = 0
foreach ($line in $lines) {
  $lineNum++
  for ($i = 0; $i -lt $line.Length; $i++) {
    if ($line[$i] -eq '[') { $balance++ }
    if ($line[$i] -eq ']') { 
      $balance-- 
      if ($balance -lt 0) {
        Write-Host ("NEGATIVE BALANCE at Line " + $lineNum + ": " + $line)
      }
    }
  }
}
Write-Host ("Final balance: " + $balance)
