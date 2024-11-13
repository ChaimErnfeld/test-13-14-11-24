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
  // const token = localStorage.getItem("token");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // !token ||
  if (status === "failed") {
    return <Navigate to="/login" replace />;
  }

  // const decoded = jwtDecode<{ id: string; isAdmin: boolean }>(token);

  // if (decoded.isAdmin === true) {
  //   return <Navigate to="/admin" replace />;
  // }

  return children;
};

export default ProtectedRoute;
