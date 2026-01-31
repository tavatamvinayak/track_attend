import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useApp } from "../AppContext";
import { useAuth } from "../AuthContext";

const FetchEmployee = createContext<any>(null);
export function FetchEmployeeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  log("Fetch Employee context Provider", "blue");
  const { refreshAccessToken } = useAuth();
  const { location } = useApp();
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  ///// fetch today attendance
  const fetchTodayAttendance = async () => {
    log(" fetch Today Attendance function", "yellow");
    try {
      const response =
        await services?.EmployeeAttendance?.employeeTodayAttendance();
      if (response?.success) {
        console.log(response);
        setAttendance(response.data.data);
        if (
          response?.data?.data.checkIn.location_coordinates.length > 0 &&
          response?.data?.data.checkOut.location_coordinates.length == 0
        ) {
          log(" start Location Tracking function", "yellow");
          startLocationTracking();
        }
        if (response?.data?.data.checkOut.location_coordinates.length > 0) {
          log(" stop Location Tracking function", "yellow");
          stopLocationTracking();
        }
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error) {
      console.log("No attendance record for today");
    }
  };
  // /// tracking every 5 minutes when check in
  let global: any;
  const startLocationTracking = () => {
    log(" start Location Tracking function", "yellow");
    const interval: any = setInterval(async () => {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const response = await services?.location?.trackLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          speed: currentLocation.coords.speed,
          heading: currentLocation.coords.heading,
        });

        if (response?.error === "Invalid or expired token") {
          refreshAccessToken();
        }
      } catch (error: any) {
        if (error.response?.data?.message === "Invalid or expired token") {
          refreshAccessToken();
        }
        console.log("Location tracking error:", error);
      }
    }, 5 * 1000); // * 60 *

    global.locationTrackingInterval = interval;
  };
  /// tracking stop when check out
  const stopLocationTracking = () => {
    log(" stop Location Tracking function", "yellow");
    if (global.locationTrackingInterval) {
      clearInterval(global.locationTrackingInterval);
      global.locationTrackingInterval = null;
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  /// // check in
  const handleCheckIn = async () => {
    log(" Check In function", "yellow");
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }
    console.log(
      location.coords.latitude,
      location.coords.longitude,
      location.coords.accuracy
    );
    setLoading(true);
    try {
      const response: any = await services?.attendance?.checkIn({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      console.log(response);
      if (response?.success) {
        Alert.alert("Success", "Checked in successfully");
        fetchTodayAttendance();
        startLocationTracking();
      }
      if (response?.error) {
        Alert.alert("Error", response?.error);
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error: any) {
      console.log(error);

      Alert.alert("Error", "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  //// check out
  const handleCheckOut = async () => {
    log(" Check out function", "yellow");
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }

    setLoading(true);
    try {
      const response = await services?.attendance?.checkOut({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });
      if (response?.success) {
        Alert.alert("Success", "Checked Out successfully");
        fetchTodayAttendance();
        stopLocationTracking();
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error: any) {
      if (error.response?.data?.message === "Invalid or expired token") {
        refreshAccessToken();
      }
      Alert.alert("Error", error.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <FetchEmployee.Provider
      value={{
        attendance,
        loading,
        startLocationTracking,
        stopLocationTracking,
        fetchTodayAttendance,
        handleCheckIn,
        handleCheckOut,
      }}
    >
      {children}
    </FetchEmployee.Provider>
  );
}

export const useFetchEmployee = () => useContext(FetchEmployee);
