import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { useAuth } from "@/src/contexts/AuthContext";
import log from "@/src/utils/ConsoleLog";
import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button } from "react-native";

const Splash_Main = () => {
  log("first and Main APP /index", "green");
  const { role, isAuthenticated, logout } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#d9ff00ff" />
        <Text style={{ marginTop: 20 }}>Loading...</Text>
      </View>
    );
  }
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  if (isAuthenticated) {
    if (role === "admin") {
      console.log("Json parse", role);
      return <Redirect href="/(app)/admin/dashboard" />;
    }
    if (role === "employee") {
      console.log("Json parse", role);
      return <Redirect href="/(app)/employee/dashboard" />;
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginTop: 20 }}>Loading...</Text>
      <Button
        title="Logout"
        onPress={() => {
          logout();
          router.replace("/(auth)");
        }}
      />
    </View>
  );
};

export default Splash_Main;
