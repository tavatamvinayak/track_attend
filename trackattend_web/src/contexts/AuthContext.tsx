"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<any>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");
      const storedAuth = localStorage.getItem("isAuthenticated");

      if (storedUser && storedRole && storedAuth === "true") {
        setUser(JSON.parse(storedUser));
        setRole(JSON.parse(storedRole));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (data: any, userRole: string) => {
    const { accessToken, refreshToken, employee, admin } = data;
    const userData = admin || employee;

    if (accessToken && refreshToken && userData) {
      localStorage.setItem("AccessToken", accessToken);
      localStorage.setItem("RefreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", JSON.stringify(userRole));
      localStorage.setItem("isAuthenticated", "true");

      setUser(userData);
      setRole(userRole);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
    if (role == "admin") {
      router.replace("/dashboard/admin");
    }
    if (role == "employee") {
      router.replace("/dashboard/employee");
    }
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
