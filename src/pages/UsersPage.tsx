
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, UserPlus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

// Sample initial users data
const initialUsers: User[] = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com", 
    role: "Admin"
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "Developer"
  },
  { 
    id: "3", 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    role: "Designer"
  },
  { 
    id: "4", 
    name: "Alice Williams", 
    email: "alice@example.com", 
    role: "Manager"
  }
];

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Developer"
  });
  
  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    setNewUser({
      name: "",
      email: "",
      role: "Developer"
    });
    
    setIsAddUserDialogOpen(false);
    toast.success(`User ${user.name} added successfully! 🎉`);
  };
  
  const removeUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("User removed successfully");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <PageLayout title="Users Management 👥">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User 👤</DialogTitle>
              <DialogDescription>
                Add a new user to your team. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin 👑</SelectItem>
                    <SelectItem value="Manager">Manager 📊</SelectItem>
                    <SelectItem value="Developer">Developer 💻</SelectItem>
                    <SelectItem value="Designer">Designer 🎨</SelectItem>
                    <SelectItem value="Marketing">Marketing 📣</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.role === "Admin" && "👑"}
                    {user.role === "Manager" && "📊"}
                    {user.role === "Developer" && "💻"}
                    {user.role === "Designer" && "🎨"}
                    {user.role === "Marketing" && "📣"}
                    {user.role}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">ID: {user.id}</div>
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <div className="flex w-full justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => removeUser(user.id)}
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default UsersPage;
