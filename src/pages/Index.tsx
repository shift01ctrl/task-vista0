
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  // For backward compatibility, redirect to the dashboard
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      navigate("/");
    }
  }, [navigate]);

  return <Dashboard />;
};

export default Index;
