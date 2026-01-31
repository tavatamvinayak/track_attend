import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
export default function Register_Admin({}: any) {
  log(" Admin register Component ", "magenta");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const { login, setIsAuthenticated } = useAuth();
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const { mutate, isPending }: any = useMutation({
    mutationFn: services?.authAdmin?.adminRegister,
    onSuccess: (response: any) => {
      if (response?.success) {
        login(response?.data, "admin");
        setIsAuthenticated(true);
        router.replace("/(app)/admin/dashboard");
      } else {
        Alert.alert("register Failed", response?.error || "Invalid credentials");
      }
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Network error occurred");
    },
  });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    mutate(form);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={"gray"}
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor={"gray"}
        autoCapitalize="none"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"gray"}
        // secureTextEntry
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="role"
        placeholderTextColor={"gray"}
        value={form.role}
        onChangeText={(v) => handleChange("role", v)}
      />

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Creating Account..." : "Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerText}
        onPress={() => router.replace("/(auth)")}
      >
        <Text style={styles.footerText}>
          Already have an account? Admin Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
});
