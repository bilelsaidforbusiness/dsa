import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  LogOut,
  GraduationCap 
} from "lucide-react";

function NavItem({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 ${
          isActive ? "bg-accent" : ""
        }`}
      >
        <Icon className="h-4 w-4" />
        {children}
      </Button>
    </Link>
  );
}

export function Navigation() {
  const { logoutMutation } = useAuth();

  return (
    <div className="h-screen w-64 border-r bg-card p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-4">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h1 className="font-bold text-xl">DriveSchool Pro</h1>
      </div>

      <nav className="space-y-2">
        <NavItem href="/" icon={LayoutDashboard}>
          Dashboard
        </NavItem>
        <NavItem href="/appointments" icon={Calendar}>
          Appointments
        </NavItem>
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}