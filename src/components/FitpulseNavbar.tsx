import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu-base";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const FitpulseNavbar = () => {
  const { user, isOwner, logout } = useAppContext();

  return (
    <nav className="w-full border-b border-borderColor px-6 md:px-16 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-primary">
        Fitpulse
      </Link>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

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

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/bookings">Bookings</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {isOwner && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/trainer">Trainer Portal</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* User Auth */}
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default FitpulseNavbar;
