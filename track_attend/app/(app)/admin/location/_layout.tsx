import log from "@/src/utils/ConsoleLog";
import { Stack } from "expo-router";

export default function AdminLocationLayout() {
  log(" (app)/admin/location/_layout , AdminLocationLayout  ", "green");

  return<Stack>
     
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="employee_current_location" options={{ headerShown: true }} />
    </Stack>
}
