#!/bin/bash

# Task Manager Deployment Script
# Usage: ./deploy.sh [production|staging|local]

set -e

ENVIRONMENT=${1:-local}
PROJECT_NAME="task-manager"

echo "🚀 Deploying Task Manager to $ENVIRONMENT environment..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo "📁 Loading environment variables from .env.$ENVIRONMENT"
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
elif [ -f ".env" ]; then
    echo "📁 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No environment file found. Using default values."
fi

# Set default values
export JWT_SECRET=${JWT_SECRET:-"your-super-secret-jwt-key-change-in-production"}
export DB_NAME=${DB_NAME:-"taskmanager"}
export DB_USER=${DB_USER:-"app"}
export DB_PASSWORD=${DB_PASSWORD:-"app"}

case $ENVIRONMENT in
    "production")
        echo "🏭 Deploying to PRODUCTION..."
        
        # Build and push Docker images
        echo "🔨 Building Docker images..."
        docker-compose -f docker-compose.prod.yml build
        
        # Deploy with production compose
        echo "🚀 Starting production services..."
        docker-compose -f docker-compose.prod.yml up -d
        
        echo "✅ Production deployment completed!"
        echo "🌐 Frontend: http://localhost:${FRONTEND_PORT:-80}"
        echo "🔧 Backend: http://localhost:${BACKEND_PORT:-8080}"
        echo "🗄️  Database: localhost:${DB_PORT:-3306}"
        ;;
        
    "staging")
        echo "🧪 Deploying to STAGING..."
        
        # Use staging compose if exists, otherwise use production
        if [ -f "docker-compose.staging.yml" ]; then
            docker-compose -f docker-compose.staging.yml up -d --build
        else
            docker-compose -f docker-compose.prod.yml up -d --build
        fi
        
        echo "✅ Staging deployment completed!"
        ;;
        
    "local"|*)
        echo "🏠 Deploying to LOCAL..."
        
        # Stop existing containers
        echo "🛑 Stopping existing containers..."
        docker-compose down 2>/dev/null || true
        
        # Build and start services
        echo "🔨 Building and starting services..."
        docker-compose up --build -d
        
        echo "✅ Local deployment completed!"
        echo "🌐 Frontend: http://localhost:5173"
        echo "🔧 Backend: http://localhost:8080"
        echo "🗄️  Database: localhost:3306"
        ;;
esac

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Health checks
echo "🏥 Running health checks..."

# Check backend health
if curl -f http://localhost:${BACKEND_PORT:-8080}/actuator/health >/dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Check database connection
if docker-compose exec -T db mysqladmin ping -h localhost >/dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database health check failed"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Access your Task Manager:"
case $ENVIRONMENT in
    "production")
        echo "   Frontend: http://localhost:${FRONTEND_PORT:-80}"
        echo "   Backend: http://localhost:${BACKEND_PORT:-8080}"
        ;;
    "staging")
        echo "   Frontend: http://localhost:${FRONTEND_PORT:-80}"
        echo "   Backend: http://localhost:${BACKEND_PORT:-8080}"
        ;;
    *)
        echo "   Frontend: http://localhost:5173"
        echo "   Backend: http://localhost:8080"
        ;;
esac

echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: git pull && ./deploy.sh $ENVIRONMENT"

