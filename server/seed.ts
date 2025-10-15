import { db } from "./db";
import { users, categories, suppliers, products } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const [admin] = await db.insert(users).values({
    username: "admin",
    email: "admin@inventory.com",
    password: hashedPassword,
    role: "admin",
  }).returning();
  console.log("Created admin user:", admin.username);

  const [electronics] = await db.insert(categories).values({
    name: "Electronics",
    description: "Electronic devices and accessories",
  }).returning();
  console.log("Created category:", electronics.name);

  const [supplier] = await db.insert(suppliers).values({
    name: "Tech Supplies Inc",
    email: "contact@techsupplies.com",
    phone: "+1-555-0100",
    address: "123 Tech Street, Silicon Valley, CA",
  }).returning();
  console.log("Created supplier:", supplier.name);

  const [product] = await db.insert(products).values({
    sku: "SKU-1000",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with USB receiver",
    categoryId: electronics.id,
    supplierId: supplier.id,
    price: "29.99",
    cost: "15.00",
    quantity: 150,
    minStock: 20,
  }).returning();
  console.log("Created product:", product.name);

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
