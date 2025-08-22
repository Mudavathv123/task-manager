#!/bin/bash

# GitHub Repository Setup Script for Task Manager
# Usage: ./setup-github.sh

set -e

echo "🚀 Setting up GitHub repository for Task Manager..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Task Manager full-stack application

- React frontend with responsive design
- Spring Boot backend with JWT authentication
- MySQL database with JPA
- Docker and Docker Compose support
- Multiple deployment options (Heroku, Railway, Vercel, AWS)
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation and deployment scripts"

echo ""
echo "🎉 Git repository setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Name: task-manager (or your preferred name)"
echo "   - Description: Full-stack task management application"
echo "   - Make it Public or Private (your choice)"
echo "   - Don't initialize with README, .gitignore, or license"
echo ""
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/task-manager.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Set up GitHub Secrets for CI/CD (optional):"
echo "   - Go to Settings > Secrets and variables > Actions"
echo "   - Add: RAILWAY_TOKEN, VERCEL_TOKEN, ORG_ID, PROJECT_ID"
echo ""
echo "5. Enable GitHub Actions:"
echo "   - Go to Actions tab and enable workflows"
echo ""
echo "🔗 Your repository will be ready for deployment!"

