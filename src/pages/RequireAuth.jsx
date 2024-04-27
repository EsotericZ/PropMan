import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";

export const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

    const roles = decoded?.userInfo?.roles || []

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}