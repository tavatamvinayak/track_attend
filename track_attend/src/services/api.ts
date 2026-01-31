import parseValue from "@/src/utils/parseValue";
import storage from "./Mmkv-storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "https://endorsed-unpulverable-abbigail.ngrok-free.dev/api";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const api = async (
  endpoint: string,
  method = "GET",
  body?: any,
): Promise<ApiResponse> => {
  try {
    console.log("api function :- ", endpoint, method, body);
    const token: any = await storage.getString("AccessToken");
    let parsedToken: any = token ? parseValue(token) : null;
    // console.log("api function token check :-", parsedToken);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(parsedToken && { Authorization: `Bearer ${parsedToken}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    return { success: response.ok, data, error: data.message };
  } catch (error) {
    console.log("error in api fetch", error);
    return { success: false, error: "api Crash " };
  }
};

///------------- Admin Api Functions --------------
// Auth APIs
const authAdmin = {
  adminLogin: ({ email, password }: any) =>
    api("/auth/admin/login", "POST", { email, password }),
  adminRegister: (data: any) => api("/auth/admin/register", "POST", data),
  adminForgetPassword: (data: any) =>
    api("/auth/admin/forget-password", "POST", data),
  adminLogout: () => api("/auth/admin/logout", "POST"),

  adminRefreshTokenToAccessToken: ({ refreshToken }: any) =>
    api(`/auth/admin/refresh-token`, "POST", refreshToken),
};

const admin_Dashboard = {
  // adminResetPassword: (data: any) =>
  //   api("/auth/admin/update-password", "POST", data),
  getTodayAllEmployeeAttendance: () =>
    api("/admin/admin-all-employee-today-attendance", "POST"),
  getAllEmployees: () => api(`/admin/admin-all-employees`, "POST"),
  /// specific employee
  employeeIdProfile: (id: any) => api(`/admin/employee-info?id=${id}`, "POST"),
  employeeIdTodayAttendance: (id: any) =>
    api(`/admin/employee-today-attendance?id=${id}`, "POST"),
  getEmployeeIdAllAttendance: (id: any) =>
    api(`/admin/history-employee-all-attendances?id=${id}`, "POST"),
  // specific employee location
  getEmployeeIdCurrentLocation: (id: any) =>
    api(`/location/current-location?id=${id}`, "POST"),
  // admin update employee details
  // adminUpdateEmployeeDetails: (id: any, data: any) =>
  //   api(`/employee-info-update?id=${id}`, "PUT", data),
  // adminDeleteEmployeeDetails: (id: any) =>
  //   api(`/employee-info-delete?id=${id}`, "delete"),
  getTrackDirectionLineThatDay: (id: any) =>
    api(`/location/track-direction-line-that-day?id=${id}`, "POST"),
};

//-------------------- Employee Api Functions --------------
const authEmployee = {
  employeeLogin: ({ email, password }: any) =>
    api("/auth/employee/login", "POST", { email, password }),

  employeeRegister: (data: any) => api("/auth/employee/register", "POST", data),
  employeeForgetPassword: (data: any) =>
    api("/auth/employee/forget-password", "POST", data),
  employeeLogout: () => api("/auth/employee/logout", "POST"),
  employeeRefreshTokenToAccessToken: ({ refreshToken }: any) =>
    api(`/auth/employee/refresh-token`, "POST", refreshToken),
};

const EmployeeDashboard = {
  employeeResetPassword: (data: any) =>
    api("/auth/employee/update-password", "POST", data),
  employeeDetails: () => api(`/employee/employee-details`, "POST"),
};
const EmployeeAttendance = {
  checkIn: ({ latitude, longitude, accuracy }: any) =>
    api("/attendance/check-in", "POST", { latitude, longitude, accuracy }),
  checkOut: ({ latitude, longitude, accuracy }: any) =>
    api("/attendance/check-out", "POST", { latitude, longitude, accuracy }),
  employeeTodayAttendance: () =>
    api("/attendance/get-today-attendance", "POST"),
  employeeAllAttendance: () =>
    api("/attendance/history-all-attendance", "POST"),
};

const EmployeeLocation = {
  employeeCurrentLocation: () => api("/attendance/current-location"),
  trackLocation: ({ latitude, longitude, accuracy, speed, heading }: any) =>
    api("/attendance/location-track", "POST", {
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
    }),
};
const verification = {
  verifyAccessTokenIsValid: () => api("/auth/current_access_token_Valid"),
};
const security = {
  healthAccessToken: () => api("/auth/current_access_token_valid", "POST"),
};

export default {
  authEmployee,
  authAdmin,
  location,
  security,

  /// =========
  EmployeeDashboard,
  EmployeeAttendance,
  admin_Dashboard,
  verification,
  EmployeeLocation,
};

//  const { data, isLoading, error } = useQuery({
//     queryKey: [keys],
//     queryFn: [fetch Function ],
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
