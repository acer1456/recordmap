#!/bin/bash

# Deployment Preparation Script for Address Map
# This script helps prepare your project for GitHub Pages deployment

echo "🚀 Address Map - GitHub Pages Deployment Preparation"
echo "=================================================="

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ Found .env file"

    # Create backup
    cp .env .env.backup
    echo "✅ Created .env.backup"

    # Check if API key is set
    if grep -q "VITE_GOOGLE_MAPS_API_KEY=" .env; then
        echo "✅ Google Maps API Key found in .env"
    else
        echo "⚠️  Warning: VITE_GOOGLE_MAPS_API_KEY not found in .env"
    fi
else
    echo "❌ .env file not found. Please create it with your Google Maps API Key:"
    echo "   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here"
    exit 1
fi

# Check if GitHub workflow exists
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions workflow found"
else
    echo "❌ GitHub Actions workflow not found"
    exit 1
fi

# Check if .env is in .gitignore
if grep -q ".env" .gitignore; then
    echo "✅ .env is properly excluded from Git"
else
    echo "⚠️  Warning: .env is not in .gitignore"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create a GitHub repository (name it 'recordmap' or update vite.config.ts)"
echo "2. Set up GitHub Secret:"
echo "   - Go to repository Settings → Secrets and variables → Actions"
echo "   - Add: VITE_GOOGLE_MAPS_API_KEY = $(grep VITE_GOOGLE_MAPS_API_KEY .env | cut -d'=' -f2)"
echo "3. Push code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git remote add origin https://github.com/yourusername/recordmap.git"
echo "   git push -u origin main"
echo "4. Enable GitHub Pages:"
echo "   - Go to repository Settings → Pages"
echo "   - Source: GitHub Actions"
echo ""
echo "🎉 Your site will be available at: https://yourusername.github.io/recordmap/"
