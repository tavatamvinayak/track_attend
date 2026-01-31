import { useAuth } from "@/src/contexts/AuthContext";
import { useFetch } from "@/src/contexts/fetchContext";
import log from "@/src/utils/ConsoleLog";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EmployeeProfile() {
  log(" (app)/employee/profile/index  ", "green");
  const [Loading, setLoading] = useState(false);
  const {
    logout,
    setAccessToken,
    setRefreshToken,
    setUser,
    setRole,
    setIsAuthenticated,
  } = useAuth();
  const handleLogout = () => {
    log("handle Logout function", "yellow");
    setLoading(true);
    logout();
    setTimeout(() => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      setLoading(false);
      router.push("/");
    }, 2000);
  };

  ///------------
  const { user } = useAuth();
  const {
    employeeDetail,
    employeeDetailLoading,
    employeeDetailError,
    refetchEmployeeDetail,
  } = useFetch();
  useEffect(() => {
    refetchEmployeeDetail();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Profile</Text>
      <View>
        <Text>Details</Text>
        <View>
          <Text>
            Name :-{" "}
            <Text style={{ fontSize: 16, fontFamily: "", fontWeight: "bold" }}>
              {" "}
              {user?.name}
            </Text>
          </Text>
          <Text>
            Email :-
            <Text style={{ fontSize: 16, fontFamily: "", fontWeight: "bold" }}>
              {user?.email}
            </Text>
          </Text>
          <Text>
            Position :-{" "}
            <Text style={{ fontSize: 16, fontFamily: "", fontWeight: "bold" }}>
              {user?.position}
            </Text>
          </Text>
          <Text>
            Department :-{" "}
            <Text style={{ fontSize: 16, fontFamily: "", fontWeight: "bold" }}>
              {user?.department}
            </Text>
          </Text>
          <Text>
            Salary :-{" "}
            <Text style={{ fontSize: 16, fontFamily: "", fontWeight: "bold" }}>
              {user?.salary}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {Loading ? (
          <>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Loading...</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLogout()}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
