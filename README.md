# Task Manager (React + Spring Boot + MySQL)

A full-stack task management application with JWT authentication, built with React frontend and Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Java 17 and Maven
- Docker and Docker Compose (recommended)
- MySQL database

### Option 1: Docker Compose (Recommended)
```bash
# Clone and run everything with one command
git clone <your-repo-url>
cd task-manager
docker-compose up --build

# Access the app:
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# MySQL: localhost:3306
```

### Option 2: Local Development
```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Deployment Options

### 1. Docker Deployment (Production)

#### Backend Docker
```bash
cd backend
docker build -t taskmanager-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:mysql://your-db-host:3306/taskmanager \
  -e DB_USERNAME=youruser \
  -e DB_PASSWORD=yourpass \
  -e JWT_SECRET=your-secret-key \
  taskmanager-backend
```

#### Frontend Docker
```bash
cd frontend
docker build -t taskmanager-frontend .
docker run -p 80:80 taskmanager-frontend
```

### 2. Heroku Deployment

#### Backend (Heroku)
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

#### Frontend (Heroku)
```bash
# Create static build
cd frontend
npm run build

# Deploy to Heroku
heroku create your-taskmanager-frontend
git subtree push --prefix frontend/dist heroku main
```

### 3. Railway Deployment

#### Backend
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init

# Deploy backend
cd backend
railway up
```

#### Frontend
```bash
cd frontend
railway up
```

### 4. Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### 5. AWS Deployment

#### Backend (ECS)
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker tag taskmanager-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/taskmanager-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/taskmanager-backend:latest

# Deploy to ECS with RDS MySQL
```

#### Frontend (S3 + CloudFront)
```bash
# Build and sync to S3
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
```

## 🔧 Environment Configuration

### Backend Environment Variables
```bash
# Required
DB_URL=jdbc:mysql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET=your-secret-key

# Optional
JWT_EXPIRATION_MS=86400000
PORT=8080
```

### Frontend Environment Variables
```bash
# Required
VITE_API_BASE=https://your-backend-url.com
```

## 📱 API Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication
- `GET /tasks` - List user tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## 🗄️ Database Setup

### MySQL
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

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- CORS configuration
- Input validation
- User-scoped data access

## 📊 Monitoring & Health Checks

- Health endpoint: `/actuator/health`
- Application metrics via Spring Boot Actuator
- Detailed error logging and exception handling

## 🚀 Performance Optimization

- Frontend: Vite build optimization
- Backend: JPA query optimization
- Database: Proper indexing on userId
- Caching: JWT token validation

## 📝 Development Workflow

```bash
# 1. Make changes
git add .
git commit -m "Feature: add new functionality"

# 2. Test locally
docker-compose up --build

# 3. Deploy
git push origin main
# Trigger your CI/CD pipeline
```

## 🐛 Troubleshooting

### Common Issues
1. **JWT Secret Error**: Ensure JWT_SECRET is set and valid
2. **Database Connection**: Verify DB credentials and network access
3. **CORS Issues**: Check backend CORS configuration
4. **Port Conflicts**: Ensure ports 8080 and 5173 are available

### Logs
```bash
# Backend logs
docker logs task-manager-backend-1

# Frontend logs
docker logs task-manager-frontend-1

# Database logs
docker logs task-manager-db-1
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


