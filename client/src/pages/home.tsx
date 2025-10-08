import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, Package, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Modern_warehouse_hero_image_3fc3e255.png";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Package,
      title: "Real-time Stock Tracking",
      description: "Monitor your inventory levels in real-time with instant updates and alerts"
    },
    {
      icon: Brain,
      title: "AI Demand Forecasting",
      description: "Predict future demand using advanced machine learning algorithms"
    },
    {
      icon: TrendingUp,
      title: "Automated Restocking",
      description: "Never run out of stock with intelligent automated reorder suggestions"
    },
    {
      icon: BarChart3,
      title: "Sales Analytics Dashboard",
      description: "Comprehensive analytics and insights to optimize your inventory"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modern warehouse"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold tracking-tight mb-4">
                Smart Inventory Control with{" "}
                <span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                  AI-Powered Forecasting
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Revolutionize your inventory management with artificial intelligence. 
                Predict demand, optimize stock levels, and maximize efficiency.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => setLocation("/login")}
                  data-testid="button-login"
                >
                  Login to Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  className="bg-background/50 backdrop-blur-sm"
                  data-testid="button-demo"
                >
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground">Everything you need to manage your inventory efficiently</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover-elevate transition-all">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AI Inventory System. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
