import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Shield, User, Users as UsersIcon } from "lucide-react";

//todo: remove mock functionality
const mockUsers = [
  { id: 1, name: "John Doe", username: "johndoe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", username: "janesmith", email: "jane@example.com", role: "Manager", status: "Active" },
  { id: 3, name: "Bob Johnson", username: "bobjohnson", email: "bob@example.com", role: "Staff", status: "Active" },
  { id: 4, name: "Alice Williams", username: "alicew", email: "alice@example.com", role: "Manager", status: "Active" },
  { id: 5, name: "Charlie Brown", username: "charlieb", email: "charlie@example.com", role: "Staff", status: "Inactive" },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Admin":
      return Shield;
    case "Manager":
      return UsersIcon;
    default:
      return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "text-destructive";
    case "Manager":
      return "text-primary";
    default:
      return "text-muted-foreground";
  }
};

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>All registered users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-user-${user.id}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{user.username}</td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <RoleIcon className={`h-4 w-4 ${getRoleColor(user.role)}`} />
                          <span className="text-sm">{user.role}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.status === "Active" ? "secondary" : "outline"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-user-${user.id}`}>
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-permissions-${user.id}`}>
                            Permissions
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
