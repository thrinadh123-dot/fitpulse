import React from "react";
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
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
  const { user, isOwner, logout, setIsOwner } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
        const { data } = await axios.post('/api/trainer/change-role');
        if (data.success) {
            setIsOwner(true);
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
  };

  return (
    <nav className={`w-full border-b border-borderColor px-6 md:px-16 py-4 flex items-center justify-between relative transition-all ${location.pathname === "/" ? "bg-lime" : ""}`}>
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
      <div className="flex items-center gap-4">
        <button onClick={() => isOwner ? navigate('/trainer/dashboard') : changeRole()} className="cursor-pointer">
            {isOwner ? 'Dashboard' : 'List trainers'}
        </button>
        <button onClick={() => { user ? logout() : navigate('/login') }} className="cursor-pointer px-8 py-2 rounded-full border-2 border-primary-gray hover:bg-primary-dull transition-all text-white bg-primary">
            {user ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
