# Address Map - Final Deployment Checklist
# Run this script before pushing to GitHub

Write-Host "🔍 Address Map - Final Deployment Checklist" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$checks = @(
    @{ Name = ".env file exists"; Check = { Test-Path ".env" } },
    @{ Name = ".env.backup created"; Check = { Test-Path ".env.backup" } },
    @{ Name = ".env in .gitignore"; Check = { (Get-Content ".gitignore" -ErrorAction SilentlyContinue) -match "\.env" } },
    @{ Name = "GitHub workflow exists"; Check = { Test-Path ".github\workflows\deploy.yml" } },
    @{ Name = "vite.config.ts updated"; Check = { (Get-Content "vite.config.ts") -match "base.*recordmap" } },
    @{ Name = "Build successful"; Check = { Test-Path "dist" } }
)

$allPassed = $true
foreach ($check in $checks) {
    $result = & $check.Check
    if ($result) {
        Write-Host "✅ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($check.Name)" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host ""
if ($allPassed) {
    Write-Host "🎉 All checks passed! Ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Final Steps:" -ForegroundColor Magenta
    Write-Host "1. Create GitHub repository: https://github.com/new" -ForegroundColor White
    Write-Host "2. Set up the secret in GitHub:" -ForegroundColor White
    $apiKey = (Get-Content ".env" | Select-String "VITE_GOOGLE_MAPS_API_KEY=" | ForEach-Object { $_.Line -replace "VITE_GOOGLE_MAPS_API_KEY=", "" })
    Write-Host "   Repository Settings → Secrets → VITE_GOOGLE_MAPS_API_KEY = $apiKey" -ForegroundColor Gray
    Write-Host "3. Push to GitHub:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Deploy to GitHub Pages'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host "4. Enable Pages: Repository Settings → Pages → Source: GitHub Actions" -ForegroundColor White
} else {
    Write-Host "❌ Some checks failed. Please fix the issues above." -ForegroundColor Red
}

Write-Host ""
Write-Host "📖 For detailed instructions, see README.md" -ForegroundColor Blue
