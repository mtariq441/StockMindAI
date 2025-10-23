import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAIResponse } from "./ai-service";
import {
  loginSchema,
  registerSchema,
  insertProductSchema,
  insertSaleSchema,
  insertPurchaseSchema,
  insertSupplierSchema,
  insertCategorySchema,
  aiQuerySchema,
  type User,
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = user;
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password, ...userWithoutPassword } = user;
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== CATEGORY ROUTES ====================
  
  app.get("/api/categories", authenticateToken, async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/categories", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/categories/:id", authenticateToken, async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/categories/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== SUPPLIER ROUTES ====================
  
  app.get("/api/suppliers", authenticateToken, async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/suppliers", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/suppliers/:id", authenticateToken, async (req, res) => {
    try {
      const supplier = await storage.updateSupplier(req.params.id, req.body);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/suppliers/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteSupplier(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json({ message: "Supplier deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== PRODUCT ROUTES ====================
  
  app.get("/api/products", authenticateToken, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/products/low-stock", authenticateToken, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/products", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== SALES ROUTES ====================
  
  app.get("/api/sales", authenticateToken, async (req, res) => {
    try {
      const sales = await storage.getAllSales();
      res.json(sales);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/sales", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale({
        ...validatedData,
        userId: req.user.id,
      });
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/sales/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteSale(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json({ message: "Sale deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== PURCHASE ROUTES ====================
  
  app.get("/api/purchases", authenticateToken, async (req, res) => {
    try {
      const purchases = await storage.getAllPurchases();
      res.json(purchases);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/purchases", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase({
        ...validatedData,
        userId: req.user.id,
      });
      res.status(201).json(purchase);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/purchases/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deletePurchase(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      res.json({ message: "Purchase deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== STOCK ALERT ROUTES ====================
  
  app.get("/api/alerts", authenticateToken, async (req, res) => {
    try {
      const alerts = await storage.getActiveStockAlerts();
      res.json(alerts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/alerts/:id/resolve", authenticateToken, async (req, res) => {
    try {
      const alert = await storage.resolveStockAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== AI ROUTES ====================
  
  app.post("/api/ai/query", authenticateToken, async (req, res) => {
    try {
      const { question } = aiQuerySchema.parse(req.body);
      const response = await generateAIResponse(question);
      res.json({ response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== DASHBOARD ANALYTICS ====================
  
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const sales = await storage.getAllSales();
      const purchases = await storage.getAllPurchases();
      const alerts = await storage.getActiveStockAlerts();

      const totalProducts = products.length;
      const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
      const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);
      const totalCost = purchases.reduce((sum, p) => sum + parseFloat(p.totalCost), 0);
      const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const monthEnd = now.toISOString();
      const monthlySales = await storage.getSalesByDateRange(monthStart, monthEnd);
      const monthlyRevenue = monthlySales.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);

      res.json({
        totalProducts,
        totalStock,
        totalRevenue,
        totalCost,
        profit: totalRevenue - totalCost,
        lowStockCount,
        activeAlerts: alerts.length,
        monthlyRevenue,
        monthlySales: monthlySales.length,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== USER MANAGEMENT ====================
  
  app.get("/api/users", authenticateToken, async (req: any, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ==================== REPORTS ====================
  
  app.get("/api/reports/sales", authenticateToken, async (req, res) => {
    try {
      const period = req.query.period as string || 'month';
      const now = new Date();
      let startDate: Date;
      
      switch(period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      }
      
      const sales = await storage.getSalesByDateRange(startDate.toISOString(), now.toISOString());
      const products = await storage.getAllProducts();
      
      const reportData = sales.map(sale => {
        const product = products.find(p => p.id === sale.productId);
        return {
          ...sale,
          productName: product?.name || 'Unknown',
          productSku: product?.sku || 'N/A',
        };
      });
      
      const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);
      const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);
      
      res.json({
        sales: reportData,
        summary: {
          totalRevenue,
          totalQuantity,
          averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
          totalOrders: sales.length,
        },
        period,
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate sales report" });
    }
  });

  app.get("/api/reports/inventory", authenticateToken, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const categories = await storage.getAllCategories();
      const suppliers = await storage.getAllSuppliers();
      
      const reportData = products.map(product => {
        const category = categories.find(c => c.id === product.categoryId);
        const supplier = suppliers.find(s => s.id === product.supplierId);
        const stockValue = parseFloat(product.price) * product.quantity;
        const costValue = parseFloat(product.cost) * product.quantity;
        
        return {
          ...product,
          categoryName: category?.name || 'Uncategorized',
          supplierName: supplier?.name || 'Unknown',
          stockValue,
          costValue,
          profit: stockValue - costValue,
          stockStatus: product.quantity <= product.minStock ? 'Low Stock' : 'In Stock',
        };
      });
      
      const totalStockValue = reportData.reduce((sum, p) => sum + p.stockValue, 0);
      const totalCostValue = reportData.reduce((sum, p) => sum + p.costValue, 0);
      const lowStockItems = reportData.filter(p => p.quantity <= p.minStock).length;
      
      res.json({
        inventory: reportData,
        summary: {
          totalProducts: products.length,
          totalStockValue,
          totalCostValue,
          potentialProfit: totalStockValue - totalCostValue,
          lowStockItems,
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate inventory report" });
    }
  });

  app.get("/api/reports/forecast", authenticateToken, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const sales = await storage.getAllSales();
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentSales = await storage.getSalesByDateRange(thirtyDaysAgo.toISOString(), now.toISOString());
      
      const productSalesMap = new Map();
      recentSales.forEach(sale => {
        const current = productSalesMap.get(sale.productId) || { quantity: 0, revenue: 0 };
        productSalesMap.set(sale.productId, {
          quantity: current.quantity + sale.quantity,
          revenue: current.revenue + parseFloat(sale.totalPrice),
        });
      });
      
      const forecastData = products.map(product => {
        const salesData = productSalesMap.get(product.id) || { quantity: 0, revenue: 0 };
        const dailyAverage = salesData.quantity / 30;
        const weeklyForecast = Math.round(dailyAverage * 7);
        const monthlyForecast = Math.round(dailyAverage * 30);
        const daysUntilStockOut = product.quantity > 0 && dailyAverage > 0 
          ? Math.floor(product.quantity / dailyAverage) 
          : 999;
        
        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          currentStock: product.quantity,
          minStock: product.minStock,
          recentSales: salesData.quantity,
          recentRevenue: salesData.revenue,
          dailyAverage: Math.round(dailyAverage * 10) / 10,
          weeklyForecast,
          monthlyForecast,
          daysUntilStockOut: daysUntilStockOut === 999 ? 'N/A' : daysUntilStockOut,
          reorderRecommended: daysUntilStockOut < 14,
        };
      });
      
      res.json({
        forecast: forecastData,
        summary: {
          totalProducts: products.length,
          productsNeedingReorder: forecastData.filter(f => f.reorderRecommended).length,
          avgDaysToStockOut: Math.round(forecastData.reduce((sum, f) => {
            return sum + (typeof f.daysUntilStockOut === 'number' ? f.daysUntilStockOut : 0);
          }, 0) / products.length),
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate forecast report" });
    }
  });

  app.get("/api/reports/supplier", authenticateToken, async (req, res) => {
    try {
      const suppliers = await storage.getAllSuppliers();
      const purchases = await storage.getAllPurchases();
      const products = await storage.getAllProducts();
      
      const reportData = suppliers.map(supplier => {
        const supplierPurchases = purchases.filter(p => p.supplierId === supplier.id);
        const supplierProducts = products.filter(p => p.supplierId === supplier.id);
        
        const totalSpent = supplierPurchases.reduce((sum, p) => sum + parseFloat(p.totalCost), 0);
        const totalQuantity = supplierPurchases.reduce((sum, p) => sum + p.quantity, 0);
        const avgCost = supplierPurchases.length > 0 ? totalSpent / supplierPurchases.length : 0;
        
        return {
          ...supplier,
          totalOrders: supplierPurchases.length,
          totalSpent,
          totalQuantity,
          avgOrderCost: avgCost,
          productsSupplied: supplierProducts.length,
          lastOrderDate: supplierPurchases.length > 0 
            ? supplierPurchases.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )[0].createdAt 
            : null,
        };
      });
      
      const totalSpent = reportData.reduce((sum, s) => sum + s.totalSpent, 0);
      
      res.json({
        suppliers: reportData,
        summary: {
          totalSuppliers: suppliers.length,
          totalSpent,
          avgSupplierSpend: suppliers.length > 0 ? totalSpent / suppliers.length : 0,
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to generate supplier report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
