import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { socket } from "@/src/services/socket";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Employee_Current_location = () => {
  const { employeeId, data }: any = useLocalSearchParams();
  // ------ location hook usage ------
  async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied!");
      return false;
    }
    return true;
  }
  const [location, setLocation] = useState<any>(null);
  const mapRef = useRef<any>(null);
  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000, // update every second
          distanceInterval: 1, // also update when device moves
        },
        (loc) => {
          setLocation(loc.coords);

          // Move map camera to follow user
          mapRef.current?.animateCamera({
            center: {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            },
            zoom: 16,
          });
        }
      );
    })();
  }, []);

  /// ========================
  const [CurrentLocations, setCurrentLocations] = useState<Location[]>([]);

  useEffect(() => {
    socket.connect();

    socket.emit("admin:subscribe");

    socket.on("location:all", (data: Location[]) => {
      setCurrentLocations(data);
    });

    socket.on("location:update", (location: Location) => {
      setCurrentLocations((prev) => {
        const index = prev.findIndex((l) => l.userId === location.userId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = location;
          return updated;
        }
        return [...prev, location];
      });
    });

    return () => {
      socket.off("location:all");
      socket.off("location:update");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const filteredLocations = CurrentLocations.filter(
      (loc: Location) => loc.userId === employeeId
    );
    setCurrentLocations(filteredLocations);
  }, [employeeId]);

  return (
    <View style={styles.container}>
      <Text>Employee_Current_location</Text>
      <View>
        <View>
          {CurrentLocations && <Text>{JSON.stringify(CurrentLocations)}</Text>}
        </View>
      </View>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={location} />
        </MapView>
      )}
    </View>
  );
};

export default Employee_Current_location;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
    // padding: 20,
  },

  map: {
    flex: 1,
  },
});

interface Location {
  userId: string;
  lat: number;
  lng: number;
}

// export default function AdminDashboard() {
//   const [locations, setLocations] = useState<Location[]>([]);

//   useEffect(() => {
//     socket.connect();

//     socket.emit("admin:subscribe");

//     socket.on("location:all", (data: Location[]) => {
//       setLocations(data);
//     });

//     socket.on("location:update", (location: Location) => {
//       setLocations((prev) => {
//         const index = prev.findIndex((l) => l.userId === location.userId);
//         if (index >= 0) {
//           const updated = [...prev];
//           updated[index] = location;
//           return updated;
//         }
//         return [...prev, location];
//       });
//     });

//     return () => {
//       socket.off("location:all");
//       socket.off("location:update");
//       socket.disconnect();
//     };
//   }, []);

//   return (
// <View>
//   {locations.map((loc) => (
//     <Text key={loc.userId}>
//       {loc.userId}: {loc.lat}, {loc.lng}
//     </Text>
//   ))}
// </View>
//   );
// }
