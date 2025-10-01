# 📌 API Routes Documentation

This document provides an overview of all available API routes, grouped by module.

---

## 🔹 Departments (`/api/departments`)

| Method | Endpoint   | Auth                          | Description              |
|--------|------------|-------------------------------|--------------------------|
| POST   | `/`        | `requireAuth, requireAdmin`   | Create a new department |
| GET    | `/`        | `requireAuth, requireAdmin`   | List all departments    |
| PUT    | `/:id`     | `requireAuth, requireAdmin`   | Update department by ID |
| DELETE | `/:id`     | `requireAuth, requireAdmin`   | Delete department by ID |

---

## 🔹 Tickets (`/api/tickets`)

| Method | Endpoint                  | Auth          | Description                  |
|--------|---------------------------|---------------|------------------------------|
| POST   | `/`                       | `requireAuth` | Create a new ticket         |
| GET    | `/`                       | `requireAuth` | List all tickets            |
| GET    | `/:id`                    | `requireAuth` | Get ticket by ID            |
| GET    | `/:id/audit`              | `requireAuth` | Get ticket audit history    |
| POST   | `/:id/reply`              | `requireAuth` | Reply to a ticket           |
| POST   | `/:id/assign`             | `requireAuth` | Assign a ticket             |
| POST   | `/:id/merge`              | `requireAuth` | Merge a ticket              |
| POST   | `/:id/close`              | `requireAuth` | Close a ticket              |
| PATCH  | `/:id/status`             | `requireAuth` | Update ticket status        |
| POST   | `/:id/dependency`         | `requireAuth` | Add ticket dependency       |
| PATCH  | `/:id/dependency`         | `requireAuth` | Remove ticket dependency    |
| PATCH  | `/:id/dependency/:depId`  | `requireAuth` | Close dependency ticket     |

---

## 🔹 Status (`/api/status`)

| Method | Endpoint   | Auth                          | Description             |
|--------|------------|-------------------------------|-------------------------|
| POST   | `/`        | `requireAuth, requireAdmin`   | Create a status        |
| GET    | `/`        | `requireAuth, requireAdmin`   | List statuses          |
| PUT    | `/:id`     | `requireAuth, requireAdmin`   | Update status by ID    |
| DELETE | `/:id`     | `requireAuth, requireAdmin`   | Delete status by ID    |

---

## 🔹 Escalations (`/api/escalations`)

| Method | Endpoint   | Auth                          | Description                |
|--------|------------|-------------------------------|----------------------------|
| POST   | `/`        | `requireAuth, requireAdmin`   | Create escalation rule    |
| GET    | `/`        | `requireAuth, requireAdmin`   | List escalation rules     |
| PUT    | `/:id`     | `requireAuth, requireAdmin`   | Update escalation rule    |
| DELETE | `/:id`     | `requireAuth, requireAdmin`   | Delete escalation rule    |

---

## 🔹 Auth (`/auth`)

| Method | Endpoint           | Auth | Description                          |
|--------|--------------------|------|--------------------------------------|
| GET    | `/google`          | none | Start Google OAuth                   |
| GET    | `/google/callback` | none | Google OAuth callback → issues JWT   |
| GET    | `/failure`         | none | OAuth login failed                   |

---

## ✅ Notes
- All protected routes require a **valid JWT token** in the `Authorization` header.  
- Admin-only routes additionally require `role: admin`.  
- Ticket audit history tracks **status changes, assignments, replies, merges, and escalations**.  
