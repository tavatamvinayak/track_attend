// import { Text } from "@/src/components/themed-text";
// import { View } from "@/src/components/themed-view";
import { useApp } from "@/src/contexts/AppContext";
import { useFetchEmployee } from "@/src/contexts/employee/FetchEmployee";
import { AttendanceStyles as styles } from "@/src/styles/attendance.style";
import log from "@/src/utils/ConsoleLog";
import formatTime from "@/src/utils/formatTime";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function EmployeeAttendance() {
  log(" (app)/employee/attendance/index ", "green");

  const { location } = useApp();
  const {
    attendance,
    loading,
    fetchTodayAttendance,
    handleCheckIn,
    handleCheckOut,
  } = useFetchEmployee();

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Today's Status</Text>
        {attendance ? (
          <View>
            <Text style={styles.statusText}>Status: {attendance.status}</Text>
            {attendance.checkIn?.time && (
              <Text style={styles.timeText}>
                Check-in: {formatTime(attendance.checkIn.time)}
              </Text>
            )}
            {attendance.checkOut?.time && (
              <Text style={styles.timeText}>
                Check-out: {formatTime(attendance.checkOut.time)}
              </Text>
            )}
            {attendance.totalHours > 0 && (
              <Text style={styles.hoursText}>
                Total Hours: {attendance.totalHours}
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.statusText}>No attendance record</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!attendance?.checkIn?.time ? (
          <TouchableOpacity
            style={[styles.button, styles.checkInButton]}
            onPress={handleCheckIn}
            disabled={loading || !location}
          >
            <Text style={styles.buttonText}>
              {loading ? "Checking In..." : "Check In"}
            </Text>
          </TouchableOpacity>
        ) : !attendance?.checkOut?.time ? (
          <TouchableOpacity
            style={[styles.button, styles.checkOutButton]}
            onPress={handleCheckOut}
            disabled={loading || !location}
          >
            <Text style={styles.buttonText}>
              {loading ? "Checking Out..." : "Check Out"}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.completedText}>
            Attendance completed for today
          </Text>
        )}
      </View>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Location: {location.coords.latitude.toFixed(6)},{" "}
            {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.accuracyText}>
            Accuracy: {location.coords.accuracy?.toFixed(0)}m
          </Text>
        </View>
      )}
    </View>
  );
}
