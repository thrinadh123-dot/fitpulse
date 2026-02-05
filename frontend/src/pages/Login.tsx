import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronRight, Activity } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { login, register } = useUser();
  const { toast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const motivationalSlides = [
    {
      image: "/assets/1.jpeg",
      text: "Feel the burn, track the progress. Log in to ignite your fitness."
    },
    {
      image: "/assets/2.jpg",
      text: "Recharge, reset, realign. Your journey to holistic health begins here."
    },
    {
      image: "/assets/3.jpeg",
      text: "Every step forward counts. Sign in and celebrate your progress."
    },
    {
      image: "/assets/4.jpeg",
      text: "Every round makes you stronger. Sign in to begin."
    },
    {
      image: "/assets/5.jpeg",
      text: "Every step forward counts. Sign in and celebrate your progress."
    },
    {
      image: "/assets/6.jpeg",
      text: "Unleash your power. Log in and let's move."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % motivationalSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Success",
            description: "Login successful!",
          });
          navigate('/dashboard');
        } else {
          throw new Error('Login failed');
        }
      } else {
        // Handle registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        
        const success = await register({
          email: formData.email,
          firstName: 'New',
          lastName: 'User',
          onboardingComplete: false
        });
        
        if (success) {
          toast({
            title: "Success",
            description: "Registration successful! Please complete your profile.",
          });
          navigate('/onboarding');
        } else {
          throw new Error('Registration failed');
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message || "Authentication failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % motivationalSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-[#18181b]">
        {/* Login Form Section */}
        <div className="w-full md:w-1/2 px-8 py-12 md:px-12 md:py-16 flex flex-col justify-center">
          <div className="mb-8 flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">Fitpulse</span>
            {/* <span className="text-xs text-orange-500 font-semibold">Start </span> */}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? (
              <>Hey, Welcome Back! <span className="inline-block"></span></>
            ) : (
              <>Create an Account <span className="inline-block">✨</span></>
            )}
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            {isLogin ? "Please enter your details" : "Start your fitness journey"}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg bg-[#232326] text-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-900 focus:outline-none transition"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 rounded-lg bg-[#232326] text-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-900 focus:outline-none transition"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full px-4 py-3 rounded-lg bg-[#232326] text-white border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-900 focus:outline-none transition"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-orange-500 w-4 h-4"
                    disabled={isLoading}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-lg shadow hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Logging in..." : "Signing up..."}
                </div>
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </button>

            <button
              type="button"
              className="w-full py-3 rounded-lg border border-gray-600 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#232326] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              Login with Google
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => setIsLogin(false)} 
                  className="text-orange-500 hover:underline"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setIsLogin(true)} 
                  className="text-orange-500 hover:underline"
                >
                  Login here
                </button>
              </>
            )}
          </div>
        </div>

        {/* Image Carousel Section */}
        <div className="w-full md:w-1/2 relative overflow-hidden bg-gray-900">
          {motivationalSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={`Motivation ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.3)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            </div>
          ))}
          
          <div className="absolute bottom-0 left-0 w-full p-8 z-10">
            <p className="text-white text-xl font-medium mb-6">
              {motivationalSlides[currentSlide].text}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {motivationalSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={goToNextSlide}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;