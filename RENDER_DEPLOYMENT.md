# 🚀 Render Deployment Guide for Task Manager

## 📋 Prerequisites

- ✅ GitHub account with your task-manager repository
- ✅ Render account (free)
- ✅ Database (PostgreSQL recommended)

## 🌐 **Step 1: Create Render Account**

1. **Go to**: [https://render.com](https://render.com)
2. **Click**: "Get Started"
3. **Sign up with GitHub** (recommended)
4. **Verify your email**

## 🗄️ **Step 2: Set Up Database**

### **Option A: Render PostgreSQL (Recommended)**
1. **In Render Dashboard**: Click "New +" → "PostgreSQL"
2. **Name**: `task-manager-db`
3. **Plan**: Starter ($7/month) or Free (limited)
4. **Database**: `taskmanager`
5. **User**: `taskmanager_user`
6. **Password**: Generate secure password
7. **Note down**: Host, Port, Database, Username, Password

### **Option B: Free External PostgreSQL**
- **Neon**: [https://neon.tech](https://neon.tech) (Free tier)
- **Supabase**: [https://supabase.com](https://supabase.com) (Free tier)
- **PlanetScale**: [https://planetscale.com](https://planetscale.com) (Free tier)

## 🚀 **Step 3: Deploy Backend**

### **Create Web Service**
1. **Click**: "New +" → "Web Service"
2. **Connect GitHub**: Select your repository
3. **Repository**: `Mudavathv123/task-manager`
4. **Branch**: `main`
5. **Root Directory**: `backend`

### **Configure Service**
- **Name**: `task-manager-backend`
- **Environment**: `Java`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`

### **Build & Start Commands**
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/taskmanager-0.0.1-SNAPSHOT.jar`

### **Environment Variables**
Click **"Environment"** tab and add:

```bash
# Database Configuration
DB_URL=jdbc:postgresql://your-postgres-host:5432/taskmanager
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION_MS=86400000

# Spring Profile
SPRING_PROFILES_ACTIVE=production

# Server Port (Render sets this automatically)
PORT=8080
```

## 🔧 **Step 4: Database Setup**

### **Create Database Tables**
Your application will automatically create tables on first run, or you can run:

```sql
-- Connect to your PostgreSQL database
-- Tables will be created automatically by Hibernate
-- Or manually create if needed:

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌍 **Step 5: Deploy Frontend**

### **Option A: Vercel (Recommended)**
1. **Go to**: [https://vercel.com](https://vercel.com)
2. **Import**: Your GitHub repository
3. **Framework**: Vite
4. **Root Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### **Option B: Netlify**
1. **Go to**: [https://netlify.com](https://netlify.com)
2. **Import**: Your GitHub repository
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`

## 🔗 **Step 6: Connect Frontend to Backend**

### **Update Frontend Environment**
In your frontend deployment, set:

```bash
VITE_API_BASE=https://your-backend-name.onrender.com
```

### **Update Vercel Configuration**
If using Vercel, update `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-name.onrender.com/$1"
    }
  ]
}
```

## 📱 **Step 7: Test Your Application**

### **Backend Health Check**
```bash
curl https://your-backend-name.onrender.com/actuator/health
```

### **Frontend Test**
1. **Open**: Your frontend URL
2. **Sign up**: Create a new account
3. **Login**: Test authentication
4. **Create tasks**: Test CRUD operations

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
- **Check**: Maven version compatibility
- **Verify**: Java 17+ is available
- **Review**: Build logs in Render dashboard

#### **Database Connection Issues**
- **Verify**: Database credentials
- **Check**: Network access
- **Test**: Connection manually

#### **JWT Errors**
- **Ensure**: JWT_SECRET is set
- **Check**: JWT_EXPIRATION_MS format
- **Verify**: Token generation in logs

### **Logs & Debugging**
1. **Render Dashboard**: View service logs
2. **Environment Variables**: Verify all are set
3. **Build Logs**: Check compilation errors
4. **Runtime Logs**: Monitor application behavior

## 🔒 **Security Checklist**

- [ ] **JWT Secret**: Changed from default
- [ ] **Database Password**: Strong, unique password
- [ ] **Environment Variables**: All sensitive data in env vars
- [ ] **HTTPS**: Render provides automatically
- [ ] **CORS**: Configured for your frontend domain

## 📊 **Monitoring**

### **Health Checks**
- **Endpoint**: `/actuator/health`
- **Frequency**: Render checks automatically
- **Alerts**: Configure in Render dashboard

### **Performance**
- **Response Time**: Monitor in Render dashboard
- **Error Rate**: Check logs regularly
- **Database**: Monitor connection pool

## 🔄 **Updates & Maintenance**

### **Automatic Deployments**
- **GitHub Integration**: Push to main = auto-deploy
- **Manual Deploy**: Available in Render dashboard
- **Rollback**: Previous versions available

### **Environment Updates**
1. **Edit**: Environment variables in Render
2. **Redeploy**: Service restarts automatically
3. **Verify**: Changes take effect

## 🎯 **Next Steps**

1. **Deploy Backend**: Follow steps above
2. **Deploy Frontend**: Choose Vercel or Netlify
3. **Test Application**: Verify all functionality
4. **Monitor Performance**: Check Render dashboard
5. **Scale Up**: Upgrade plans as needed

## 🆘 **Support**

- **Render Docs**: [https://render.com/docs](https://render.com/docs)
- **GitHub Issues**: Open in your repository
- **Community**: Stack Overflow, Reddit

---

**Your Task Manager will be live at:**
- **Backend**: `https://your-app-name.onrender.com`
- **Frontend**: `https://your-app-name.vercel.app` (or Netlify)

**Happy Deploying! 🚀**
