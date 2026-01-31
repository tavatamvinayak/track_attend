"use client";
import React, { createContext, useContext } from "react";
import services from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";

const FetchContext = createContext<any>(null);

const FetchProvider = ({ children }: { children: React.ReactNode }) => {
  const { login, setIsAuthenticated } = useAuth();

  const EmployeeRegisterMutation = useMutation({
    mutationFn: services?.employeeAPI?.register,
    onSuccess: (response: any) => {
      if (response?.success) {
        login(response?.data, "employee");
        setIsAuthenticated(true);
      } else {
        alert(response?.error || "Invalid credentials");
      }
    },
    onError: (error: any) => {
      alert(error.message || "Network error occurred");
    },
  });

  const EmployeeLoginMutation = useMutation({
    mutationFn: services?.employeeAPI?.login,
    onSuccess: (response: any) => {
      if (response?.success) {
        login(response?.data, "employee");
        setIsAuthenticated(true);
      } else {
        alert(response?.error || "Invalid credentials");
      }
    },
    onError: (error: any) => {
      alert(error.message || "Network error occurred");
    },
  });

  return (
    <FetchContext.Provider value={{ EmployeeLoginMutation, EmployeeRegisterMutation }}>
      {children}
    </FetchContext.Provider>
  );
};

const useFetch = () => useContext(FetchContext);
export { FetchContext, FetchProvider, useFetch };