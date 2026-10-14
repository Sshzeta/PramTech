param([int]$port = 4096)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "Iniciando servidor en http://127.0.0.1:$port" -ForegroundColor Cyan
Write-Host "Carpeta: $root" -ForegroundColor DarkGray

$existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "El puerto $port ya esta en uso; parece que el servidor ya esta corriendo. Abriendo navegador..." -ForegroundColor Yellow
  Start-Process "http://127.0.0.1:$port"
  exit 0
}

Start-Job -ScriptBlock { param($p, $r) Start-Sleep -Seconds 2; Start-Process "http://127.0.0.1:$p" } -ArgumentList $port, $root | Out-Null

Write-Host "Abriendo navegador... (deja esta ventana abierta; Ctrl+C para detener)" -ForegroundColor Green
python -m http.server $port --bind 127.0.0.1 --directory $root
