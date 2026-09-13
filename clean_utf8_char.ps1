$utf8 = [System.Text.Encoding]::UTF8
$files = Get-ChildItem "c:\DIPAS\src\components\views\*.jsx"

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)

  # Replace distorted arrows
  $text = [regex]::Replace($text, 'â†[═\s]*', '← ')
  $text = [regex]::Replace($text, 'å†[═\s]*', '← ')
  $text = [regex]::Replace($text, 'Ã¢â‚¬[^\s<"]*', '')
  $text = [regex]::Replace($text, 'Â²', '²')
  $text = [regex]::Replace($text, 'âœ“', '✓')
  $text = [regex]::Replace($text, 'âœ•', '✕')

  [System.IO.File]::WriteAllText($f.FullName, $text, $utf8)
  Write-Host ("Cleaned UTF8 char for " + $f.Name)
}
