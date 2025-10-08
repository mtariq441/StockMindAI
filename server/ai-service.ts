import OpenAI from "openai";
import { storage } from "./storage";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateAIResponse(question: string): Promise<string> {
  // Get comprehensive inventory data
  const products = await storage.getAllProducts();
  const sales = await storage.getAllSales();
  const purchases = await storage.getAllPurchases();
  const lowStockProducts = await storage.getLowStockProducts();
  const alerts = await storage.getActiveStockAlerts();
  const categories = await storage.getAllCategories();
  const suppliers = await storage.getAllSuppliers();

  // Calculate key metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalCost = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const profit = totalRevenue - totalCost;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

  // Product sales analysis
  const productSalesMap = new Map<string, { count: number; revenue: number; name: string }>();
  for (const sale of sales) {
    const product = await storage.getProduct(sale.productId);
    if (product) {
      const existing = productSalesMap.get(sale.productId) || { count: 0, revenue: 0, name: product.name };
      productSalesMap.set(sale.productId, {
        count: existing.count + sale.quantity,
        revenue: existing.revenue + sale.totalPrice,
        name: product.name,
      });
    }
  }

  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // If OpenAI API is available, use it for intelligent responses
  if (openai) {
    try {
      const context = `
You are an AI business intelligence assistant for an inventory management system.

INVENTORY SUMMARY:
- Total Products: ${products.length}
- Total Stock Units: ${totalStock}
- Categories: ${categories.length} (${categories.map(c => c.name).join(", ")})
- Suppliers: ${suppliers.length}

FINANCIAL METRICS:
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Cost: $${totalCost.toFixed(2)}
- Profit: $${profit.toFixed(2)}
- Total Sales: ${sales.length} transactions
- Total Purchases: ${purchases.length} orders

STOCK ALERTS:
- Low Stock Products: ${lowStockProducts.length}
- Active Alerts: ${alerts.length}
${lowStockProducts.slice(0, 5).map(p => `  - ${p.name}: ${p.quantity} units (min: ${p.minStock})`).join("\n")}

TOP PERFORMING PRODUCTS:
${topProducts.map((p, i) => `${i + 1}. ${p.name} - ${p.count} units sold, $${p.revenue.toFixed(2)} revenue`).join("\n")}

RECENT SALES (Last 5):
${sales.slice(-5).map(s => `- ${s.customerName || "Customer"}: ${s.quantity} units at $${s.unitPrice} each`).join("\n")}

Answer the following business question with insights and actionable recommendations based on this data:
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: context,
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || "I couldn't generate a response. Please try again.";
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      // Fall back to rule-based system
    }
  }

  // Fallback: Rule-based responses when OpenAI is not available
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes("low stock") || lowerQuestion.includes("restock")) {
    if (lowStockProducts.length === 0) {
      return "✅ All products are well-stocked! No restocking needed at this time.";
    }
    const productList = lowStockProducts.slice(0, 5).map(p => `• ${p.name}: ${p.quantity} units (min stock: ${p.minStock})`).join("\n");
    return `⚠️ You have ${lowStockProducts.length} product(s) that need restocking:\n\n${productList}\n\n💡 Recommendation: Reorder these items soon to avoid stockouts and maintain customer satisfaction.`;
  }

  if (lowerQuestion.includes("total sales") || lowerQuestion.includes("revenue")) {
    const avgSale = sales.length > 0 ? totalRevenue / sales.length : 0;
    return `💰 Sales Performance:\n• Total Revenue: $${totalRevenue.toFixed(2)}\n• Total Transactions: ${sales.length}\n• Average Sale Value: $${avgSale.toFixed(2)}\n• Profit Margin: $${profit.toFixed(2)}\n\n${profit > 0 ? "📈 Your business is profitable!" : "📉 Review your pricing strategy to improve margins."}`;
  }

  if (lowerQuestion.includes("top product") || lowerQuestion.includes("best seller")) {
    if (topProducts.length === 0) {
      return "📊 No sales data available yet. Start recording sales to see your top performers!";
    }
    const topList = topProducts.map((p, i) => `${i + 1}. ${p.name}: ${p.count} units sold, $${p.revenue.toFixed(2)} revenue`).join("\n");
    return `🏆 Top Performing Products:\n\n${topList}\n\n💡 Focus on keeping these bestsellers in stock and consider promoting similar items.`;
  }

  if (lowerQuestion.includes("alert") || lowerQuestion.includes("warning")) {
    if (alerts.length === 0) {
      return "✅ No active alerts! Your inventory is in excellent shape.";
    }
    const alertList = alerts.slice(0, 5).map(a => `• ${a.message}`).join("\n");
    return `⚠️ Active Alerts (${alerts.length}):\n\n${alertList}\n\n💡 Address these alerts to maintain optimal inventory levels.`;
  }

  if (lowerQuestion.includes("profit") || lowerQuestion.includes("margin")) {
    const margin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;
    return `💵 Profitability Analysis:\n• Total Revenue: $${totalRevenue.toFixed(2)}\n• Total Cost: $${totalCost.toFixed(2)}\n• Net Profit: $${profit.toFixed(2)}\n• Profit Margin: ${margin}%\n\n${Number(margin) > 20 ? "🎉 Excellent profit margin!" : Number(margin) > 10 ? "👍 Good profit margin." : "⚠️ Consider optimizing costs or increasing prices."}`;
  }

  if (lowerQuestion.includes("category") || lowerQuestion.includes("categories")) {
    const categoryStats = categories.map(cat => {
      const catProducts = products.filter(p => p.categoryId === cat.id);
      const catRevenue = sales
        .filter(s => catProducts.some(p => p.id === s.productId))
        .reduce((sum, s) => sum + s.totalPrice, 0);
      return { name: cat.name, products: catProducts.length, revenue: catRevenue };
    }).sort((a, b) => b.revenue - a.revenue);

    const catList = categoryStats.map((c, i) => `${i + 1}. ${c.name}: ${c.products} products, $${c.revenue.toFixed(2)} revenue`).join("\n");
    return `📂 Category Performance:\n\n${catList}\n\n💡 Focus inventory investment on top-performing categories.`;
  }

  // Default response with helpful suggestions
  return `🤖 AI Business Intelligence Assistant\n\nI can help you analyze your inventory data! Try asking about:\n\n📦 Inventory:\n• "Which products need restocking?"\n• "Show me low stock items"\n\n💰 Sales:\n• "What are my top selling products?"\n• "What's my total revenue?"\n• "Show me profit margins"\n\n📊 Analytics:\n• "How are my categories performing?"\n• "What alerts do I have?"\n\nJust ask your question in natural language!`;
}
