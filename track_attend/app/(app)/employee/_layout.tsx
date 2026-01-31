import { CurrentLocationProvider } from "@/src/contexts/employee/currentLocation";
import { FetchEmployeeProvider } from "@/src/contexts/employee/FetchEmployee";
import log from "@/src/utils/ConsoleLog";
import { Stack } from "expo-router";

export default function EmployeeLayout() {
  log(" (app)/employee/_layout , EmployeeLayout ", "green");

  return (
    <FetchEmployeeProvider>
      <CurrentLocationProvider>
        <Stack>
          <Stack.Screen name="dashboard" options={{ headerShown: true }} />
          <Stack.Screen name="attendance" options={{ headerShown: true }} />
          <Stack.Screen name="profile" options={{ headerShown: true }} />
        </Stack>
      </CurrentLocationProvider>
    </FetchEmployeeProvider>
  );
}
