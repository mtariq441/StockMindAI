import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Sale,
  type InsertSale,
  type Purchase,
  type InsertPurchase,
  type Supplier,
  type InsertSupplier,
  type Category,
  type InsertCategory,
  type StockAlert,
  type InsertStockAlert,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Supplier operations
  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProductsBySupplier(supplierId: string): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  updateProductStock(id: string, quantity: number): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Sale operations
  getAllSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  getSalesByProduct(productId: string): Promise<Sale[]>;
  getSalesByUser(userId: string): Promise<Sale[]>;
  getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  deleteSale(id: string): Promise<boolean>;

  // Purchase operations
  getAllPurchases(): Promise<Purchase[]>;
  getPurchase(id: string): Promise<Purchase | undefined>;
  getPurchasesByProduct(productId: string): Promise<Purchase[]>;
  getPurchasesBySupplier(supplierId: string): Promise<Purchase[]>;
  getPurchasesByUser(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  deletePurchase(id: string): Promise<boolean>;

  // Stock Alert operations
  getAllStockAlerts(): Promise<StockAlert[]>;
  getActiveStockAlerts(): Promise<StockAlert[]>;
  getStockAlert(id: string): Promise<StockAlert | undefined>;
  createStockAlert(alert: InsertStockAlert): Promise<StockAlert>;
  resolveStockAlert(id: string): Promise<StockAlert | undefined>;
  deleteStockAlert(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private suppliers: Map<string, Supplier>;
  private products: Map<string, Product>;
  private sales: Map<string, Sale>;
  private purchases: Map<string, Purchase>;
  private stockAlerts: Map<string, StockAlert>;
  private skuCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.suppliers = new Map();
    this.products = new Map();
    this.sales = new Map();
    this.purchases = new Map();
    this.stockAlerts = new Map();
    this.skuCounter = 1000;
    this.seedData();
  }

  private seedData() {
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@inventory.com",
      password: "$2b$10$TvP7Mi6cMBUqLElgSoexIeIJtWP/SUEUSdMMprqlz47EcIVvSi5tO",
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    const electronics: Category = {
      id: randomUUID(),
      name: "Electronics",
      description: "Electronic devices and accessories",
      createdAt: new Date().toISOString(),
    };
    this.categories.set(electronics.id, electronics);

    const supplier: Supplier = {
      id: randomUUID(),
      name: "Tech Supplies Inc",
      email: "contact@techsupplies.com",
      phone: "+1-555-0100",
      address: "123 Tech Street, Silicon Valley, CA",
      createdAt: new Date().toISOString(),
    };
    this.suppliers.set(supplier.id, supplier);

    const product: Product = {
      id: randomUUID(),
      sku: this.generateSku(),
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with USB receiver",
      categoryId: electronics.id,
      supplierId: supplier.id,
      price: 29.99,
      cost: 15.00,
      quantity: 150,
      minStock: 20,
      createdAt: new Date().toISOString(),
    };
    this.products.set(product.id, product);
  }

  private generateSku(): string {
    return `SKU-${this.skuCounter++}`;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date().toISOString(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Supplier operations
  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = {
      ...insertSupplier,
      id,
      createdAt: new Date().toISOString(),
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    const updatedSupplier = { ...supplier, ...updates };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku
    );
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsBySupplier(supplierId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.supplierId === supplierId
    );
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.quantity <= product.minStock
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const sku = this.generateSku();
    const product: Product = {
      ...insertProduct,
      id,
      sku,
      createdAt: new Date().toISOString(),
    };
    this.products.set(id, product);

    if (product.quantity <= product.minStock) {
      await this.createStockAlert({
        productId: id,
        alertType: product.quantity === 0 ? "out_of_stock" : "low_stock",
        message: `${product.name} is ${product.quantity === 0 ? "out of stock" : "running low"}. Current stock: ${product.quantity}`,
        resolved: false,
      });
    }

    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);

    if (updatedProduct.quantity <= updatedProduct.minStock) {
      await this.createStockAlert({
        productId: id,
        alertType: updatedProduct.quantity === 0 ? "out_of_stock" : "low_stock",
        message: `${updatedProduct.name} is ${updatedProduct.quantity === 0 ? "out of stock" : "running low"}. Current stock: ${updatedProduct.quantity}`,
        resolved: false,
      });
    }

    return updatedProduct;
  }

  async updateProductStock(id: string, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    return this.updateProduct(id, { quantity });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Sale operations
  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async getSalesByProduct(productId: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.productId === productId
    );
  }

  async getSalesByUser(userId: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.userId === userId
    );
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const totalPrice = insertSale.quantity * insertSale.unitPrice;
    const sale: Sale = {
      ...insertSale,
      id,
      totalPrice,
      createdAt: new Date().toISOString(),
    };
    this.sales.set(id, sale);

    const product = await this.getProduct(insertSale.productId);
    if (product) {
      await this.updateProductStock(
        insertSale.productId,
        product.quantity - insertSale.quantity
      );
    }

    return sale;
  }

  async deleteSale(id: string): Promise<boolean> {
    return this.sales.delete(id);
  }

  // Purchase operations
  async getAllPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values());
  }

  async getPurchase(id: string): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async getPurchasesByProduct(productId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.productId === productId
    );
  }

  async getPurchasesBySupplier(supplierId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.supplierId === supplierId
    );
  }

  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.userId === userId
    );
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = randomUUID();
    const totalCost = insertPurchase.quantity * insertPurchase.unitCost;
    const purchase: Purchase = {
      ...insertPurchase,
      id,
      totalCost,
      createdAt: new Date().toISOString(),
    };
    this.purchases.set(id, purchase);

    const product = await this.getProduct(insertPurchase.productId);
    if (product) {
      await this.updateProductStock(
        insertPurchase.productId,
        product.quantity + insertPurchase.quantity
      );
    }

    return purchase;
  }

  async deletePurchase(id: string): Promise<boolean> {
    return this.purchases.delete(id);
  }

  // Stock Alert operations
  async getAllStockAlerts(): Promise<StockAlert[]> {
    return Array.from(this.stockAlerts.values());
  }

  async getActiveStockAlerts(): Promise<StockAlert[]> {
    return Array.from(this.stockAlerts.values()).filter(
      (alert) => !alert.resolved
    );
  }

  async getStockAlert(id: string): Promise<StockAlert | undefined> {
    return this.stockAlerts.get(id);
  }

  async createStockAlert(insertAlert: InsertStockAlert): Promise<StockAlert> {
    const id = randomUUID();
    const alert: StockAlert = {
      ...insertAlert,
      id,
      createdAt: new Date().toISOString(),
    };
    this.stockAlerts.set(id, alert);
    return alert;
  }

  async resolveStockAlert(id: string): Promise<StockAlert | undefined> {
    const alert = this.stockAlerts.get(id);
    if (!alert) return undefined;
    const resolvedAlert = { ...alert, resolved: true };
    this.stockAlerts.set(id, resolvedAlert);
    return resolvedAlert;
  }

  async deleteStockAlert(id: string): Promise<boolean> {
    return this.stockAlerts.delete(id);
  }
}

export const storage = new MemStorage();
