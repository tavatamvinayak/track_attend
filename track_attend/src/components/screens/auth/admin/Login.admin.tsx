import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import { useMutation } from "@tanstack/react-query";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login_Admin({ setRole }: any) {
  log(" Admin Login Component ", "magenta");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  const [isChecked, setChecked] = useState(false);
  const { login, setIsAuthenticated } = useAuth();

  const { mutate, isPending }: any = useMutation({
    mutationFn: services?.authAdmin?.adminLogin,
    onSuccess: (response: any) => {
      if (response?.success) {
        login(response.data, "admin");
        setIsAuthenticated(true);
        router.replace("/(app)/admin/dashboard");
      } else {
        Alert.alert("Login Failed", response?.error || "Invalid credentials");
      }
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Network error occurred");
    },
  });

  const handleLogin = () => {
    const { email, password } = form;
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    mutate({ email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={"gray"}
        autoCapitalize="none"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"gray"}
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
        secureTextEntry={!isChecked}
      />
      <>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#167e13" : undefined}
          />
          <Text style={styles.paragraph}>Show Password</Text>
        </View>
      </>

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(auth)/sign-up");
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.footerText}>create a account? register</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setRole(null);
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.footerText}>
            Back to the Selection :- Admin & Employee
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonDisabled: {
    backgroundColor: "#666",
  },
  footerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
