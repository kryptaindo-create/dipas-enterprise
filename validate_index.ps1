$content = Get-Content 'c:\DIPAS\index.html' -Raw

$start = $content.IndexOf('<script type="text/babel"')
$tagEnd = $content.IndexOf('>', $start)
$end = $content.IndexOf('</script>', $tagEnd)
$js = $content.Substring($tagEnd + 1, $end - ($tagEnd + 1))

Write-Host "Checking script character count:" $js.Length

# Check bracket counts
$openCurly = ($js.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$closeCurly = ($js.ToCharArray() | Where-Object { $_ -eq '}' }).Count
Write-Host "Curly brackets { }: $openCurly vs $closeCurly"

$openParen = ($js.ToCharArray() | Where-Object { $_ -eq '(' }).Count
$closeParen = ($js.ToCharArray() | Where-Object { $_ -eq ')' }).Count
Write-Host "Parentheses ( ): $openParen vs $closeParen"

$openBracket = ($js.ToCharArray() | Where-Object { $_ -eq '[' }).Count
$closeBracket = ($js.ToCharArray() | Where-Object { $_ -eq ']' }).Count
Write-Host "Square brackets [ ]: $openBracket vs $closeBracket"

if ($openCurly -ne $closeCurly -or $openParen -ne $closeParen -or $openBracket -ne $closeBracket) {
  Write-Host "CRITICAL ERROR: UNBALANCED BRACKETS DETECTED IN SCRIPT!"
} else {
  Write-Host "All brackets balanced successfully!"
}
