import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const mockProducts = [
  { id: "P001", name: "Wireless Mouse", category: "Electronics", quantity: 45, price: "$29.99", supplier: "TechCorp", status: "In Stock" },
  { id: "P002", name: "USB Cable", category: "Electronics", quantity: 8, price: "$9.99", supplier: "CableWorld", status: "Low Stock" },
  { id: "P003", name: "Keyboard", category: "Electronics", quantity: 23, price: "$59.99", supplier: "TechCorp", status: "In Stock" },
  { id: "P004", name: "Monitor Stand", category: "Accessories", quantity: 15, price: "$39.99", supplier: "OfficeSupply", status: "In Stock" },
  { id: "P005", name: "Webcam", category: "Electronics", quantity: 3, price: "$79.99", supplier: "TechCorp", status: "Low Stock" },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-products"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-stock-filter">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>A list of all products in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-product-${product.id}`}>
                    <td className="py-3 px-4 text-sm font-mono">{product.id}</td>
                    <td className="py-3 px-4 text-sm font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{product.quantity}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">{product.price}</td>
                    <td className="py-3 px-4 text-sm">{product.supplier}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={product.status === "Low Stock" ? "destructive" : "secondary"}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-${product.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
