import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function AdminEmployeeTrackLocation() {
  log(" (app)/admin/location/index  (Track location)", "green");
  const { refreshAccessToken } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeRoute, setEmployeeRoute] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await services?.admin?.getAllEmployees();
      if (response?.success) {
        setEmployees(response.data || []);
      }
      if (response?.error) {
        Alert.alert("Error", response?.error);
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error) {
      Alert.alert("Error", "Network error fetchEmployees");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeRoute = async (employeeId: string) => {
    try {
      setLoading(true);
      const response = await services?.location?.getEmployeeLocations(
        employeeId
      );
      if (response?.success) {
        const employee: any = employees.find(
          (emp: any) => emp?._id === employeeId
        );
        setSelectedEmployee(employee);
        setEmployeeRoute(response.data || []);
      }
      if (response?.error) {
        Alert.alert("Error", response?.error);
        Alert.alert("Error", response.error || "Failed to fetch route");
        setEmployeeRoute([]);
      }
      if (response?.error === "Invalid or expired token") {
        refreshAccessToken();
      }
    } catch (error) {
      Alert.alert("Error", "Network error fetchEmployeeRoute");
      setEmployeeRoute([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEmployeeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.employeeItem,
        selectedEmployee?._id === item?._id && styles.selectedEmployee,
      ]}
      onPress={() => fetchEmployeeRoute(item?._id)}
    >
      <Text style={styles.employeeName}>{item.name}</Text>
      <Text style={styles.employeeEmail}>{item.email}</Text>
      <Text style={styles.employeeDept}>{item.department}</Text>
    </TouchableOpacity>
  );

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Location Tracking</Text>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      <View style={styles.employeeList}>
        <Text style={styles.sectionTitle}>Employees ({employees.length})</Text>
        <FlatList
          data={employees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item?._id || item?.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {selectedEmployee && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedEmployeeName}>
            Selected: {selectedEmployee.name}
          </Text>
          <Text style={styles.routeInfo}>
            Route Points: {employeeRoute.length}
          </Text>
        </View>
      )}

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  employeeList: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  employeeItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedEmployee: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  employeeEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  employeeDept: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  selectedInfo: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  selectedEmployeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  routeInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  map: { flex: 1 },
});
