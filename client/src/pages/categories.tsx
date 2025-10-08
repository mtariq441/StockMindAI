import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

//todo: remove mock functionality
const mockCategories = [
  { id: 1, name: "Electronics", productCount: 156, description: "Electronic devices and accessories" },
  { id: 2, name: "Clothing", productCount: 89, description: "Apparel and fashion items" },
  { id: 3, name: "Food & Beverages", productCount: 234, description: "Food products and drinks" },
  { id: 4, name: "Accessories", productCount: 67, description: "Various accessories and add-ons" },
  { id: 5, name: "Home & Garden", productCount: 123, description: "Home improvement and garden supplies" },
];

export default function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize products into categories</p>
        </div>
        <Button data-testid="button-add-category">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <Card key={category.id} className="hover-elevate transition-all" data-testid={`card-category-${category.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="mt-1">{category.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {category.productCount}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-category-${category.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-delete-category-${category.id}`}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
