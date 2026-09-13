$port = 8088
$folder = "c:\DIPAS"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "DIPAS Robust Public Server running on port $port"

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)

            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrEmpty($requestLine)) { $client.Close(); continue }

            while ($true) {
                $h = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($h)) { break }
            }

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) { $client.Close(); continue }

            $rawPath = $parts[1].Split('?')[0]
            $relPath = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }
            $filePath = Join-Path $folder $relPath
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $filePath = Join-Path $folder "index.html"
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $hb = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($hb, 0, $hb.Length)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Flush()
            $client.Client.Shutdown([System.Net.Sockets.SocketShutdown]::Send)
        } catch {
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
