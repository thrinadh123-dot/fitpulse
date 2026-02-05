// src/context/AppContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Create Context
export const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  // Global States
  const [user, setUser] = useState(null);        // Logged in user
  const [token, setToken] = useState(null);      // Auth token
  const [loading, setLoading] = useState(false); // Global loading state
  const [workouts, setWorkouts] = useState([]);  // Workouts data
  const [nutrition, setNutrition] = useState([]); // Nutrition data
  const [bookings, setBookings] = useState([]);  // Trainer/fitness bookings
  const [isOwner, setIsOwner] = useState(false); // User role
  const [plans, setPlans] = useState([]);        // Trainer's plans

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  // Function to check if user is logged in
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return navigate("/");
      }

      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch trainer's own workout plans
  const fetchTrainerPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/trainer/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Run once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchUser();
      fetchTrainerPlans();
    }
    // eslint-disable-next-line
  }, []);

  // Logout function
  const logout = () => {
    setUser(null);
    setIsOwner(false);
    setToken(null);
    setWorkouts([]);
    setNutrition([]);
    setBookings([]);
    setPlans([]);
    localStorage.removeItem("token");
    navigate("/");
    toast.success("You have been logged out");
  };

  // Context value shared to all components
  const contextValue = {
    user,
    setUser,
    token,
    setToken,
    loading,
    setLoading,
    workouts,
    setWorkouts,
    nutrition,
    setNutrition,
    bookings,
    setBookings,
    isOwner,
    setIsOwner,
    plans,
    setPlans,
    fetchUser,
    fetchTrainerPlans,
    logout,
    currency,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useAppContext = () => {
  return useContext(AppContext);
};
