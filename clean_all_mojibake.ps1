$utf8 = [System.Text.Encoding]::UTF8
$files = Get-ChildItem "c:\DIPAS\src\components\views\*.jsx"

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)

  $text = $text.Replace('â†', '&larr;')
  $text = $text.Replace('å†═', '&larr;')
  $text = $text.Replace('âœ“', '✓')
  $text = $text.Replace('âœ•', '✕')
  $text = $text.Replace('âš⚡', '⚡')
  $text = $text.Replace('âš', '⚡')
  $text = $text.Replace('ðŸ“', '📂')
  $text = $text.Replace('ðŸ“±', '📱')
  $text = $text.Replace('ðŸ”’', '🔒')
  $text = $text.Replace('ðŸ—“ï¸', '🗓️')
  $text = $text.Replace('mÂ²', 'm²')

  [System.IO.File]::WriteAllText($f.FullName, $text, $utf8)
  Write-Host ("Cleaned UTF8 for " + $f.Name)
}
