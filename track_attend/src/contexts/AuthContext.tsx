import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import services from "@/src/services/api";
import storage from "@/src/services/Mmkv-storage";
import log from "@/src/utils/ConsoleLog";
import parseValue from "@/src/utils/parseValue";

const AuthContext = createContext<any>(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  log(" Auth context Provider", "blue");
  const [AccessToken, setAccessToken] = useState<string | null>(null);
  const [RefreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  function LoadStorage() {
    log("AuthProvider LoadStorage function ", "yellow");
    const AccessToken_: any = storage.getString("AccessToken");
    const RefreshToken_: any = storage.getString("RefreshToken");
    const user_: any = storage.getString("user");
    const role_: any = storage.getString("role");
    const isAuth: any = storage.getBoolean("isAuthenticated");

    console.log(
      "Load storage :- ",
      AccessToken_,
      RefreshToken_,
      user_,
      role_,
      isAuth,
    );

    const parsedAccessToken = AccessToken_ ? parseValue(AccessToken_) : null;
    const parsedRefreshToken = RefreshToken_ ? parseValue(RefreshToken_) : null;
    const parsedUser = user_ ? parseValue(user_) : null;
    const parsedRole = role_ ? parseValue(role_) : null;
    const parsedIsAuth = isAuth ? parseValue(isAuth) : null;

    if (user_ && role_ && isAuth) {
      setAccessToken(parsedAccessToken);
      setRefreshToken(parsedRefreshToken);
      setUser(parsedUser);
      setRole(parsedRole);
      setIsAuthenticated(parsedIsAuth);
      log(
        `Set State to Store:- \n
        access token :- ${parsedAccessToken} \n
        refresh token :- ${parsedRefreshToken} \n
        user :- ${parsedUser} \n
        role :- ${parsedRole} \n
        isAuth :- ${parsedIsAuth}`,
        "magenta",
      );
    }
    setTimeout(() => {
      if (!parsedAccessToken) {
        console.log("Access token in null  :- ", parsedAccessToken);
        refreshAccessToken();
      }
      if (parsedAccessToken) {
        CurrentAccessTokenValidity(parsedAccessToken);
      }
    }, 5 * 1000);
    if (!isAuth) {
      console.log("user not Login  function ");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  }
  useEffect(() => {
    console.log(
      "load after Auth Provider State :- ",
      AccessToken,
      RefreshToken,
      user,
      role,
      isAuthenticated,
    );
    LoadStorage();
  }, []);

  const login = async (data: any, role: string) => {
    log(" AuthProvider Login function", "yellow");
    const { accessToken, refreshToken, employee, admin } = data;
    console.log("data", accessToken, refreshToken, employee, admin);
    let user_ = admin || employee;
    console.log("user_ :- ", user_);
    if (accessToken && refreshToken && user_) {
      storage.set("AccessToken", JSON.stringify(accessToken));
      storage.set("RefreshToken", JSON.stringify(refreshToken));
      storage.set("user", JSON.stringify(user_));
      storage.set("role", JSON.stringify(role));
      storage.set("isAuthenticated", true);
    } else {
      Alert.alert("something went wrong . Save to your Storage");
    }
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user_);
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    log("AuthProvider logout function", "yellow");
    try {
      storage.clearAll();
    } catch (error) {
      console.log(error);
    } finally {
      () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        console.log(" AuthProvider logout successful");
      };
    }
  };

  ///---- accessToken Valid or Not check
  const CurrentAccessTokenValidity = async (AccessToken: any) => {
    log("Current Access Token Validity function", "yellow");
    try {
      const response: any = await services?.security?.healthAccessToken();
      console.log(response, "magenta");
      if (response?.success) {
        log("Access token is Valid ", "blue");
      } else {
        log("Invalid Access Token ", "red");
        refreshAccessToken();
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "expired your Login",
      );
    }
  };

  // Helper function to safely store token
  const saveAccessToken = (token: string | null) => {
    log("save Access Token function", "yellow");
    if (token) {
      console.log(token);
      storage.set("AccessToken", JSON.stringify(token));
    } else {
      storage.remove("AccessToken");
    }
    setAccessToken(token);
  };

  const refreshAccessToken = async (): Promise<void> => {
    log("refresh Access Token function", "yellow");
    try {
      if (!role) {
        return;
      }
      const refreshMethod =
        role === "admin"
          ? services?.authAdmin?.adminRefreshTokenToAccessToken
          : role === "employee"
            ? services?.authEmployee?.employeeRefreshTokenToAccessToken
            : null;

      if (!refreshMethod) {
        throw new Error(`Unsupported role: ${role}`);
      }

      const response = await refreshMethod(RefreshToken);
      const newToken = response?.data?.data?.accessToken;

      if (!newToken) {
        throw new Error("Refresh endpoint returned no access token");
      }

      saveAccessToken(newToken);
      console.log("[Auth] Token refreshed ✓");
    } catch (error) {
      console.error("[Auth] Refresh failed →", error);

      Alert.alert(
        "Session Expired",
        "Please login again.\nToken refresh failed.",
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        /// functions
        login,
        logout,
        storage,
        // refreshAccessToken,
        // clearAccessToken,
        // storage cache
        role,
        RefreshToken,
        AccessToken,
        user,
        isAuthenticated,
        //----states ---
        setAccessToken,
        setRefreshToken,
        setUser,
        setRole,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
