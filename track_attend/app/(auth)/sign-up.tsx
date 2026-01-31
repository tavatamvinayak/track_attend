import Register_Admin from "@/src/components/screens/auth/admin/Register.admin";
import Register_Employee from "@/src/components/screens/auth/employee/Register.Employee";
import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import log from "@/src/utils/ConsoleLog";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

function Register() {
  log(" (auth)/sign-up ", "green");
  const [Role, setRole] = useState<any>(null);

  if (Role === "admin") {
    return (
      <>
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={100}
          style={{
            flex: 1,
             // maxHeight: 600,
          }}
        >
          <Register_Admin setRole={setRole} />
        </KeyboardAvoidingView>
      </>
    );
  } else if (Role === "employee") {
    return (
      <>
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={100}
          style={{
            flex: 1,
            // maxHeight: 600,
          }}
        >
          <Register_Employee setRole={setRole} />
        </KeyboardAvoidingView>
      </>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 20,
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            Welcome to TrackAttend
          </Text>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            Register
          </Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setRole("admin")}
        >
          <Text style={{ fontSize: 20, fontWeight: "medium" }}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setRole("employee")}
        >
          <Text style={{ fontSize: 20, fontWeight: "medium" }}>Employee</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Register;
