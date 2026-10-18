# TaskPulse API ⚡

> High-performance Task & Workflow Management REST API built with TypeScript, Express, and Zod.

This repository serves as a production-grade backend service used to evaluate automated code reviews, edge case discovery, and security auditing with **Codzee**.

---

## 🚀 Features

- **TypeScript Architecture**: Strict mode enabled with clean separation of controllers, services, middleware, and schema validation.
- **Robust Authentication**: JWT-based token authentication with bcrypt password hashing and role-based access control (RBAC).
- **Type-Safe Validation**: Runtime request parsing and validation using Zod.
- **RESTful Endpoints**: Full CRUD for tasks, status/priority filtering, search, and user profile management.
- **Automated Testing Suite**: Integration and unit tests implemented with Jest and Supertest.
- **Zero-Config Database**: Fast in-memory data store with seed fixtures for immediate local execution.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (>= 18)
- **Language:** TypeScript
- **Framework:** Express.js
- **Validation:** Zod
- **Security:** bcryptjs, jsonwebtoken, cors
- **Testing:** Jest, ts-jest, supertest

---

## 📁 Project Structure

```text
taskpulse-api/
├── src/
│   ├── controllers/         # Request handling & HTTP response logic
│   │   ├── auth.controller.ts
│   │   └── task.controller.ts
│   ├── db/                  # Data store & seed fixtures
│   │   └── store.ts
│   ├── middleware/          # Auth, request validation & error handling
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/              # Express route declarations
│   │   ├── auth.routes.ts
│   │   ├── health.routes.ts
│   │   └── task.routes.ts
│   ├── schemas/             # Zod input validation schemas
│   │   ├── auth.schema.ts
│   │   └── task.schema.ts
│   ├── types/               # TypeScript interfaces & types
│   │   └── index.ts
│   ├── utils/               # Helper utilities (JWT, custom AppErrors)
│   │   ├── errors.ts
│   │   └── jwt.ts
│   ├── app.ts               # Express application factory
│   └── server.ts            # Entry point & port listener
├── tests/                   # Integration and unit tests
│   ├── auth.test.ts
│   ├── health.test.ts
│   └── tasks.test.ts
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🏁 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy the sample environment file:

```bash
cp .env.example .env
```

### 3. Running in Development

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### 4. Running Tests

```bash
npm test
```

---

## 📡 API Reference

### Health Check
- `GET /health` - Service heartbeat & uptime status

### Authentication
- `POST /api/v1/auth/register` - Create a new user account
- `POST /api/v1/auth/login` - Authenticate user & receive JWT token
- `GET /api/v1/auth/me` - Get authenticated user profile *(Requires Bearer token)*

### Tasks
- `GET /api/v1/tasks` - List tasks (Supports query params: `?status=...&priority=...&search=...`) *(Requires Bearer token)*
- `GET /api/v1/tasks/:id` - Get task details *(Requires Bearer token)*
- `POST /api/v1/tasks` - Create a new task *(Requires Bearer token)*
- `PATCH /api/v1/tasks/:id` - Update task status/content *(Requires Bearer token)*
- `DELETE /api/v1/tasks/:id` - Delete task *(Requires Bearer token)*

---

## 🧪 Codzee Evaluation PR Roadmap

This repository is configured to benchmark **Codzee's** automated review capabilities across 3 pull requests:
1. **PR 1: Feature Addition** - Task Assignment, Audit Activity Log & Notification Hooks.
2. **PR 2: Security & Bug Fixes** - Boundary authorization, IDOR prevention, and async error trapping.
3. **PR 3: Performance & Refactoring** - In-memory indexing, query optimization, and test coverage expansion.
