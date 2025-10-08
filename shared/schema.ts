import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["admin", "staff", "viewer"]),
  createdAt: z.string(),
});

export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "viewer"]).default("staff"),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Category Schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Supplier Schema
export const supplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.string(),
});

export const insertSupplierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  price: z.number(),
  cost: z.number(),
  quantity: z.number(),
  minStock: z.number(),
  image: z.string().optional(),
  createdAt: z.string(),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  price: z.number().min(0),
  cost: z.number().min(0),
  quantity: z.number().min(0).default(0),
  minStock: z.number().min(0).default(10),
  image: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Sale Schema
export const saleSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const insertSaleSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  customerName: z.string().optional(),
  notes: z.string().optional(),
});

export type Sale = z.infer<typeof saleSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;

// Purchase Schema
export const purchaseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  supplierId: z.string(),
  userId: z.string(),
  quantity: z.number(),
  unitCost: z.number(),
  totalCost: z.number(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const insertPurchaseSchema = z.object({
  productId: z.string(),
  supplierId: z.string(),
  userId: z.string(),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
  notes: z.string().optional(),
});

export type Purchase = z.infer<typeof purchaseSchema>;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

// Stock Alert Schema
export const stockAlertSchema = z.object({
  id: z.string(),
  productId: z.string(),
  alertType: z.enum(["low_stock", "out_of_stock", "reorder"]),
  message: z.string(),
  resolved: z.boolean(),
  createdAt: z.string(),
});

export const insertStockAlertSchema = z.object({
  productId: z.string(),
  alertType: z.enum(["low_stock", "out_of_stock", "reorder"]),
  message: z.string(),
  resolved: z.boolean().default(false),
});

export type StockAlert = z.infer<typeof stockAlertSchema>;
export type InsertStockAlert = z.infer<typeof insertStockAlertSchema>;

// AI Query Schema
export const aiQuerySchema = z.object({
  question: z.string().min(1),
});

export type AIQuery = z.infer<typeof aiQuerySchema>;

// Auth Schemas
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "viewer"]).default("staff"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
