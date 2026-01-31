import { FetchAdminProvider } from "@/src/contexts/admin/FetchAdmin";
import log from "@/src/utils/ConsoleLog";
import { Stack } from "expo-router";

export default function AdminLayout() {
  log(" (app)/admin/_layout , AdminLayout ", "green");

  console.log("");
  return (
    <FetchAdminProvider>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: true }} />
        <Stack.Screen name="attendance" options={{ headerShown: true }} />
        <Stack.Screen name="location" options={{ headerShown: true }} />
        <Stack.Screen name="profile" options={{ headerShown: true }} />
      </Stack>
    </FetchAdminProvider>
  );
}
