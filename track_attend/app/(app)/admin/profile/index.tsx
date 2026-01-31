import { useAuth } from "@/src/contexts/AuthContext";
import log from "@/src/utils/ConsoleLog";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminProfile() {
  log(" (app)/admin/profile/index  ", "green");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>
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
