# Employee Management Demo

A simple full-stack employee management application built with:

* **Frontend:** React
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose
* **CI/CD:** GitHub Actions

## Architecture

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

## Prerequisites

### Local Development

* Node.js 18+
* npm
* PostgreSQL

### Docker Development

* Docker Engine or Docker Desktop
* Docker Compose

### WSL2 Development (Windows)

* WSL2 enabled
* Ubuntu 24.04 (or later)
* Visual Studio Code
* Remote - WSL extension
* Docker Engine installed inside WSL

---

## Project Structure

```text
project-root/
├── frontend/
├── backend/
├── database/
├── .github/
└── docker-compose.yml
```

---

## Running Without Docker

### Start the Backend

```bash
cd backend
npm install
npm start
```

The API will be available at:

```text
http://localhost:5000
```

### Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The application will be available at:

```text
http://localhost:3000
```

---

## Running With Docker

From the project root:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d --build
```

Stop containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

### Application URLs

Frontend:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:5000
```

---

## Running with WSL2 and VS Code

### Verify WSL Installation

Open PowerShell:

```powershell
wsl -l -v
```

Example output:

```text
NAME            STATE           VERSION
Ubuntu-24.04    Running         2
```

### Open the Project in WSL

Start Ubuntu:

```powershell
wsl
```

Navigate to the project:

```bash
cd /mnt/c/DockerTraining
```

Open VS Code:

```bash
code .
```

Verify VS Code is connected to WSL by checking the bottom-left corner:

```text
WSL: Ubuntu-24.04
```

### Verify Docker

Inside the WSL terminal:

```bash
docker --version
docker compose version
```

### Build and Run Containers

From the project root:

```bash
docker compose up --build
```

The application will be available at:

```text
http://localhost:3000
```

---

## API Endpoints

### Get All Employees

```http
GET /employees
```

### Create Employee

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

### Delete Employee

```http
DELETE /employees/:id
```

---

## Database Initialization

Database schema and seed data are created using:

```text
database/init.sql
```

---

## GitHub Actions

A sample GitHub Actions workflow is included under:

```text
.github/workflows/
```

The workflow can be extended to:

* Run tests
* Build Docker images
* Perform code quality checks
* Deploy to cloud environments

---

## Troubleshooting

### Docker Command Not Found

If you receive:

```text
docker: command not found
```

Ensure Docker Engine is installed and running inside WSL.

Verify:

```bash
docker --version
```

### Cannot Connect to Docker Daemon

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

### Frontend Cannot Reach Backend

Ensure:

```text
REACT_APP_API_URL=http://localhost:5000
```

or update it to the correct backend host.

### Database Schema Not Created

Check container logs:

```bash
docker compose logs db
```

Verify that:

```text
database/init.sql
```

is mounted correctly and executed during database startup.

### Port Already in Use

If ports 3000 or 5000 are already in use:

```bash
sudo lsof -i :3000
sudo lsof -i :5000
```

Stop the conflicting process or update the port mappings in `docker-compose.yml`.
