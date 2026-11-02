import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps{
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
    allowedRoles,
}: ProtectedRouteProps){
    const {user, isLoading} = useAuth();
    const location = useLocation();

    console.log('ProtectedRoute:', {
  pathname: location.pathname,
  user,
  isLoading,
});

    if (isLoading){
        return <p>Checking your session...</p>;
    }

    if(!user){
        return(<Navigate to={'/login'} replace state={{from:location}} />);
    }

    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to='/unauthorized' replace />;
    }

    return <Outlet />
}