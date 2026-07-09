# Build + commit + push + deploy Cloudflare cho nguyenngocvu.com.
# Đọc secret từ ..\..\.env-autoblog. Dùng: powershell scripts/autoblog-deploy.ps1 "commit message"
param([string]$msg = "chore: auto-blog daily update")

$ErrorActionPreference = "Continue"
$proj = Split-Path -Parent $PSScriptRoot   # nguyenngocvu-com
Set-Location $proj

# Nạp .env-autoblog
$envFile = Join-Path (Split-Path -Parent $proj) ".env-autoblog"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.*)$') { Set-Item -Path "Env:$($matches[1])" -Value $matches[2] }
  }
}
if (-not $env:CLOUDFLARE_API_TOKEN) { Write-Output "THIEU CF TOKEN"; exit 1 }

Write-Output "=== BUILD ==="
npm run build 2>&1 | Select-Object -Last 3

Write-Output "=== GIT ==="
git config user.email "vuaivn@gmail.com" 2>&1 | Out-Null
git config user.name "vuaivn" 2>&1 | Out-Null
git add -A 2>&1 | Out-Null
git commit -m "$msg" 2>&1 | Select-Object -Last 1
git push origin main 2>&1 | Select-Object -Last 1

Write-Output "=== DEPLOY ==="
npx wrangler pages deploy dist --project-name=nguyenngocvu-com --commit-dirty=true 2>&1 | Select-Object -Last 3
Write-Output "=== DONE ==="
