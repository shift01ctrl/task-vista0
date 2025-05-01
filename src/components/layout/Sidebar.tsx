
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  CalendarDays, LayoutGrid, Table, List, 
  LogOut, Settings, Search, Users, UserPlus, 
  Home, PanelLeft, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarRail, 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { translateToFrench } from "@/utils/translations";

export function AppSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();
  
  // Get user initials for avatar
  const username = localStorage.getItem("username") || "User";
  const initials = username.substring(0, 2).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSignOut = () => {
    localStorage.setItem("isAuthenticated", "false");
    toast.success(translateToFrench("Signed out successfully! 👋"));
    navigate("/login");
  };

  const navItems = [
    {
      to: "/",
      icon: <Home className="w-5 h-5" />,
      label: translateToFrench("Dashboard"),
    },
    {
      to: "/tasks",
      icon: <LayoutGrid className="w-5 h-5" />,
      label: translateToFrench("Tasks"),
    },
    {
      to: "/calendar",
      icon: <CalendarDays className="w-5 h-5" />,
      label: translateToFrench("Calendar"),
    },
    {
      to: "/table",
      icon: <Table className="w-5 h-5" />,
      label: translateToFrench("Table"),
    },
    {
      to: "/timeline",
      icon: <List className="w-5 h-5" />,
      label: translateToFrench("Timeline"),
    },
    {
      to: "/users",
      icon: <Users className="w-5 h-5" />,
      label: translateToFrench("Users"),
    },
    {
      to: "/teams",
      icon: <UserPlus className="w-5 h-5" />,
      label: translateToFrench("Teams"),
    },
    {
      to: "/search",
      icon: <Search className="w-5 h-5" />,
      label: translateToFrench("Search"),
    },
    {
      to: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: translateToFrench("Settings"),
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-md animate-pulse">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-lg">TaskVista</h3>
                <p className="text-sm text-muted-foreground">{translateToFrench("Welcome")}, {username}! 👋</p>
              </div>
            </div>
          </div>
          <SidebarTrigger />
        </div>
        
        <form onSubmit={handleSearch} className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={translateToFrench("Search tasks...")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.to)}
                tooltip={item.label}
              >
                <Link to={item.to} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          {translateToFrench("Sign Out")}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// SidebarContext consumer wrapper component
function SidebarConsumer({ children }: { children: (props: { toggleSidebar: () => void; state: "expanded" | "collapsed" }) => React.ReactNode }) {
  const { toggleSidebar, state } = useSidebar();
  return children({ toggleSidebar, state });
}

// Updated SidebarWrapper to use the consumer
export function SidebarWrapper({ children }: { children: (props: { toggleSidebar: () => void; state: "expanded" | "collapsed" }) => React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <SidebarConsumer>
            {children}
          </SidebarConsumer>
        </div>
      </div>
    </SidebarProvider>
  );
}
