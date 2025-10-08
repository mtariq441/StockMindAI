import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Download, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

//todo: remove mock functionality
const forecastData = [
  { date: "Jan 1", actual: 4000, predicted: 3800, confidence: 200 },
  { date: "Jan 8", actual: 3000, predicted: 3200, confidence: 180 },
  { date: "Jan 15", actual: 5000, predicted: 4800, confidence: 250 },
  { date: "Jan 22", actual: 4500, predicted: 4600, confidence: 220 },
  { date: "Jan 29", actual: null, predicted: 5200, confidence: 300 },
  { date: "Feb 5", actual: null, predicted: 5500, confidence: 350 },
  { date: "Feb 12", actual: null, predicted: 5800, confidence: 380 },
];

const restockSuggestions = [
  { id: 1, product: "Wireless Mouse", currentStock: 5, predictedDemand: 45, suggestedRestock: 50, priority: "High" },
  { id: 2, product: "USB Cable", currentStock: 3, predictedDemand: 35, suggestedRestock: 40, priority: "High" },
  { id: 3, product: "Keyboard", currentStock: 23, predictedDemand: 28, suggestedRestock: 15, priority: "Medium" },
  { id: 4, product: "Monitor Stand", currentStock: 15, predictedDemand: 20, suggestedRestock: 10, priority: "Low" },
];

export default function Forecast() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Forecasting
          </h1>
          <p className="text-muted-foreground">Predictive analytics for demand forecasting</p>
        </div>
        <Button data-testid="button-export-forecast">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast with Confidence Intervals</CardTitle>
          <CardDescription>AI-powered predictions for the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7d" className="mb-4">
            <TabsList>
              <TabsTrigger value="7d" data-testid="tab-7days">7 Days</TabsTrigger>
              <TabsTrigger value="30d" data-testid="tab-30days">30 Days</TabsTrigger>
              <TabsTrigger value="90d" data-testid="tab-90days">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="confidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="none"
                fillOpacity={1}
                fill="url(#confidence)"
                name="Confidence Interval"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Actual Demand"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="AI Prediction"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-chart-2">98.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Predicted Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-chart-1">+12.3%</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items Below Threshold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-chart-3">8</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Restock Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-2" />
            AI Restock Suggestions
          </CardTitle>
          <CardDescription>Recommended restocking based on predicted demand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Predicted Demand</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Suggested Restock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                </tr>
              </thead>
              <tbody>
                {restockSuggestions.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-restock-${item.id}`}>
                    <td className="py-3 px-4 text-sm font-medium">{item.product}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{item.currentStock}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{item.predictedDemand}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono font-semibold text-chart-2">{item.suggestedRestock}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge
                        variant={
                          item.priority === "High"
                            ? "destructive"
                            : item.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.priority}
                      </Badge>
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
