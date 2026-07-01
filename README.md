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
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── src/
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
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

## Optimized Docker Builds

The Dockerfiles now use multi-stage builds for smaller production images and faster rebuilds:

* Backend: installs dependencies in a build stage and runs the app from a lightweight runtime stage.
* Frontend: builds the React app in a Node stage and serves the static output with Nginx.
* Build contexts are reduced using Docker ignore files to avoid sending unnecessary files into the build pipeline.

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

# Security Best Practices

## Least-privilege container user

The backend Dockerfile now creates and runs as a non-root `appuser` user in the final image. This reduces risk if a container is compromised.

## Secret management

Secrets are no longer recommended to be stored directly in `docker-compose.yml` or source control. A `.env.example` is provided to document expected variables; copy it to `.env` for local development and never commit `.env`. Instead:

* Use environment variables from the host or CI environment.
* Use file-backed secrets for sensitive credentials.
* The backend supports `DB_PASSWORD_FILE` to load the database password from a mounted file.

Example `docker-compose.yml` service configuration:

```yaml
backend:
  environment:
    DB_HOST: postgres
    DB_PORT: 5432
    DB_USER: postgres
    DB_NAME: employees_db
    DB_PASSWORD_FILE: /run/secrets/db_password
  secrets:
    - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

Example `.env` style override:

```bash
DB_PASSWORD_FILE=/run/secrets/db_password docker compose up -d
```

## Image vulnerability scanning

Scan built images for known vulnerabilities using Docker Scan or another OCI-compatible scanner.

Docker Scan example:

```bash
docker scan localhost:5001/employee-backend:1.0
```

If you do not have Docker Scan configured, consider `trivy` or `grype` for local scanning:

```bash
trivy image localhost:5001/employee-backend:1.0
```

## Docker Bench for Security

Docker Bench is a host-level audit that requires access to the Docker daemon socket and host namespaces. On a Linux host with a reachable Docker socket, run it with a privileged audit container:

```powershell
docker run --rm --net host --pid host --userns host --cap-add audit_control -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc:ro -v /var/lib:/var/lib:ro -v /usr/lib:/usr/lib:ro docker/docker-bench-security
```

If you are on Windows, Docker Desktop, or a restricted environment, the audit may fail with `Error connecting to docker daemon`. In that case, run the scan from a Linux host, a VM, or CI/CD environment where the Docker socket is accessible.

## Don't store secrets in Git

Never commit `.env` files, secret values, or private keys to source control. Add them to `.gitignore` where appropriate and use environment-specific secret stores in CI/CD.

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

# Optimization Highlights

The Docker setup was improved with the following changes:

* Added multi-stage builds for both the backend and frontend to separate build dependencies from the final runtime image.
* Switched the backend to a lightweight Alpine-based runtime for a smaller production image.
* Moved the frontend to a Node build stage plus an Nginx serving stage for faster startup and reduced image size.
* Added Docker ignore files to shrink the build context and speed up rebuilds.
* Updated Docker Compose to build the services from the optimized Dockerfiles.

---

# Custom Docker Network

The application services are connected through a custom bridge network named `employee-network`.

Once the Compose stack is started, this network should appear in the Docker network list and allow the containers to communicate with each other using service names instead of hardcoded IP addresses:

* `frontend` reaches the backend at `http://backend:5000`
* `backend` connects to PostgreSQL using the hostname `postgres`

The network is defined in [docker-compose.yml](docker-compose.yml) and is shared by the following services:

* `postgres`
* `backend`
* `frontend`

---

# Docker Volumes for Persistent Data

The PostgreSQL service uses a named Docker volume called `db-data` to persist database files across container restarts and rebuilds.

This volume is mounted at `/var/lib/postgresql/data` inside the PostgreSQL container:

```yaml
volumes:
  - db-data:/var/lib/postgresql/data
```

Using a named volume means the database data remains available even if the container is removed, unless the volume is explicitly deleted.

This Compose stack also uses a bind mount for database initialization SQL:

```yaml
volumes:
  - db-data:/var/lib/postgresql/data
  - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

That bind mount makes local host content available to the PostgreSQL container at runtime, while the named volume persists the actual database files.

## Named Volumes vs Bind Mounts

* Named volume (`db-data`) is managed by Docker and is ideal for persistent container data like database files.
* Bind mount (`./database/init.sql`) maps a host file or folder into the container and is useful for local configuration, initialization scripts, or development source code.

### Multi-container usage

In this multi-container setup:

* `postgres` persists data in the named volume `db-data`.
* `backend` and `frontend` can restart or redeploy without losing database state.
* the `postgres` service still uses a local init script from the host via bind mount.

You can extend this pattern for development, for example:

```yaml
backend:
  volumes:
    - ./backend:/app
```

This bind mount lets your backend code changes flow into the running container for faster iteration.

## Volume Commands

List volumes:

```bash
docker volume ls
```

Inspect the PostgreSQL volume:

```bash
docker volume inspect db-data
```

Remove the volume (data will be lost):

```bash
docker volume rm db-data
```

Remove unused volumes:

```bash
docker volume prune
```

Remove Compose-created volumes when tearing down the stack:

```bash
docker compose down -v
```

## Backup and Restore Volume Data

Backup the `db-data` volume to a tar archive on the host:

```bash
docker run --rm \
  -v db-data:/volume \
  -v %cd%/backup:/backup \
  busybox \
  tar czf /backup/db-data-backup.tar.gz -C /volume .
```

Restore the backup into the `db-data` volume:

```bash
docker run --rm \
  -v db-data:/volume \
  -v %cd%/backup:/backup \
  busybox \
  sh -c "cd /volume && tar xzf /backup/db-data-backup.tar.gz"
```

If you use PowerShell, replace `%cd%` with `${PWD}` and adjust quoting as needed.

---

# Log Aggregation and Visualization

A lightweight monitoring stack is now included to collect container logs and make them available in Grafana:

* Loki stores logs.
* Promtail collects logs from Docker containers and forwards them to Loki.
* Grafana provides a web UI to explore and visualize the logs.

## Start the monitoring stack

```bash
docker compose up -d loki promtail grafana
```

## Access the dashboards

* Grafana: http://localhost:3001
* Login: `admin` / `admin`

## Explore logs

In Grafana, open the Explore view and select the Loki data source. You can filter by service, container, or stream to inspect application behavior and performance trends.

---

# Docker Commands to Inspect and Manage the Network

List all Docker networks:

```bash
docker network ls
```

You should now see `dockertraining_employee-network` or `employee-network` listed after starting the stack with `docker compose up -d`, depending on the Compose project name.

Inspect the custom network:

```bash
docker network inspect dockertraining_employee-network
```

View containers connected to the network:

```bash
docker network inspect dockertraining_employee-network --format='{{range .Containers}}{{.Name}} {{end}}'
```

Disconnect a container from the network:

```bash
docker network disconnect dockertraining_employee-network <container-name>
```

Connect a container to the network:

```bash
docker network connect dockertraining_employee-network <container-name>
```

Remove the network when it is no longer needed:

```bash
docker network rm dockertraining_employee-network
```

---

# Running with Docker Compose

The application uses Docker Compose to orchestrate multiple containers and build the images directly from the updated Dockerfiles.

## Build Images

```bash
docker compose build
```

## Start Application

```bash
docker compose up -d
```

The frontend is served through Nginx on port 3000, while the backend runs on port 5000.


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
