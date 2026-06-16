# Employee Management Demo

Simple full-stack demo using React, Node.js (Express), and PostgreSQL. Containerized with Docker and orchestrated with Docker Compose. Includes a sample GitHub Actions CI workflow.

Architecture:

React -> Node API -> PostgreSQL

Setup

Run without Docker

Frontend:

```
cd frontend
npm install
npm start
```

Backend:

```
cd backend
npm install
npm start
```

Run with Docker

```
docker compose up --build
```

API Endpoints

- GET /employees - list employees
- POST /employees - create { name, email, department }
- DELETE /employees/:id - delete employee

Project Structure

```
project-root/
├── frontend/
├── backend/
├── database/
├── .github/
└── docker-compose.yml
```
use http://localhost:3000 to run frontend application

Troubleshooting

- If the frontend cannot reach the backend in Docker, ensure `REACT_APP_API_URL` points to `http://localhost:5000` or the correct host.
- Database initialization uses `database/init.sql`; inspect logs if schema not created.
