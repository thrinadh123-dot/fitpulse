import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/hooks/useTheme';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ 
  children,
  requireAuth = true,
  requireOnboarding = false
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useUser();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');

  useEffect(() => {
    if (isOnboardingRoute) {
      // Force dark mode for onboarding, but save the original theme.
      if (theme !== 'dark') {
        localStorage.setItem('previous-theme', theme);
        setTheme('dark');
      }
    } else {
      // When leaving onboarding, restore the previous theme.
      const previousTheme = localStorage.getItem('previous-theme');
      if (previousTheme && theme !== previousTheme) {
        setTheme(previousTheme as 'light' | 'dark' | 'system');
        localStorage.removeItem('previous-theme');
      }
    }
  }, [isOnboardingRoute, theme, setTheme]);
  // If authentication is required and user is not authenticated, redirect to home
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If onboarding is required and user hasn't completed it, redirect to onboarding
  if (requireOnboarding && user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If user is authenticated and tries to access onboarding again, redirect to dashboard
  if (location.pathname === '/onboarding' && user?.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};
