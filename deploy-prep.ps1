# Address Map - GitHub Pages Deployment Preparation Script
# This script helps prepare your project for GitHub Pages deployment

Write-Host "🚀 Address Map - GitHub Pages Deployment Preparation" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ Found .env file" -ForegroundColor Green

    # Create backup
    Copy-Item ".env" ".env.backup"
    Write-Host "✅ Created .env.backup" -ForegroundColor Green

    # Check if API key is set
    $envContent = Get-Content ".env"
    if ($envContent -match "VITE_GOOGLE_MAPS_API_KEY=") {
        Write-Host "✅ Google Maps API Key found in .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: VITE_GOOGLE_MAPS_API_KEY not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file not found. Please create it with your Google Maps API Key:" -ForegroundColor Red
    Write-Host "   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here" -ForegroundColor Yellow
    exit 1
}

# Check if GitHub workflow exists
if (Test-Path ".github\workflows\deploy.yml") {
    Write-Host "✅ GitHub Actions workflow found" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub Actions workflow not found" -ForegroundColor Red
    exit 1
}

# Check if .env is in .gitignore
$gitignoreContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
if ($gitignoreContent -and ($gitignoreContent -match "\.env")) {
    Write-Host "✅ .env is properly excluded from Git" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: .env is not in .gitignore" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Magenta
Write-Host "1. Create a GitHub repository (name it 'recordmap' or update vite.config.ts)" -ForegroundColor White
Write-Host "2. Set up GitHub Secret:" -ForegroundColor White
Write-Host "   - Go to repository Settings → Secrets and variables → Actions" -ForegroundColor White
$apiKey = (Get-Content ".env" | Select-String "VITE_GOOGLE_MAPS_API_KEY=" | ForEach-Object { $_.Line -replace "VITE_GOOGLE_MAPS_API_KEY=", "" })
Write-Host "   - Add: VITE_GOOGLE_MAPS_API_KEY = $apiKey" -ForegroundColor White
Write-Host "3. Push code to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Ready for deployment'" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/yourusername/recordmap.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "4. Enable GitHub Pages:" -ForegroundColor White
Write-Host "   - Go to repository Settings → Pages" -ForegroundColor White
Write-Host "   - Source: GitHub Actions" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your site will be available at: https://yourusername.github.io/recordmap/" -ForegroundColor Green
