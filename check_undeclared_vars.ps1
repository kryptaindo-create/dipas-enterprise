$files = Get-ChildItem "c:\DIPAS\src\components\views\*.jsx"

foreach ($f in $files) {
  $text = Get-Content $f.FullName -Raw
  $setters = [regex]::Matches($text, 'setIs([A-Za-z0-9_]+)\(')
  
  $uniqueSetters = @{}
  foreach ($m in $setters) {
    $name = $m.Groups[1].Value
    $uniqueSetters[$name] = 1
  }

  foreach ($s in $uniqueSetters.Keys) {
    $decl = "setIs$s"
    if ($text -notmatch "const\s*\[\s*is$s\s*,\s*setIs$s\s*\]") {
      Write-Host "MISSING STATE DECLARATION in $($f.Name): is$s / setIs$s"
    }
  }
}
