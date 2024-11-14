import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { status } = useSelector((state: RootState) => state.user);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!token || status === "failed") {
    return <Navigate to="/login" replace />;
  }

  const decoded = jwtDecode<{ id: string; organization: string; district?: string }>(token!);

  if (decoded.organization === "IDF") {
    navigate("/defence");
    return;
  }

  if (decoded.organization !== "IDF") {
    navigate("/attack");
    return;
  }

  return children;
};

export default ProtectedRoute;
