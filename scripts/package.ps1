$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $repoRoot 'dist'
New-Item -ItemType Directory -Force -Path $distPath | Out-Null
$zipPath = Join-Path $distPath 'youtube-lite-popup-blocker.zip'
Compress-Archive -Path (Join-Path $repoRoot 'extension\*') -DestinationPath $zipPath -Force
Write-Output $zipPath
