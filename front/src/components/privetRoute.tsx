import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { status } = useSelector((state: RootState) => state.user);
  const token = sessionStorage.getItem("token");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!token || status === "failed") {
    return <Navigate to="/login" replace />;
  }

  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  if (decoded.organization === "IDF") {
    return <Navigate to="/defence" replace />;
  }

  if (decoded.organization !== "IDF") {
    return <Navigate to="/attack" replace />;
  }

  return children;
};

export default ProtectedRoute;
