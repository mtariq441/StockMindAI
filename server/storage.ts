import {
  users,
  categories,
  suppliers,
  products,
  sales,
  purchases,
  stockAlerts,
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
import { db } from "./db";
import { eq, gte, lte, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  getAllSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

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

  getAllSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  getSalesByProduct(productId: string): Promise<Sale[]>;
  getSalesByUser(userId: string): Promise<Sale[]>;
  getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  deleteSale(id: string): Promise<boolean>;

  getAllPurchases(): Promise<Purchase[]>;
  getPurchase(id: string): Promise<Purchase | undefined>;
  getPurchasesByProduct(productId: string): Promise<Purchase[]>;
  getPurchasesBySupplier(supplierId: string): Promise<Purchase[]>;
  getPurchasesByUser(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  deletePurchase(id: string): Promise<boolean>;

  getAllStockAlerts(): Promise<StockAlert[]>;
  getActiveStockAlerts(): Promise<StockAlert[]>;
  getStockAlert(id: string): Promise<StockAlert | undefined>;
  createStockAlert(alert: InsertStockAlert): Promise<StockAlert>;
  resolveStockAlert(id: string): Promise<StockAlert | undefined>;
  deleteStockAlert(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | undefined> {
    const [category] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return category || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | undefined> {
    const [supplier] = await db.update(suppliers).set(updates).where(eq(suppliers.id, id)).returning();
    return supplier || undefined;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProductsBySupplier(supplierId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.supplierId, supplierId));
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(products).where(sql`${products.quantity} <= ${products.minStock}`);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const skuResult = await db.execute(sql`SELECT nextval('sku_sequence') as sku_num`);
    const skuNum = (skuResult.rows[0] as any).sku_num;
    const sku = `SKU-${skuNum}`;
    
    const [product] = await db.insert(products).values({ ...insertProduct, sku }).returning();

    if (Number(product.quantity) <= Number(product.minStock)) {
      await this.createStockAlert({
        productId: product.id,
        alertType: Number(product.quantity) === 0 ? "out_of_stock" : "low_stock",
        message: `${product.name} is ${Number(product.quantity) === 0 ? "out of stock" : "running low"}. Current stock: ${product.quantity}`,
        resolved: false,
      });
    }

    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    
    if (product && Number(product.quantity) <= Number(product.minStock)) {
      await this.createStockAlert({
        productId: id,
        alertType: Number(product.quantity) === 0 ? "out_of_stock" : "low_stock",
        message: `${product.name} is ${Number(product.quantity) === 0 ? "out of stock" : "running low"}. Current stock: ${product.quantity}`,
        resolved: false,
      });
    }

    return product || undefined;
  }

  async updateProductStock(id: string, quantity: number): Promise<Product | undefined> {
    return this.updateProduct(id, { quantity });
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllSales(): Promise<Sale[]> {
    return await db.select().from(sales);
  }

  async getSale(id: string): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async getSalesByProduct(productId: string): Promise<Sale[]> {
    return await db.select().from(sales).where(eq(sales.productId, productId));
  }

  async getSalesByUser(userId: string): Promise<Sale[]> {
    return await db.select().from(sales).where(eq(sales.userId, userId));
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    return await db.select().from(sales).where(
      and(
        gte(sales.createdAt, new Date(startDate)),
        lte(sales.createdAt, new Date(endDate))
      )
    );
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    return await db.transaction(async (tx) => {
      const [product] = await tx.select().from(products).where(eq(products.id, insertSale.productId));
      
      if (!product) {
        throw new Error(`Product with id ${insertSale.productId} not found`);
      }

      const newQuantity = Number(product.quantity) - insertSale.quantity;
      if (newQuantity < 0) {
        throw new Error(`Insufficient stock. Available: ${product.quantity}, Requested: ${insertSale.quantity}`);
      }

      const totalPrice = Number(insertSale.quantity) * Number(insertSale.unitPrice);
      
      const [updatedProduct] = await tx
        .update(products)
        .set({ quantity: newQuantity })
        .where(eq(products.id, insertSale.productId))
        .returning();

      const [sale] = await tx.insert(sales).values({ 
        ...insertSale, 
        totalPrice: totalPrice.toString() 
      }).returning();

      if (newQuantity <= Number(updatedProduct.minStock)) {
        await tx.insert(stockAlerts).values({
          productId: product.id,
          alertType: newQuantity === 0 ? "out_of_stock" : "low_stock",
          message: `${product.name} is ${newQuantity === 0 ? "out of stock" : "running low"}. Current stock: ${newQuantity}`,
          resolved: false,
        });
      }

      return sale;
    });
  }

  async deleteSale(id: string): Promise<boolean> {
    const result = await db.delete(sales).where(eq(sales.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases);
  }

  async getPurchase(id: string): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || undefined;
  }

  async getPurchasesByProduct(productId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.productId, productId));
  }

  async getPurchasesBySupplier(supplierId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.supplierId, supplierId));
  }

  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.userId, userId));
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    return await db.transaction(async (tx) => {
      const [product] = await tx.select().from(products).where(eq(products.id, insertPurchase.productId));
      
      if (!product) {
        throw new Error(`Product with id ${insertPurchase.productId} not found`);
      }

      const newQuantity = Number(product.quantity) + insertPurchase.quantity;
      const totalCost = Number(insertPurchase.quantity) * Number(insertPurchase.unitCost);
      
      await tx
        .update(products)
        .set({ quantity: newQuantity })
        .where(eq(products.id, insertPurchase.productId));

      const [purchase] = await tx.insert(purchases).values({ 
        ...insertPurchase, 
        totalCost: totalCost.toString() 
      }).returning();

      return purchase;
    });
  }

  async deletePurchase(id: string): Promise<boolean> {
    const result = await db.delete(purchases).where(eq(purchases.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllStockAlerts(): Promise<StockAlert[]> {
    return await db.select().from(stockAlerts);
  }

  async getActiveStockAlerts(): Promise<StockAlert[]> {
    return await db.select().from(stockAlerts).where(eq(stockAlerts.resolved, false));
  }

  async getStockAlert(id: string): Promise<StockAlert | undefined> {
    const [alert] = await db.select().from(stockAlerts).where(eq(stockAlerts.id, id));
    return alert || undefined;
  }

  async createStockAlert(insertAlert: InsertStockAlert): Promise<StockAlert> {
    const [alert] = await db.insert(stockAlerts).values(insertAlert).returning();
    return alert;
  }

  async resolveStockAlert(id: string): Promise<StockAlert | undefined> {
    const [alert] = await db.update(stockAlerts).set({ resolved: true }).where(eq(stockAlerts.id, id)).returning();
    return alert || undefined;
  }

  async deleteStockAlert(id: string): Promise<boolean> {
    const result = await db.delete(stockAlerts).where(eq(stockAlerts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
