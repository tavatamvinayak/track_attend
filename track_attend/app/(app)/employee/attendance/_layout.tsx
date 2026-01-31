import log from "@/src/utils/ConsoleLog";
import { Stack } from "expo-router";

export default function EmployeeAttendanceLayout() {
  log(" (app)/employee/attendance , EmployeeAttendanceLayout ", "green");

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="history_attendance" options={{ headerShown: true }} />
    </Stack>
  );
}
