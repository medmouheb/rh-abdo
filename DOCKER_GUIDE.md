# Docker Deployment Guide

Run the entire HR Management System (Frontend + Backend + MongoDB) with Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Start All Services

```powershell
docker-compose up --build
```

This will start:
- **MongoDB** on port 27017
- **Backend API** on port 5000
- **Frontend** on port 3000

### 2. Seed the Database (First Time Only)

In a new terminal, run:

```powershell
docker-compose exec backend npm run seed
```

This creates default users:
- **RH**: `admin` / `admin123`
- **Manager**: `manager1` / `manager123`
- **Directeur**: `directeur1` / `directeur123`

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Docker Commands

### Start Services (Detached Mode)
```powershell
docker-compose up -d
```

### Stop Services
```powershell
docker-compose down
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild Services
```powershell
docker-compose up --build
```

### Stop and Remove Everything (including volumes)
```powershell
docker-compose down -v
```

## Service Details

### MongoDB
- **Image**: mongo:7.0
- **Port**: 27017
- **Data**: Persisted in Docker volume `mongodb_data`

### Backend
- **Build**: `./backend/Dockerfile`
- **Port**: 5000
- **Environment**: Production mode
- **Uploads**: Mounted from `./backend/uploads`

### Frontend
- **Build**: `./Dockerfile.frontend`
- **Port**: 3000
- **Mode**: Next.js production server
- **Note**: Electron not available in Docker (desktop app mode)

## Environment Variables

You can customize environment variables in `docker-compose.yml`:

### Backend Environment
```yaml
environment:
  - MONGODB_URI=mongodb://mongodb:27017/hr_system
  - JWT_SECRET=your-secret-key
  - FRONTEND_URL=http://localhost:3000
```

### Frontend Environment
```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development vs Docker

### For Desktop App (Electron)
Use local development (not Docker):
```powershell
# Frontend
npm run electron:dev

# Backend
cd backend
cmd /c npm run dev
```

### For Web App
Use Docker for full-stack deployment:
```powershell
docker-compose up
```

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 27017 are in use, stop the services or change ports in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port
```

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb
```

### Backend Not Starting
```powershell
# View backend logs
docker-compose logs backend

# Rebuild backend
docker-compose up --build backend
```

### Clean Slate
```powershell
# Remove all containers, networks, and volumes
docker-compose down -v

# Rebuild everything
docker-compose up --build
```

## Data Persistence

MongoDB data is stored in a Docker volume named `mongodb_data`. This means:
- ✅ Data persists across container restarts
- ✅ Data survives `docker-compose down`
- ❌ Data is lost with `docker-compose down -v`

To backup MongoDB:
```powershell
docker-compose exec mongodb mongodump --out /data/backup
```

## Production Deployment

For production, update:

1. **JWT Secret** in docker-compose.yml
2. **Cookie Domain** to your actual domain
3. **CORS Origin** to your frontend URL
4. Consider using **Docker secrets** for sensitive data
5. Use **reverse proxy** (nginx) for SSL/TLS

## Network Architecture

```
┌─────────────┐
│  Frontend   │ :3000
│  (Next.js)  │
└──────┬──────┘
       │
       │ API Calls
       ↓
┌─────────────┐
│   Backend   │ :5000
│  (Express)  │
└──────┬──────┘
       │
       │ Database Queries
       ↓
┌─────────────┐
│   MongoDB   │ :27017
└─────────────┘
```

All services communicate via the `hr_network` Docker network.
