# AI Inventory Management System - API Documentation

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Request Body:
```json
{
  "username": "string",
  "email": "string",
  "password": "string (min 6 characters)",
  "role": "admin" | "staff" | "viewer" (optional, defaults to "staff")
}
```

Response:
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### Login
**POST** `/api/auth/login`

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### Get Current User
**GET** `/api/auth/me`

Headers: `Authorization: Bearer <token>`

Response: User object

---

## 📦 Product Endpoints

### Get All Products
**GET** `/api/products`

### Get Low Stock Products
**GET** `/api/products/low-stock`

### Get Single Product
**GET** `/api/products/:id`

### Create Product
**POST** `/api/products`

Request Body:
```json
{
  "name": "string",
  "description": "string (optional)",
  "categoryId": "string (optional)",
  "supplierId": "string (optional)",
  "price": number,
  "cost": number,
  "quantity": number,
  "minStock": number,
  "image": "string (optional)"
}
```

### Update Product
**PUT** `/api/products/:id`

Request Body: Partial product object

### Delete Product
**DELETE** `/api/products/:id`

---

## 📂 Category Endpoints

### Get All Categories
**GET** `/api/categories`

### Create Category
**POST** `/api/categories`

Request Body:
```json
{
  "name": "string",
  "description": "string (optional)"
}
```

### Update Category
**PUT** `/api/categories/:id`

### Delete Category
**DELETE** `/api/categories/:id`

---

## 🏢 Supplier Endpoints

### Get All Suppliers
**GET** `/api/suppliers`

### Create Supplier
**POST** `/api/suppliers`

Request Body:
```json
{
  "name": "string",
  "email": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

### Update Supplier
**PUT** `/api/suppliers/:id`

### Delete Supplier
**DELETE** `/api/suppliers/:id`

---

## 💰 Sales Endpoints

### Get All Sales
**GET** `/api/sales`

### Create Sale
**POST** `/api/sales`

Request Body:
```json
{
  "productId": "string",
  "quantity": number,
  "unitPrice": number,
  "customerName": "string (optional)",
  "notes": "string (optional)"
}
```

Note: `userId` is automatically set from the authenticated user

### Delete Sale
**DELETE** `/api/sales/:id`

---

## 🛒 Purchase Endpoints

### Get All Purchases
**GET** `/api/purchases`

### Create Purchase
**POST** `/api/purchases`

Request Body:
```json
{
  "productId": "string",
  "supplierId": "string",
  "quantity": number,
  "unitCost": number,
  "notes": "string (optional)"
}
```

Note: `userId` is automatically set from the authenticated user

### Delete Purchase
**DELETE** `/api/purchases/:id`

---

## ⚠️ Stock Alert Endpoints

### Get Active Alerts
**GET** `/api/alerts`

### Resolve Alert
**PATCH** `/api/alerts/:id/resolve`

---

## 🤖 AI Business Intelligence

### Query AI Assistant
**POST** `/api/ai/query`

Request Body:
```json
{
  "question": "string"
}
```

Response:
```json
{
  "response": "string"
}
```

Example Questions:
- "Which products need restocking?"
- "What are my top selling products?"
- "Show me my total revenue"
- "What's my profit margin?"
- "How are my categories performing?"
- "What alerts do I have?"

**Note:** For enhanced AI responses, add your OpenAI API key to environment variables as `OPENAI_API_KEY`

---

## 📊 Dashboard Analytics

### Get Dashboard Statistics
**GET** `/api/dashboard/stats`

Response:
```json
{
  "totalProducts": number,
  "totalStock": number,
  "totalRevenue": number,
  "totalCost": number,
  "profit": number,
  "lowStockCount": number,
  "activeAlerts": number,
  "monthlyRevenue": number,
  "monthlySales": number
}
```

---

## 👥 User Management (Admin Only)

### Get All Users
**GET** `/api/users`

Requires admin role

---

## Features Implemented

✅ **User Authentication**
- JWT-based authentication
- Role-based access (Admin, Staff, Viewer)
- Secure password hashing with bcrypt

✅ **Product Management**
- CRUD operations for products
- Auto-generated SKU codes
- Category and supplier associations
- Stock tracking

✅ **Inventory & Stock Tracking**
- Automatic stock updates on sales/purchases
- Low stock alerts
- Out of stock notifications
- Reorder recommendations

✅ **Sales & Purchase Management**
- Transaction recording
- Automatic stock adjustments
- User tracking for all transactions

✅ **AI Business Intelligence**
- Natural language query processing
- OpenAI integration (when API key is provided)
- Fallback rule-based responses
- Business insights and recommendations

✅ **Dashboard Analytics**
- Real-time statistics
- Monthly performance metrics
- Profit calculations
- Alert summaries

---

## Tech Stack

- **Backend:** Node.js + Express.js + TypeScript
- **Storage:** In-memory storage (MemStorage) with full CRUD operations
- **Authentication:** JWT + bcrypt
- **Validation:** Zod schemas
- **AI:** OpenAI API (gpt-4o-mini)
- **Auto Features:** 
  - SKU generation
  - Stock alerts
  - Automatic inventory updates

---

## Getting Started

1. **Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

2. **Login and get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

3. **Use the token in subsequent requests:**
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Seed Data

The system comes with sample data:
- 1 Admin user
- 1 Category (Electronics)
- 1 Supplier (Tech Supplies Inc)
- 1 Product (Wireless Mouse)

## Environment Variables

Optional environment variables:
- `OPENAI_API_KEY` - For enhanced AI features
- `JWT_SECRET` - For JWT token signing (defaults to development key)

---

## Notes

- All timestamps are in ISO 8601 format
- Product stock automatically updates on sales and purchases
- Stock alerts are automatically created when products reach minimum stock levels
- The AI can provide insights with or without OpenAI API key (fallback mode available)
