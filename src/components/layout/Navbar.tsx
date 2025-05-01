
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CalendarDays, LayoutGrid, Table, List, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NavItemProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, active, icon, label }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 p-3 rounded-md transition-all",
      active
        ? "bg-primary text-white"
        : "hover:bg-secondary text-muted-foreground"
    )}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </Link>
);

interface NavbarProps {
  currentPath: string;
}

const Navbar = ({ currentPath }: NavbarProps) => {
  const navigate = useNavigate();
  const navItems = [
    {
      to: "/",
      icon: <LayoutGrid className="w-5 h-5" />,
      label: "Cards",
    },
    {
      to: "/calendar",
      icon: <CalendarDays className="w-5 h-5" />,
      label: "Calendar",
    },
    {
      to: "/table",
      icon: <Table className="w-5 h-5" />,
      label: "Table",
    },
    {
      to: "/timeline",
      icon: <List className="w-5 h-5" />,
      label: "Timeline",
    },
  ];

  const handleSignOut = () => {
    // In a real app with authentication, you would sign out the user here
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <nav className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-b">
      <div className="flex flex-col sm:flex-row gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            active={
              (currentPath === "/" && item.to === "/") ||
              (currentPath !== "/" && item.to !== "/" && currentPath.startsWith(item.to))
            }
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
      <Button 
        variant="outline" 
        onClick={handleSignOut}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </nav>
  );
};

export default Navbar;
