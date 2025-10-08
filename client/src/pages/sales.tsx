import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

//todo: remove mock functionality
const salesHistory = [
  { id: "S001", date: "2025-01-08", product: "Wireless Mouse", quantity: 5, total: "$149.95", status: "Completed" },
  { id: "S002", date: "2025-01-08", product: "USB Cable", quantity: 10, total: "$99.90", status: "Completed" },
  { id: "S003", date: "2025-01-07", product: "Keyboard", quantity: 3, total: "$179.97", status: "Completed" },
  { id: "S004", date: "2025-01-07", product: "Monitor Stand", quantity: 2, total: "$79.98", status: "Completed" },
  { id: "S005", date: "2025-01-06", product: "Webcam", quantity: 4, total: "$319.96", status: "Completed" },
];

const dailySales = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1900 },
  { day: "Wed", sales: 1600 },
  { day: "Thu", sales: 2200 },
  { day: "Fri", sales: 2800 },
  { day: "Sat", sales: 1500 },
  { day: "Sun", sales: 900 },
];

export default function Sales() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Track and record sales transactions</p>
        </div>
        <Button data-testid="button-record-sale">
          <Plus className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Sales Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Performance</CardTitle>
          <CardDescription>Sales overview for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Latest sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sale ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-sale-${sale.id}`}>
                    <td className="py-3 px-4 text-sm font-mono">{sale.id}</td>
                    <td className="py-3 px-4 text-sm">{sale.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{sale.product}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{sale.quantity}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{sale.total}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="secondary">{sale.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
