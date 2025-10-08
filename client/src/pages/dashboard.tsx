import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Brain } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const salesData = [
  { month: "Jan", sales: 4000, forecast: 4200 },
  { month: "Feb", sales: 3000, forecast: 3200 },
  { month: "Mar", sales: 5000, forecast: 4800 },
  { month: "Apr", sales: 4500, forecast: 4600 },
  { month: "May", sales: 6000, forecast: 5900 },
  { month: "Jun", sales: 5500, forecast: 5700 },
];

const productData = [
  { name: "Electronics", value: 45 },
  { name: "Clothing", value: 30 },
  { name: "Food", value: 15 },
  { name: "Others", value: 10 },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalProducts: number;
    totalRevenue: number;
    lowStockCount: number;
    monthlyRevenue: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: lowStockProducts, isLoading: lowStockLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/low-stock"],
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory and sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={stats?.totalProducts.toString() || "0"}
              icon={Package}
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats?.totalRevenue.toLocaleString() || "0"}`}
              icon={TrendingUp}
            />
            <StatCard
              title="Low Stock Items"
              value={stats?.lowStockCount.toString() || "0"}
              icon={AlertTriangle}
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${stats?.monthlyRevenue.toLocaleString() || "0"}`}
              icon={Brain}
              description="This month"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend & AI Forecast</CardTitle>
            <CardDescription>Actual sales vs AI predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Actual Sales" />
                <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" name="AI Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Stock by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-3" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>Items that need restocking soon</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : lowStockProducts && lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {product.quantity} | Min: {product.minStock}
                    </p>
                  </div>
                  <Badge variant="destructive">Low Stock</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No low stock items</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
