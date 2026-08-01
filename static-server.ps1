$root = $PSScriptRoot
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css"; ".js"="application/javascript";
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".svg"="image/svg+xml";
  ".ico"="image/x-icon"; ".json"="application/json"; ".woff2"="font/woff2"
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
  if ($path -eq "/") { $path = "/index.html" }
  $full = Join-Path $root ($path.TrimStart("/"))
  if (Test-Path $full -PathType Container) { $full = Join-Path $full "index.html" }
  if (Test-Path $full -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($full)
    $ct = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $res.ContentType = $ct
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.OutputStream.Close()
}
