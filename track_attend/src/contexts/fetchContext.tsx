import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";

import services from "@/src/services/api";
import log from "@/src/utils/ConsoleLog";
import storage from "../services/Mmkv-storage";
import { useAuth } from "./AuthContext";

const FetchContext = createContext<any>(null);

export function FetchProvider({ children }: { children: React.ReactNode }) {
  log("Fetch context Provider", "blue");
  const { role, refreshAccessToken, user, setUser } = useAuth();

  useEffect(() => {
    log("role for Fetch Context", role);
  }, [role]);

  /// ===================================  Admin Query =============
  const fetchGetAllEmployees = async () => {
    log("fetch All Employees function", "yellow");
    if (role === "employee") {
      return {};
    }

    const response = await services?.admin_Dashboard?.getAllEmployees();

    if (response?.error === "Invalid or expired token") {
      refreshAccessToken();
      throw new Error("Invalid or expired token");
    }

    if (!response?.success) {
      throw new Error("Failed to fetch");
    }
    // console.log(response)
    if (response?.data?.data) {
      storage.set("employees", JSON.stringify(response?.data?.data));
    }
    return response.data.data;
  };

  const {
    data: Admin_employees,
    isLoading: Admin_employeesLoading,
    error: Admin_employeeError,
    refetch: refetchAdminEmployees,
  } = useQuery({
    queryKey: ["AdminEmployees", role],
    queryFn: fetchGetAllEmployees,
    enabled: !!role, // only run when role exists
    retry: false,
  });

  const getTodayAllEmployeeAttendance = async () => {
    log("fetch Today All Employee Attendance function", "yellow");
    if (role === "employee") {
      return {};
    }

    const response =
      await services?.admin_Dashboard?.getTodayAllEmployeeAttendance();

    if (response?.error === "Invalid or expired token") {
      refreshAccessToken();
      throw new Error("Invalid or expired token");
    }

    if (!response?.success) {
      throw new Error("Failed to fetch ");
    }
    console.log(response);
    return response.data.data;
  };

  const {
    data: TodayAllEmployeeAttendance,
    isLoading: TodayAllEmployeeAttendanceLoading,
    error: TodayAllEmployeeAttendanceError,
    refetch: refetchTodayAllEmployeeAttendance,
  } = useQuery({
    queryKey: ["TodayAllEmployeeAttendance", role],
    queryFn: getTodayAllEmployeeAttendance,
    enabled: !!role, // only run when role exists
    retry: false,
  });

  // ================= ============= Employee Attendance Query =================

  const fetchEmployeeDetail = async () => {
    log("fetch Employee Detail function", "yellow");
    if (role === "admin") {
      return {};
    }

    const response = await services?.EmployeeDashboard?.employeeDetails();

    if (response?.error === "Invalid or expired token") {
      refreshAccessToken();
      throw new Error("Invalid or expired token");
    }

    if (!response?.success) {
      throw new Error("Failed to fetch attendance");
    }
    return response.data?.employee;
  };

  const {
    data: employeeDetail,
    isLoading: employeeDetailLoading,
    error: employeeDetailError,
    refetch: refetchEmployeeDetail,
  } = useQuery({
    queryKey: ["employee-detail", role],
    queryFn: fetchEmployeeDetail,
    enabled: !!role, // only run when role exists
    retry: false,
  });

  const fetchAllAttendance = async () => {
    log("fetch Today Attendance function", "yellow");
    if (role === "admin") {
      return {};
    }
    const response =
      await services?.EmployeeAttendance?.employeeAllAttendance();

    if (response?.error === "Invalid or expired token") {
      refreshAccessToken();
      throw new Error("Invalid or expired token");
    }

    if (!response?.success) {
      throw new Error("Failed to fetch attendance");
    }
    return response.data.data;
  };

  const {
    data: attendance,
    isLoading: attendanceLoading,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["employee-all-attendance", role],
    queryFn: fetchAllAttendance,
    enabled: !!role, // only run when role exists
    retry: false,
  });



  return (
    <FetchContext.Provider
      value={{

        /// ============ Admin Fetch ========
        Admin_employees,
        Admin_employeesLoading,
        Admin_employeeError,
        refetchAdminEmployees,
        ///-------------------
        TodayAllEmployeeAttendance,
        TodayAllEmployeeAttendanceLoading,
        TodayAllEmployeeAttendanceError,
        refetchTodayAllEmployeeAttendance,

        ///==================== Employee Fetch ==========
        employeeDetail,
        employeeDetailLoading,
        employeeDetailError,
        refetchEmployeeDetail,
        /// -----------------
        attendance,
        attendanceLoading,
        attendanceError,
        refetchAttendance,
        /// ---------------
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}

export const useFetch = () => useContext(FetchContext);
