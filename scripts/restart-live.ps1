param(
  [int]$Port = 4173,
  [int]$EndpointPort = 9222,
  [string]$HostAddress = "127.0.0.1"
)

$ErrorActionPreference = "Stop"

$connections = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
$processIds = @($connections | Select-Object -ExpandProperty OwningProcess -Unique)
foreach ($processId in $processIds) {
  $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
  if ($process) {
    Write-Host "Stopping process $processId ($($process.ProcessName)) on port $Port..."
    Stop-Process -Id $processId -Force
  }
}

Write-Host "Starting TASMON live dashboard on http://$HostAddress`:$Port"
$stdoutPath = Join-Path (Get-Location) "dashboard-server.log"
$stderrPath = Join-Path (Get-Location) "dashboard-server-error.log"
$server = Start-Process -FilePath "node" `
  -ArgumentList @("src/cli.js", "live", $Port, $EndpointPort, "--host", $HostAddress) `
  -WorkingDirectory (Get-Location) `
  -RedirectStandardOutput $stdoutPath `
  -RedirectStandardError $stderrPath `
  -PassThru
Write-Host "Dashboard started as process $($server.Id)."
exit 0
