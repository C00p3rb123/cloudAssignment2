import React, { useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

export const LogoutPage = () => {
  const { updateToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      updateToken("");
      navigate("/", { replace: true });
    }, 1000);
  }, []);

  return <div>Logging out </div>;
};
