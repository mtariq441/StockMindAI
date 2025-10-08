import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone, MapPin } from "lucide-react";

//todo: remove mock functionality
const mockSuppliers = [
  {
    id: 1,
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA",
    products: ["Electronics", "Accessories"],
    status: "Active",
  },
  {
    id: 2,
    name: "CableWorld Inc",
    email: "sales@cableworld.com",
    phone: "+1 (555) 234-5678",
    address: "456 Cable Ave, New York, NY",
    products: ["Cables", "Connectors"],
    status: "Active",
  },
  {
    id: 3,
    name: "OfficeSupply Co",
    email: "info@officesupply.com",
    phone: "+1 (555) 345-6789",
    address: "789 Office Blvd, Chicago, IL",
    products: ["Office Furniture", "Accessories"],
    status: "Active",
  },
];

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">Manage supplier relationships and contacts</p>
        </div>
        <Button data-testid="button-add-supplier">
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover-elevate transition-all" data-testid={`card-supplier-${supplier.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{supplier.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {supplier.products.join(", ")}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{supplier.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.address}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-supplier-${supplier.id}`}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" data-testid={`button-contact-supplier-${supplier.id}`}>
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
