import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { useAuth } from "@/src/contexts/AuthContext";
import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import formatDateDDMMYYYY from "@/src/utils/formatDateDDMMYYYY";
import formatTime from "@/src/utils/formatTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
const ListAttendanceById = () => {
  log(" (app)/admin/attendance/list_attendance_id/index ", "green");
  const router = useRouter();
  const { employeeId, data }: any = useLocalSearchParams();
  const { role, refreshAccessToken } = useAuth();
  const [EmployeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    console.log(employeeId, data);
    setEmployeeData(JSON.parse(data));
    getAllEmployeeAttendance();
  }, [employeeId, data]);

  const [AttendanceHistory, setAttendanceHistory] = useState([]);
  const getAllEmployeeAttendance = async () => {
    log("fetch All Employee Attendance function", "yellow");
    if (role === "employee") {
      return {};
    }
    const response =
      await services?.admin_Dashboard?.getEmployeeIdAllAttendance(employeeId);

    if (response?.error === "Invalid or expired token") {
      refreshAccessToken();
      throw new Error("Invalid or expired token");
    }

    if (!response?.success) {
      throw new Error("Failed to fetch ");
    }
    // console.log(response);
    const data: any = [...response?.data?.data.reverse()];
    setAttendanceHistory(data);
    return response.data.data;
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/(app)/admin/attendance/list_attendance_id/track_location",
          params: { attendanceId: item._id },
        });
      }}
    >
      <View style={styles.row}>
        {item.status && <Text style={styles.cell}>{item.status}</Text>}
        {item.date && (
          <Text style={styles.cell}>{formatDateDDMMYYYY(item.date)}</Text>
        )}
        {item.checkIn?.time && (
          <Text style={styles.cell}>{formatTime(item.checkIn.time)}</Text>
        )}
        {item.checkOut?.time ? (
          <Text style={styles.cell}>{formatTime(item.checkOut.time)}</Text>
        ) : (
          <Text style={[styles.cell, { color: "green" }]}>working...</Text>
        )}
      </View>
    </TouchableOpacity>
  );
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: "white",
            padding: 5,
            margin: 10,
          }}
          onPress={() =>
            router.push({
              pathname: "/admin/attendance/list_attendance_id/current_location",
              params: { employeeId },
            })
          }
        >
          <Text style={{ textAlign: "center" }}>
            Click to See Current Location Employee
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        List Attendance By{" "}
        <Text style={{ color: "green", fontWeight: "bold", fontSize: 18 }}>
          {" "}
          {EmployeeData?.name}
        </Text>
      </Text>
      <View>
        <View>
          <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
              <Text style={styles.cell}>Status</Text>
              <Text style={styles.cell}>Date</Text>
              <Text style={styles.cell}>Check-in</Text>
              <Text style={styles.cell}>Check-out</Text>
            </View>
            {AttendanceHistory ? (
              <FlatList
                data={AttendanceHistory}
                renderItem={renderItem}
                keyExtractor={(item: any) => item._id?.toString()}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  tableHeader: {},
  table: {
    margin: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "#363636",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",

    textAlign: "center",
    fontSize: 13,
  },
});
export default ListAttendanceById;
