# Run from the repository root on Windows. Images are committed static assets.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$previewRoutes = node --input-type=module -e 'import {ROUTES} from "./src/discoverability/site.js"; console.log(JSON.stringify(ROUTES))' | ConvertFrom-Json
$previewDirectory = Join-Path (Get-Location) 'public/social'
[IO.Directory]::CreateDirectory($previewDirectory) | Out-Null
foreach ($route in $previewRoutes) {
    $bitmap = [Drawing.Bitmap]::new(1200, 630)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([Drawing.Color]::FromArgb(248, 248, 248))
    $ink = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(46, 46, 51))
    $muted = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(113, 113, 122))
    $accent = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(200, 64, 42))
    $small = [Drawing.Font]::new('Arial', 18, [Drawing.FontStyle]::Regular, [Drawing.GraphicsUnit]::Pixel)
    $titleFont = [Drawing.Font]::new('Arial', 68, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
    $bodyFont = [Drawing.Font]::new('Arial', 24, [Drawing.FontStyle]::Regular, [Drawing.GraphicsUnit]::Pixel)
    $title = switch ($route.path) {
        '/' { "Design Engineer.`nProduct & AI." }
        '/about' { "An engineer's mind.`nA designer's eye." }
        '/guestbook' { "You were here.`nLeave a little hello." }
        '/resume' { "Experience, skills`nand a little more." }
        default { ($route.imageAlt -split ' — ')[0] -replace ' case study', "`nCase study" }
    }
    $graphics.FillRectangle($accent, 64, 68, 40, 5)
    $graphics.DrawString('OPEYEMI ADEGBOYE', $small, $muted, 64, 100)
    $graphics.DrawString($title, $titleFont, $ink, [Drawing.RectangleF]::new(60, 177, 1060, 195))
    $caption = if ($route.path -eq '/guestbook') { 'A thought, a kind word, or just your name.' } else { $route.heading }
    $graphics.DrawString($caption, $bodyFont, $muted, [Drawing.RectangleF]::new(64, 405, 1030, 90))
    $graphics.FillRectangle($accent, 64, 531, 1072, 2)
    $graphics.DrawString(('yemii.vercel.app' + $(if ($route.path -ne '/') { $route.path })), $small, $ink, 64, 558)
    $outputPath = Join-Path (Get-Location) ('public' + $route.image)
    $bitmap.Save($outputPath, [Drawing.Imaging.ImageFormat]::Jpeg)
    $graphics.Dispose(); $bitmap.Dispose()
    $small.Dispose(); $titleFont.Dispose(); $bodyFont.Dispose()
    $ink.Dispose(); $muted.Dispose(); $accent.Dispose()
}
