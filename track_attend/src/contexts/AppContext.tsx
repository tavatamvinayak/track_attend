import { createContext, useContext, useEffect, useState } from "react";

import * as Location from "expo-location";
import * as Network from "expo-network";
import { Alert } from "react-native";
import log from "../utils/ConsoleLog";
const AppContext = createContext<any>(null as any);

export function AppProvider({ children }: { children: React.ReactNode }) {
  log(" App context Provider", "blue");
  const networkState = Network.useNetworkState();
  console.log(`Current network type: ${networkState.type}`);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  ////---------- Permission location Access -----
  const [location, setLocation] = useState<any>(null);
  ///// permission Location and GPS
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Location permission is required for attendance"
      );
      return;
    }
    getCurrentLocation();
  };

  /// get current Location
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    }
  };
  return (
    <AppContext.Provider
      value={{
        networkState,
        requestLocationPermission,
        getCurrentLocation,
        location,
        setLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
