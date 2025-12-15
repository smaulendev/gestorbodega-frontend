import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authServices";
import type { LoginResponse } from "../services/authServices";

type Rol = "ADMIN" | "OPERARIO" | "VENDEDOR";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: Rol;
  } | null;
}

interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // 🔄 Restaurar sesión desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed: AuthState = JSON.parse(saved);
      setState(parsed);
    }
  }, []);

  // 🔐 LOGIN
// src/context/AuthContext.tsx
// ...

  const login = async (email: string, password: string) => {
    const data: LoginResponse = await loginRequest(email, password);

    const newState: AuthState = {
      isAuthenticated: true,
      token: data.access_token,
      user: data.usuario,
    };

    setState(newState);
    localStorage.setItem("auth", JSON.stringify(newState));

    // 👇 Antes tenías "/productos"
    navigate("/"); // home -> Dashboard
  };


  // 🚪 LOGOUT
  const logout = () => {
    setState({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
