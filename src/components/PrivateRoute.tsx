import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const token = localStorage.getItem("token"); // Token'ı localStorage'dan alıyoruz
    
    // Token varsa children bileşenini render et, yoksa /login'e yönlendir
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
