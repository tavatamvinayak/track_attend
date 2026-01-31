"use client"
import React, { createContext, useContext } from "react";

const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
const useApp =()=> useContext(AppContext)

export { AppContext , AppProvider , useApp}