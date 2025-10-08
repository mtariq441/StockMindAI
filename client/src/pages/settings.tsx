import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Package, Bell } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [companyName, setCompanyName] = useState("AI Inventory System");

  const handleSaveSettings = () => {
    console.log("Settings saved:", { lowStockThreshold, companyName });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your system preferences and configuration</p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                data-testid="input-company-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                defaultValue="contact@aiinventory.com"
                data-testid="input-company-email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Address</Label>
            <Input
              id="company-address"
              defaultValue="123 Business St, Tech City, TC 12345"
              data-testid="input-company-address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Inventory Settings</CardTitle>
          </div>
          <CardDescription>Configure inventory thresholds and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="low-stock">Low Stock Threshold</Label>
              <Input
                id="low-stock"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                data-testid="input-low-stock-threshold"
              />
              <p className="text-xs text-muted-foreground">Alert when stock falls below this value</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder-point">Auto-Reorder Point</Label>
              <Input
                id="reorder-point"
                type="number"
                defaultValue="5"
                data-testid="input-reorder-point"
              />
              <p className="text-xs text-muted-foreground">Automatically suggest reorder at this level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>Manage your notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when items are low in stock</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-toggle-low-stock-alerts">
              Enabled
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI Forecast Updates</p>
              <p className="text-sm text-muted-foreground">Receive weekly AI prediction summaries</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-toggle-forecast-alerts">
              Enabled
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sales Reports</p>
              <p className="text-sm text-muted-foreground">Monthly sales performance reports</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-toggle-sales-reports">
              Disabled
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} data-testid="button-save-settings">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
