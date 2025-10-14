# 🚀 Environment Setup Guide

## For Replit (Current):

### Step 1: Add JWT_SECRET
1. Click the "Secrets" tab (🔒) in Replit sidebar
2. Add this secret:
   - **Key:** `JWT_SECRET`
   - **Value:** `jwt_secret_2024_ai_inventory_secure_key_8f92a3b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0`
3. Click "Continue" to save
4. Your app will auto-restart

✅ **That's it! Your app is ready to use in Replit**

---

## For VS Code (Local Development):

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
```bash
# Copy the example file
cp .env.local.example .env
```

### Step 3: Edit .env File
Open `.env` and configure based on your setup:

**Option A: In-Memory Storage (No Database)**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=jwt_secret_2024_ai_inventory_secure_key_8f92a3b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0
# DATABASE_URL is commented out - uses in-memory storage
```

**Option B: MySQL with XAMPP**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=jwt_secret_2024_ai_inventory_secure_key_8f92a3b5c6d7e8f9a0b1c2d3e4f5g6h7i8j9k0
DATABASE_URL=mysql://root:@localhost:3306/inventory_db
```

### Step 4: Run the App
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### Step 5: Access the App
Open browser: http://localhost:5000

---

## 🔑 Default Login Credentials

- **Username:** `admin`
- **Password:** `admin`

---

## 📁 Important Files

- **.env** - Your local environment variables (never commit!)
- **.env.example** - Template for team members
- **.env.local.example** - Detailed local development template
- **.gitignore** - Already configured to ignore .env files

---

## 🛠️ Troubleshooting

### "dotenv is not recognized"
```bash
npm install dotenv
```

### "Port 5000 already in use"
Change PORT in .env file:
```env
PORT=3000
```

### "Cannot find module"
```bash
npm install
```

---

## 📝 Notes

- The app uses **TypeScript**, but the logic is mostly JavaScript
- **In-memory storage** means data resets when you restart the server
- To persist data, uncomment DATABASE_URL in .env with your database connection
