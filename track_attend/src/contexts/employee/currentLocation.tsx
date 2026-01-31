import { socket } from "@/src/services/socket";
import * as Location from "expo-location";
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "../AuthContext";

const CurrentLocation = createContext<any>(null);
export function CurrentLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  let Employee_ID: any;
  if (user == null) {
    Employee_ID = "user-123";
  }
  if (user != null) {
    Employee_ID = user?._id || user?.id;
  }
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      socket.connect();

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 sec
          distanceInterval: 5, // every 5 meters
        },
        (location) => {
          socket.emit("location:update", {
            userId: Employee_ID,
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      );
    };

    startTracking();

    return () => {
      locationSubscription?.remove();
      socket.disconnect();
    };
  }, []);

  return (
    <CurrentLocation.Provider value={{}}>{children}</CurrentLocation.Provider>
  );
}

export const useCurrentLocation = () => useContext(CurrentLocation);
