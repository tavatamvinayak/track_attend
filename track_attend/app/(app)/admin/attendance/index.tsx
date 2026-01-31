import { Text } from "@/src/components/themed-text";
import { View } from "@/src/components/themed-view";
import { useFetch } from "@/src/contexts/fetchContext";
import EmployeeFind from "@/src/filter/EmployeeFinder";
import log from "@/src/utils/ConsoleLog";
import formatDateDDMMYYYY from "@/src/utils/formatDateDDMMYYYY";
import formatTime from "@/src/utils/formatTime";
import React, { useEffect } from "react";
import { FlatList } from "react-native";

export default function AdminAttendance() {
  log(" (app)/admin/attendance/index  ", "green");
  const {
    Admin_employees,
    // /// ------------------
    TodayAllEmployeeAttendance,
    TodayAllEmployeeAttendanceLoading,
    TodayAllEmployeeAttendanceError,
    refetchTodayAllEmployeeAttendance,
  } = useFetch();
  const date_time = Date.now();



  const renderItem = ({ item }: any) => {
    let employee = EmployeeFind(item?.employeeId, Admin_employees);
    return (
      <View
        style={{
          margin: 5,
          padding: 15,
          borderColor: "white",
          borderWidth: 1,
          borderRadius: 20,
        }}
      >
        {item.employeeId && (
          <Text>
            Name :- <Text style={{ color: "green" }}> {employee?.name}</Text>
          </Text>
        )}
        {item.employeeId && (
          <Text>
            Department :-{" "}
            <Text style={{ color: "green" }}>{employee?.department}</Text>
          </Text>
        )}
        {item.status && (
          <Text>
            Status :-{" "}
            <Text
              style={{ color: item.status == "checked-in" ? "green" : "red" }}
            >
              {item.status}
            </Text>
          </Text>
        )}
        {item.checkIn?.time && (
          <Text>
            Check-In Time :-{" "}
            <Text style={{ color: "green" }}>
              {formatTime(item.checkIn.time)}
            </Text>
          </Text>
        )}
        {item.checkOut?.time ? (
          <Text>{formatTime(item.checkOut.time)}</Text>
        ) : (
          <Text>
            Check-Out Time :- <Text style={{ color: "green" }}>working...</Text>
          </Text>
        )}
      </View>
    );
  };
  useEffect(() => {
    refetchTodayAllEmployeeAttendance();
  }, []);

  return (
    <View>
      <View
        style={{
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 17 }}>
          Get Todays Attendances
        </Text>
        <Text style={{ fontWeight: "200", fontSize: 14 }}>
          {formatDateDDMMYYYY(date_time)} || {formatTime(date_time)}
        </Text>
      </View>
      <View>
        <View>
          <View>
            <View></View>
            {TodayAllEmployeeAttendance ? (
              <FlatList
                data={TodayAllEmployeeAttendance}
                renderItem={renderItem}
                keyExtractor={(item: any) => item._id?.toString()}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
