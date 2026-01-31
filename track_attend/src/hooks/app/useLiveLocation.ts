import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useLiveLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000, // every 3 sec
          distanceInterval: 5, // every 5 meters
        },
        (loc) => setLocation(loc)
      );
    })();

    return () => subscription?.remove();
  }, []);

  return location;
}
