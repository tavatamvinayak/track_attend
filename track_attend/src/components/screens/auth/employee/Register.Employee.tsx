import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Register_Employee({ setRole }: any) {
  log(" Employee register Component ", "magenta");
  const router: any = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    department: "",
    salary: "",
  });
  const { login, setIsAuthenticated } = useAuth();

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const { mutate, isPending }: any = useMutation({
    mutationFn: services?.authEmployee?.employeeRegister,
    onSuccess: (response: any) => {
      if (response?.success) {
        login(response?.data, "employee");
        setIsAuthenticated(true);
        router.replace("/(app)/employee/dashboard");
      } else {
        Alert.alert("Login Failed", response?.error || "Invalid credentials");
      }
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Network error occurred");
    },
  });

  const handleRegister = async () => {
    console.log("Register Data:", form);
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    mutate(form);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Employee Create Account</Text>

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
        placeholder="Position"
        placeholderTextColor={"gray"}
        value={form.position}
        onChangeText={(v) => handleChange("position", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Department"
        placeholderTextColor={"gray"}
        value={form.department}
        onChangeText={(v) => handleChange("department", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Salary"
        placeholderTextColor={"gray"}
        keyboardType="numeric"
        value={form.salary}
        onChangeText={(v) => handleChange("salary", v)}
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
        <Text style={styles.footerText}>Already have an account? Login</Text>
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
