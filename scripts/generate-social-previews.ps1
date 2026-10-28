# Run from the repository root on Windows. Keep the original dark homepage preview.
$ErrorActionPreference = 'Stop'
$previewDirectory = Join-Path (Get-Location) 'public/social'
[IO.Directory]::CreateDirectory($previewDirectory) | Out-Null
Copy-Item -LiteralPath (Join-Path (Get-Location) 'public/og-design-engineer.jpg') -Destination (Join-Path $previewDirectory 'home.jpg') -Force
