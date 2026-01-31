import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { useFetch } from "@/src/contexts/fetchContext";
import log from "@/src/utils/ConsoleLog";
import formatDateDDMMYYYY from "@/src/utils/formatDateDDMMYYYY";
import formatTime from "@/src/utils/formatTime";
import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

const history_attendance = () => {
  log(" (app)/employee/attendance/history_attendance ", "green");
  const { attendance, attendanceLoading, attendanceError, refetchAttendance } =
    useFetch();
    useEffect(() => {
      refetchAttendance()

    }, [])
    

  const renderItem = ({ item }: any) => (
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
  );
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center", marginVertical: 10 }}>
        History Attendance
      </Text>
      <View>
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>Status</Text>
            <Text style={styles.cell}>Date</Text>
            <Text style={styles.cell}>Check-in</Text>
            <Text style={styles.cell}>Check-out</Text>
          </View>
          {attendance ? (
            <FlatList
              data={attendance}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id?.toString()}
            />
          ) : null}
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
export default history_attendance;
