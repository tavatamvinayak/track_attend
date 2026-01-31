import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { AppProvider } from "@/src/contexts/AppContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { FetchProvider } from "@/src/contexts/fetchContext";
import queryClient from "@/src/contexts/QueryClient";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import log from "@/src/utils/ConsoleLog";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  log("Main APP /_layout", "green");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppProvider>
          <AuthProvider>
            <FetchProvider>
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{ headerShown: true, title: "start app" }}
                />
                <Stack.Screen name="(app)" options={{ headerShown: true }} />
                <Stack.Screen name="(auth)" options={{ headerShown: true }} />
              </Stack>
            </FetchProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
