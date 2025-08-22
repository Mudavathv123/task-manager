# 🚀 Deployment Guide

This guide covers deploying your Task Manager application to various platforms.

## 📋 Prerequisites

- Git installed and configured
- Docker and Docker Compose (for local/production)
- Node.js 20+ and npm (for local development)
- Java 17 and Maven (for local development)

## 🏠 Local Development

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd task-manager

# Start all services with Docker
docker-compose up --build

# Access the application:
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Database: localhost:3306
```

### Manual Setup
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Cloud Deployment

### 1. Railway (Recommended for Backend)

#### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
cd backend
railway up
```

#### Environment Variables
Set these in Railway dashboard:
- `DB_URL`: Your MySQL connection string
- `JWT_SECRET`: Your secret key
- `JWT_EXPIRATION_MS`: 86400000 (24 hours)

### 2. Vercel (Recommended for Frontend)

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Configuration
Update `vercel.json` with your backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-backend.railway.app/$1"
    }
  ]
}
```

### 3. Heroku

#### Backend Deployment
```bash
# Create Heroku app
heroku create your-taskmanager-backend

# Add MySQL addon
heroku addons:create cleardb:ignite

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRATION_MS=86400000

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend Deployment
```bash
# Build frontend
cd frontend
npm run build

# Create Heroku app
heroku create your-taskmanager-frontend

# Deploy
git subtree push --prefix frontend/dist heroku main
```

### 4. AWS

#### Backend (ECS)
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker tag taskmanager-backend:latest \
  your-account.dkr.ecr.us-east-1.amazonaws.com/taskmanager-backend:latest

docker push your-account.dkr.ecr.us-east-1.amazonaws.com/taskmanager-backend:latest
```

#### Frontend (S3 + CloudFront)
```bash
# Build and sync to S3
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
```

## 🐳 Docker Production

### Production Deployment
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or use the deployment script
./deploy.sh production
```

### Environment Configuration
Create `.env.production`:
```bash
DB_NAME=taskmanager
DB_USER=app
DB_PASSWORD=secure-password
JWT_SECRET=your-production-secret
FRONTEND_API_BASE=https://your-backend-domain.com
```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Fork/Clone** the repository
2. **Set Secrets** in GitHub:
   - `RAILWAY_TOKEN`: Your Railway API token
   - `VERCEL_TOKEN`: Your Vercel API token
   - `ORG_ID`: Your Vercel organization ID
   - `PROJECT_ID`: Your Vercel project ID

3. **Enable Actions** in the Actions tab

### Automated Deployment
- **Push to main**: Triggers automatic deployment
- **Pull requests**: Run tests only
- **Manual triggers**: Available in Actions tab

## 🔧 Environment Variables

### Backend Required
```bash
DB_URL=jdbc:mysql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### Frontend Required
```bash
VITE_API_BASE=https://your-backend-url.com
```

### Optional
```bash
JWT_EXPIRATION_MS=86400000
PORT=8080
DB_PORT=3306
FRONTEND_PORT=80
```

## 🗄️ Database Setup

### MySQL (Recommended)
```sql
CREATE DATABASE taskmanager;
CREATE USER 'appuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON taskmanager.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
```

### PostgreSQL (Alternative)
```sql
CREATE DATABASE taskmanager;
CREATE USER appuser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO appuser;
```

## 📱 Domain Configuration

### Custom Domain Setup
1. **Backend**: Configure in your hosting platform
2. **Frontend**: Update `VITE_API_BASE` with your domain
3. **CORS**: Ensure backend allows your frontend domain

### SSL/HTTPS
- **Railway**: Automatic SSL
- **Vercel**: Automatic SSL
- **Heroku**: Automatic SSL
- **AWS**: Configure in CloudFront/ALB

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
docker-compose logs backend

# Verify database connection
docker-compose exec db mysql -u root -p
```

#### Frontend API Errors
```bash
# Check CORS configuration
# Verify API_BASE URL
# Check network tab in browser
```

#### Database Connection Issues
```bash
# Verify credentials
# Check network access
# Test connection manually
```

### Health Checks
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Database health
docker-compose exec db mysqladmin ping -h localhost
```

## 📊 Monitoring

### Application Metrics
- **Health endpoint**: `/actuator/health`
- **Spring Boot Actuator**: Built-in monitoring
- **Docker logs**: `docker-compose logs -f`

### Performance
- **Frontend**: Vite build optimization
- **Backend**: JPA query optimization
- **Database**: Proper indexing

## 🔒 Security

### Production Checklist
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Regular security updates

### Environment Security
- [ ] Never commit `.env` files
- [ ] Use platform secrets management
- [ ] Rotate credentials regularly
- [ ] Monitor access logs

## 📚 Additional Resources

- [Spring Boot Deployment](https://spring.io/guides/gs/spring-boot-docker/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review logs and error messages
3. Verify environment configuration
4. Check platform-specific documentation
5. Open an issue in the GitHub repository

