import { createContext, useContext } from "react";

const FetchAdmin = createContext<any>(null);

export function FetchAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FetchAdmin.Provider value={{}}>{children}</FetchAdmin.Provider>;
}

export const useFetchAdmin = () => useContext(FetchAdmin);
