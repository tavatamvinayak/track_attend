import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const Track_Location = () => {
  const { attendanceId }: any = useLocalSearchParams();
  const { refreshAccessToken } = useAuth();
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
  const [coordinates, SetCoordinates] = useState<any>([]);
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

  const fetchEmployeeTrackLocation = async () => {
    log(" fetch Employee Track Location function", "yellow");
    try {
      const response =
        await services?.admin_Dashboard?.getTrackDirectionLineThatDay(
          attendanceId
        );
      console.log(response);
      if (response.data.message && !response.data.success) {
        Alert.alert("No attendance record for today");
        return;
      }
      if (response?.data?.data?.length == 0) {
        Alert.alert("No attendance record for today");
        return;
      }
      if (response?.data?.data[0]?.location_coordinates) {
        const coordinates = response?.data?.data[0]?.location_coordinates.map(
          ({ latitude, longitude }: any) => ({
            latitude,
            longitude,
          })
        );
        SetCoordinates(coordinates);
        console.log(coordinates);
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error) {
      console.log("No attendance record for today");
    }
  };
  useEffect(() => {
    if (attendanceId) {
      fetchEmployeeTrackLocation();
    }
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text>Employee_Current_location</Text>
        {location && coordinates?.length > 0 && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={location}
              title="your current location"
            ></Marker>
            <Marker
              title="Check-In"
              pinColor="green"
              coordinate={{
                latitude: coordinates[0]?.latitude,
                longitude: coordinates[0]?.longitude,
              }}
            ></Marker>
            <Marker
              title="Check-Out"
              pinColor="yellow"
              coordinate={{
                latitude: coordinates.at(-1).latitude,
                longitude: coordinates.at(-1).longitude,
              }}
            ></Marker>

            <Polyline
              coordinates={coordinates}
              strokeColor="red" // line color
              strokeWidth={4} // line thickness
            />
          </MapView>
        )}
      </View>
    </>
  );
};

export default Track_Location;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },
});
