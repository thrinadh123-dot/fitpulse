import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

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
