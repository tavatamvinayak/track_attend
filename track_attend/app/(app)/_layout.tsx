
import { useAuth } from "@/src/contexts/AuthContext";
import log from "@/src/utils/ConsoleLog";
import { Redirect, Stack } from "expo-router";

export default function HomeLayout() {
  log(" (app)/_layout , HomeLayout ", "green");
  const {  RefreshToken , AccessToken, role, isAuthenticated } = useAuth();
  if (!isAuthenticated && !RefreshToken && !AccessToken && !role) { 
    console.log("HomeLayout authenticated :- " , RefreshToken , AccessToken, role, isAuthenticated)
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <Stack>
      {/* app */}
      <Stack.Screen name="admin" options={{ headerShown: true }} />
      <Stack.Screen name="employee" options={{ headerShown: true }} />
    </Stack>
  );
}
