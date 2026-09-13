$port = 8088
$folder = "c:\DIPAS"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "DIPAS Mobile Enterprise Web Server running at http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        $targetFile = Join-Path $folder $path.TrimStart('/')

        if (Test-Path $targetFile -PathType Leaf) {
            $localPath = $targetFile
        } else {
            $localPath = Join-Path $folder "index.html"
        }

        try {
            if (Test-Path $localPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($localPath)
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()

                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.Headers.Add("Pragma", "no-cache")
                $response.Headers.Add("Expires", "0")

                switch ($ext) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    default { $response.ContentType = "application/octet-stream" }
                }

                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
            }
        } catch {
            Write-Host "Error serving ${localPath}: $_"
        } finally {
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
