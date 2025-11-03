// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// ⬇️ ახალი იმპორტი Auth Context-დან
import { AuthProvider } from './contexts/AuthContext'; 

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        {/* ⭐️ აუცილებელია: შევახვიოთ App AuthProvider-ში */}
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);