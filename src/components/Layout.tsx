import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, User, Settings, LogOut, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toast } = useToast();
  const isHomePage = location.pathname === "/";
  
  if (isHomePage) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Single Sticky Navigation Header */}
      <nav className="bg-card/95 backdrop-blur-sm border-b border-border shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left: FitPulse Logo with Glowing Pulse Icon */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="relative">
                <Activity className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 h-8 w-8 bg-primary rounded-full opacity-20 animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-foreground font-['Bebas Neue']">
                FitPulse
              </span>
            </Link>

            {/* Center: Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
              {[
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/nutrition', label: 'Nutrition' },
                { path: '/medical-checkup', label: 'Medical Checkup' },
                { path: '/fitness', label: 'Fitness' },
                { path: '/water', label: 'Water' },
                { path: '/sleep', label: 'Sleep' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 font-['Inter'] ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Settings */}
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/50">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              
              {/* Profile */}
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent/50">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              
              {/* Logout */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;