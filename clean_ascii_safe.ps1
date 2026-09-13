$utf8 = [System.Text.Encoding]::UTF8
$files = Get-ChildItem "c:\DIPAS\src\components\views\*.jsx"

$arrow = [char]0x2190
$check = [char]0x2713
$cross = [char]0x2715
$sup2  = [char]0x00B2

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)

  # Replace any corrupted byte sequence matching non-ASCII artifacts before "Beranda" or badges
  $text = [regex]::Replace($text, "[^\x00-\x7F]{1,6}\s*Beranda", ($arrow + " Beranda"))
  $text = [regex]::Replace($text, "[^\x00-\x7F]{1,6}\s*Buka", ("Buka"))
  $text = [regex]::Replace($text, "[^\x00-\x7F]{1,6}\s*Tutup", ("Tutup"))
  $text = [regex]::Replace($text, "[^\x00-\x7F]{1,6}\s*Dicabut", ("Dicabut"))
  $text = [regex]::Replace($text, "m[^\x00-\x7F]{1,3}\b", ("m" + $sup2))
  $text = [regex]::Replace($text, "m\^\s*2", ("m" + $sup2))

  [System.IO.File]::WriteAllText($f.FullName, $text, $utf8)
  Write-Host ("Cleaned file: " + $f.Name)
}
