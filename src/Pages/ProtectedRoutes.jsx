// utils/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = useSelector((store) => store.user); // store.user me token/user aata hai
  return user ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
