# Inventory Management System - API Documentation

Welcome to the official API documentation for the Inventory Management System (IMS) backend. This API provides an ultra-secure, strictly typed RESTful abstraction layer engineered for high-throughput supply chain operations and real-time data orchestration.

---

## 🚀 Overview

- **Base URL**: `http://localhost:5000` (Local)
- **Content-Type**: `application/json`
- **Authentication**: JWT (JSON Web Token) via Bearer Token.

### Standard Response Format

All responses follow a consistent structural pattern:

```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": { ... }
}
```

### Standard Error Format

In case of errors, the response will follow this pattern:

```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... } // Optional detailed validation errors or Prisma meta
}
```

---

## 🔐 Authentication Module

The IMS uses JWT for security. Protected routes require the `Authorization: Bearer <token>` header.

### 1. Register User

`POST /auth/register` | `POST /auth/signup`

Registers a new system user.

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | String | Yes | Minimum 2 characters |
| `lastName` | String | Yes | Minimum 2 characters |
| `email` | String | Yes | Unique valid email address |
| `password` | String | Yes | Minimum 8 characters |
| `username` | String | No | Unique username |
| `phone` | String | No | Contact number |
| `role` | Enum | No | `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `STAFF`, `ACCOUNTANT` |

### 2. Login

`POST /auth/login`

Authenticates a user and returns a session token.

**Request Body:**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | Optional* | Required if username is missing |
| `username` | String | Optional* | Required if email is missing |
| `password` | String | Yes | User's account password |

**Success Response:** Returns the `user` object and a `token`.

### 3. Get Current User Profile

`GET /auth/me`

Retrieves the profile of the currently authenticated user.
_Requires Authentication Header._

---

## 📦 Inventory Management

### 1. Categories

Manage product classifications.

- `GET /categories`: List all categories.
- `GET /categories/:id`: Get category details.
- `POST /categories`: Create new category.
- `PUT /categories/:id`: Update category.
- `DELETE /categories/:id`: Remove category.

### 2. Products

Professional SKU mapping and metadata orchestration.

- `GET /products`: List all products.
- `GET /products/:id`: Fetch specific SKU details.
- `POST /products`: Provision new product entry.
- `PUT /products/:id`: Update existing product.
- `DELETE /products/:id`: Deprecate/Remove product.

**Product Fields:**
`sku`, `name`, `description`, `price`, `costPrice`, `weight`, `height`, `width`, `length`, `barcode`, `categoryId`, `supplierId`.

---

## 📊 Operations & Transactions

### 1. Stock Movements

Real-time tracking of inventory flow.

- `GET /stocks`: Overview of current stock levels.
- `POST /stocks/transfer`: Orchestrate warehouse-to-warehouse stock relocation.
- `POST /stocks/adjust`: Manual stock level calibration.

### 2. Sales & Purchases

Enterprise-grade order processing.

- `GET /sales`: List sales history.
- `POST /sales`: Generate new sales order.
- `GET /purchases`: List purchase history from suppliers.
- `POST /purchases`: Generate new purchase order.

---

## 🛠️ Administrative & Support

### 1. User Management

- `GET /users`: List system users (Admin Only).
- `POST /users`: Create new user with specific role.

### 2. Warehouses

- `GET /warehouses`: List all storage facilities.
- `POST /warehouses`: Register new warehouse location.

### 3. Support Modules

- **Brands**: `GET /brands`, `POST /brands`.
- **Units**: `GET /units`, `POST /units`.
- **Tax Rates**: `GET /tax-rates`, `POST /tax-rates`.
- **Invoices**: `GET /invoices`.

---

## 📝 Best Practices

1. **Graceful Error Handling**: Always check the `success` field in the response.
2. **Rate Limiting**: The API is protected by rate-limiting. Avoid high-frequency hammering of identical endpoints.
3. **Payload Compression**: The API uses Gzip compression; ensure your client supports `Accept-Encoding: gzip`.
4. **Environment Isolation**: Always use specific environment variables for `DATABASE_URL` and `JWT_SECRET`.

---

_IMS Documentation © 2026 Core Infrastructure. Precision Engineered._
