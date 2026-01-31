import { useFetch } from "@/src/contexts/fetchContext";
import log from "@/src/utils/ConsoleLog";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const All_employees = () => {
  log(" (app)/admin/dashboard/all_employees  ", "green");
  const router = useRouter();
  const {
    Admin_employees,
    Admin_employeesLoading,
    Admin_employeeError,
    refetchAdminEmployees,
  } = useFetch();

  useEffect(() => {
    refetchAdminEmployees();
  }, []);

  const renderEmployeeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.employeeItem,
        // ,
        // selectedEmployee?._id === item?._id && styles.selectedEmployee,
      ]}
      onPress={() =>
        router.push({
          pathname: "/admin/attendance/list_attendance_id",
          params: { employeeId: item._id, data: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.employeeName}>{item.name}</Text>
      <Text style={styles.employeeEmail}>{item.email}</Text>
      <Text style={styles.employeeDept}>{item.department}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>All_employees</Text>
      <View style={styles.employeeList}>
        <Text style={styles.sectionTitle}>
          Employees ({Admin_employees?.length})
        </Text>
        <FlatList
          data={Admin_employees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item: any) => item?._id || item?.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default All_employees;

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
