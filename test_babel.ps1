$html = Get-Content 'c:\DIPAS\index.html' -Raw
$start = $html.IndexOf('<script type="text/babel"')
if ($start -ge 0) {
  $tagEnd = $html.IndexOf('>', $start)
  $end = $html.IndexOf('</script>', $tagEnd)
  $js = $html.Substring($tagEnd + 1, $end - ($tagEnd + 1))
  Write-Host "JS length:" $js.Length

  # Check duplicate function names
  $funcMatches = [regex]::Matches($js, 'function\s+([A-Za-z0-9_]+)')
  $funcNames = @{}
  foreach ($m in $funcMatches) {
    $name = $m.Groups[1].Value
    if ($funcNames.ContainsKey($name)) {
      Write-Host "DUPLICATE FUNCTION:" $name
    } else {
      $funcNames[$name] = 1
    }
  }

  # Check duplicate const names
  $constMatches = [regex]::Matches($js, '(?:^|\n)\s*const\s+([A-Za-z0-9_]+)\s*=')
  $constNames = @{}
  foreach ($m in $constMatches) {
    $name = $m.Groups[1].Value
    if ($constNames.ContainsKey($name)) {
      Write-Host "DUPLICATE TOP-LEVEL CONST:" $name
    } else {
      $constNames[$name] = 1
    }
  }
}
