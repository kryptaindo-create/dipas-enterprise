$content = [System.IO.File]::ReadAllText('c:\DIPAS\index.html')
$start = $content.IndexOf('<script type="text/babel"')
$tagEnd = $content.IndexOf('>', $start)
$end = $content.IndexOf('</script>', $tagEnd)
$js = $content.Substring($tagEnd + 1, $end - ($tagEnd + 1))

$oc = 0; $cc = 0; $op = 0; $cp = 0; $ob = 0; $cb = 0
for ($i = 0; $i -lt $js.Length; $i++) {
  $ch = $js[$i]
  if ($ch -eq '{') { $oc++ }
  elseif ($ch -eq '}') { $cc++ }
  elseif ($ch -eq '(') { $op++ }
  elseif ($ch -eq ')') { $cp++ }
  elseif ($ch -eq '[') { $ob++ }
  elseif ($ch -eq ']') { $cb++ }
}

Write-Host "Curly brackets { }: $oc vs $cc"
Write-Host "Parentheses ( ): $op vs $cp"
Write-Host "Square brackets [ ]: $ob vs $cb"
