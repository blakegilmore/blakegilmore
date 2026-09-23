$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$output = Join-Path $root '_site'
if (Test-Path -LiteralPath $output) {
    throw 'The _site directory already exists. Move or remove the previous build before building again.'
}
$js = [System.IO.File]::ReadAllText((Join-Path $root 'main.js'))
$mode = [regex]::Match($js, 'const UNDER_CONSTRUCTION = (true|false);')
if (-not $mode.Success) { throw 'Missing explicit UNDER_CONSTRUCTION setting.' }
$pages = @(Get-ChildItem -LiteralPath $root -File -Filter '*.html')
$utf8 = New-Object System.Text.UTF8Encoding($false)
$null = New-Item -ItemType Directory -Path $output

if ($mode.Groups[1].Value -eq 'true') {
    # Publish only the construction content, never the hidden original pages or assets.
    $markup = [regex]::Match($js, '(?s)screen\.innerHTML = `(.+?)`;')
    if (-not $markup.Success) { throw 'Construction screen markup not found.' }
    $css = [System.IO.File]::ReadAllText((Join-Path $root 'style.css'))
    $css = $css.Split(@('/* Temporary homepage birthday banner. */'), [StringSplitOptions]::None)[0]
    if (-not $css.Contains('.construction-screen')) { throw 'Construction styles not found.' }
    $screen = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under construction | Blakeworld</title>
    <style>$css</style>
</head>
<body class="construction-mode">
    <main class="construction-screen" aria-labelledby="construction-title">
        $($markup.Groups[1].Value)
    </main>
</body>
</html>
"@
    foreach ($name in (@($pages.Name) + '404.html' | Select-Object -Unique)) {
        [System.IO.File]::WriteAllText((Join-Path $output $name), $screen, $utf8)
    }
    foreach ($file in Get-ChildItem -LiteralPath $output -File) {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        if ($content -match '<script|<form|<a\s|formspree') { throw "Unexpected content in $($file.Name)" }
    }
    Write-Output 'Built construction-only pages, including a construction 404. No original content or assets published.'
} else {
    foreach ($page in $pages) { Copy-Item -LiteralPath $page.FullName -Destination $output }
    foreach ($name in @('main.js', 'style.css', 'images')) {
        Copy-Item -LiteralPath (Join-Path $root $name) -Destination $output -Recurse
    }
    Write-Output 'Built the full site.'
}
if (Test-Path -LiteralPath (Join-Path $root 'CNAME')) {
    Copy-Item -LiteralPath (Join-Path $root 'CNAME') -Destination $output
}
[System.IO.File]::WriteAllText((Join-Path $output '.nojekyll'), '', $utf8)
