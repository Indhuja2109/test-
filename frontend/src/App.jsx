import { BrowserRouter, Routes, Route, Navigate, createBrowserRouter } from "react-router-dom";
import React, { useEffect, useState } from 'react';

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" exact element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/dashboard" exact element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" exact element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" exact element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
