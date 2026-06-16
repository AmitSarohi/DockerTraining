# Employee Management Demo

A simple full-stack Employee Management application built with:

* **Frontend:** React
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions
* **Private Registry:** Docker Registry (registry:2)

---

# Architecture

```text
React Frontend
      |
      v
Node.js (Express API)
      |
      v
PostgreSQL Database
```

---

# Prerequisites

## Local Development

* Node.js 18+
* npm
* PostgreSQL

## Docker Development

* Docker Engine or Docker Desktop
* Docker Compose

## WSL2 Development (Windows)

* WSL2 enabled
* Ubuntu 24.04 (or later)
* Visual Studio Code
* Remote - WSL extension
* Docker Engine installed inside WSL

---

# Project Structure

```text
project-root/
├── frontend/
├── backend/
├── database/
│   └── init.sql
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
└── README.md
```

---

# Running Without Docker

## Start Backend

```bash
cd backend
npm install
npm start
```

Backend API:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# Docker Image Management

## Build Docker Images

Build frontend image:

```bash
docker build -t employee-frontend ./frontend
```

Build backend image:

```bash
docker build -t employee-backend ./backend
```

List images:

```bash
docker images
```

---

## Run Containers

Run backend:

```bash
docker run -d \
  --name employee-backend \
  -p 5000:5000 \
  employee-backend
```

Run frontend:

```bash
docker run -d \
  --name employee-frontend \
  -p 3000:3000 \
  employee-frontend
```

---

## Container Lifecycle Commands

### List Containers

Running containers:

```bash
docker ps
```

All containers:

```bash
docker ps -a
```

### Stop Containers

```bash
docker stop employee-backend
docker stop employee-frontend
```

### Start Containers

```bash
docker start employee-backend
docker start employee-frontend
```

### Remove Containers

```bash
docker rm employee-backend
docker rm employee-frontend
```

---

## Inspect Containers and View Logs

Inspect container:

```bash
docker inspect employee-backend
```

View logs:

```bash
docker logs employee-backend
```

Follow logs:

```bash
docker logs -f employee-backend
```

---

# Private Docker Registry

A private Docker registry is created using the official Docker Registry image.

## Start Registry

```bash
docker run -d \
  --name private-registry \
  -p 5001:5000 \
  --restart always \
  registry:2
```

Verify:

```bash
docker ps
```

Expected:

```text
private-registry
0.0.0.0:5001->5000/tcp
```

---

## Tag Images for Registry

```bash
docker tag employee-frontend localhost:5001/employee-frontend:1.0
docker tag employee-backend localhost:5001/employee-backend:1.0
```

---

## Push Images to Registry

```bash
docker push localhost:5001/employee-frontend:1.0
docker push localhost:5001/employee-backend:1.0
```

Verify registry contents:

```bash
curl http://localhost:5001/v2/_catalog
```

Expected output:

```json
{
  "repositories": [
    "employee-backend",
    "employee-frontend"
  ]
}
```

---

## Pull Images from Registry

Remove local copies:

```bash
docker rmi localhost:5001/employee-frontend:1.0
docker rmi localhost:5001/employee-backend:1.0
```

Pull images:

```bash
docker pull localhost:5001/employee-frontend:1.0
docker pull localhost:5001/employee-backend:1.0
```

---

# Running with Docker Compose

The application uses Docker Compose to orchestrate multiple containers.

## Pull Images

```bash
docker compose pull
```

## Start Application

```bash
docker compose up -d
```

## Verify Services

```bash
docker compose ps
```

Example output:

```text
NAME       STATUS
postgres   Up
backend    Up
frontend   Up
```

## View Logs

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

## Stop Application

```bash
docker compose down
```

---

# Application URLs

Frontend:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:5000
```

PostgreSQL:

```text
localhost:5432
```

---

# Running with WSL2 and VS Code

## Verify WSL Installation

Open PowerShell:

```powershell
wsl -l -v
```

Example:

```text
NAME            STATE           VERSION
Ubuntu-24.04    Running         2
```

## Open Project in WSL

```powershell
wsl
```

Navigate to project:

```bash
cd /mnt/c/DockerTraining
```

Open VS Code:

```bash
code .
```

Verify VS Code is connected to WSL:

```text
WSL: Ubuntu-24.04
```

---

## Verify Docker

```bash
docker --version
docker compose version
```

---

# API Endpoints

## Get All Employees

```http
GET /employees
```

## Create Employee

```http
POST /employees
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

## Delete Employee

```http
DELETE /employees/:id
```

---

# Database Initialization

Database schema and sample data are created using:

```text
database/init.sql
```

The file is automatically executed when the PostgreSQL container starts.

---

# GitHub Actions CI

The workflow is located at:

```text
.github/workflows/ci.yml
```

The pipeline performs:

* Checkout source code
* Install frontend dependencies
* Install backend dependencies
* Build React application
* Build Docker images
* Create private Docker registry
* Tag Docker images
* Push Docker images to registry
* Pull Docker images from registry
* Verify image availability

GitHub Actions automatically runs on:

* Push
* Pull Request

---

# Assignment Requirements Covered

✔ Build Docker images

✔ Run containers from images

✔ List containers

✔ Start containers

✔ Stop containers

✔ Remove containers

✔ Inspect running containers

✔ View container logs

✔ Docker Compose multi-container application

✔ Create private Docker registry

✔ Push images to registry

✔ Pull images from registry

✔ Run application locally using pulled images

✔ GitHub Actions CI pipeline

---

# Troubleshooting

## Docker Command Not Found

```text
docker: command not found
```

Verify Docker installation:

```bash
docker --version
```

---

## Cannot Connect to Docker Daemon

```text
Cannot connect to the Docker daemon
```

Start Docker:

```bash
sudo service docker start
```

Verify:

```bash
docker ps
```

---

## Verify Registry

```bash
curl http://localhost:5001/v2/
```

Expected:

```json
{}
```

---

## Verify Registry Catalog

```bash
curl http://localhost:5001/v2/_catalog
```

---

## Port Already in Use

Check processes:

```bash
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :5432
```

Stop conflicting processes or update Docker port mappings.

---

## Verify Compose Configuration

```bash
docker compose config
```

This validates the Docker Compose configuration before deployment.
