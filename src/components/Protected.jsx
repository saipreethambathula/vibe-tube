import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const Protected = () => {
  if (!Cookies.get("jwt_token")) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default Protected;
