# Inventory Management System (IMS) - Backend

A robust, secure, and scalable server application built with **ExpressJS** and **TypeScript**. Designed to manage complex inventory flows, multi-warehouse operations, and professional supply chain logistics.

---

## ✨ Features

- **🔐 Enterprise Security**: JWT-based authentication with role-based access control (RBAC).
- **📦 Advanced Inventory**: Multi-warehouse stock tracking, real-time inventory movements, and automated stock alerts.
- **📊 Business Operations**: Professional management of Purchase Orders, Sales Orders, Invoices, and Payments.
- **⚡ High Performance**: Optimized with Prisma ORM, NeonDB (PostgreSQL), and server-side response compression.
- **🛡️ Robust Architecture**: Strictly typed with TypeScript, validated with Zod, and secured with Helmet.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES6+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Validation**: Zod
- **Security**: JWT, Bcrypt, Helmet, CORS
- **Documentation**: Professional Markdown-based Docs

## 📖 Documentation

For detailed information on all available endpoints, request/response formats, and authentication flow, please refer to the:

### 👉 [**API Documentation (API_DOCUMENTATION.md)**](./API_DOCUMENTATION.md)

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy the `.env.example` to `.env` and populate your NeonDB connection string and JWT secret.

```bash
cp .env.example .env
```

### 3. Database Initialization

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Development

```bash
npm run dev
```

The server will be running on `http://localhost:5000`.

---

_Developed by Jobet P. Casquejo. Precision Architecture for Modern Business._
