import { useAuth } from "@/src/contexts/AuthContext";
import log from "@/src/utils/ConsoleLog";
import { Redirect, Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AuthLayout() {
  log(" (auth)/_layout , AuthLayout ", "green");
  const { role, isAuthenticated } = useAuth();
  let parsedRole;
  if (typeof role === "string") {
    try {
      parsedRole = JSON.parse(role);
    } catch (error) {
      console.log("parserRole ", parsedRole, error);
      parsedRole = role;
    }
  } else {
    parsedRole = role;
  }
  if (isAuthenticated) {
    if (parsedRole === "admin") {
      return <Redirect href={"/(app)/admin/dashboard"} />;
    }
    if (parsedRole === "employee") {
      return <Redirect href={"/(app)/employee/dashboard"} />;
    }
  }
  return (
    <KeyboardProvider>
      <Stack>
        {/* auth */}
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="sign-up" options={{ headerShown: true }} />
        <Stack.Screen name="forget-password" options={{ headerShown: true }} />
      </Stack>
    </KeyboardProvider>
  );
}
