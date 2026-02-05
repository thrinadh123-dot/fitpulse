import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu-base";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { assets, menulinks } from "@/assets/public"; // ✅ make sure this file exports logo + menulinks

const Navbar = () => {
  const { setShowLogin, user, logout, isTrainer, axios, setIsTrainer } =
    useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 🔄 Change trainer role
  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/trainer/change-role");
      if (data.success) {
        setIsTrainer(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav
      className={`flex items-center justify-between px-6 md:px-12 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderCol relative transition-all ${
        location.pathname === "/" && "bg-lime"
      }`}
    >
      {/* ✅ Logo */}
      <Link to="/" className="text-2xl font-bold">
        <img src={assets.logo} alt="Logo" className="h-8" />
      </Link>

      {/* ✅ Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Menulinks from assets/public */}
          {menulinks.map((link) => (
            <NavigationMenuItem key={link.path}>
              <NavigationMenuLink asChild>
                <Link
                  to={link.path}
                  className={`text-sm hover:text-primary transition-colors ${
                    location.pathname === link.path ? "text-primary" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* Workouts dropdown (ShadCN style) */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Workouts</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex flex-col gap-2">
                <Link to="/workouts/strength" className="hover:text-primary">
                  Strength Training
                </Link>
                <Link to="/workouts/cardio" className="hover:text-primary">
                  Cardio Plans
                </Link>
                <Link to="/workouts/yoga" className="hover:text-primary">
                  Yoga & Flexibility
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* ✅ Trainer / Auth Actions */}
      <div className="flex items-center gap-6">
        <button
          onClick={() =>
            isTrainer ? navigate("/trainer/dashboard") : changeRole()
          }
          className="cursor-pointer text-sm hover:text-primary transition-colors"
        >
          {isTrainer ? "Dashboard" : "List trainers"}
        </button>

        <button
          onClick={() => {
            user ? logout() : setShowLogin(true);
          }}
          className="cursor-pointer px-8 py-2 rounded-full border-2 border-primary-gray hover:bg-primary-dull transition-all text-white bg-primary"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
