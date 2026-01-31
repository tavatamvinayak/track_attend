const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const api = async (endpoint: string, method = "GET", body?: any): Promise<ApiResponse> => {
  try {
    const Token = localStorage.getItem("AccessToken")?.replace(/"/g, '');
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(Token && { Authorization: `Bearer ${Token}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    
    const data = await response.json();
    return { success: response.ok, data, error: data.message };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};

// Admin APIs
export const adminAPI = {
  login: (credentials: { email: string; password: string }) =>
    api("/auth/admin/login", "POST", credentials),
  logout: () => api("/auth/admin/logout", "POST"),
  refreshToken: (refreshToken: string) =>
    api("/auth/admin/refresh-token", "POST", { refreshToken }),
  
  // Dashboard
  getTodayAttendance: () => api("/admin/admin-all-employee-today-attendance", "POST"),
  getAllEmployees: () => api("/admin/admin-all-employees", "POST"),
  getEmployeeInfo: (id: string) => api(`/admin/employee-info?id=${id}`, "POST"),
  getEmployeeTodayAttendance: (id: string) => api(`/admin/employee-today-attendance?id=${id}`, "POST"),
  getEmployeeHistory: (id: string) => api(`/admin/history-employee-all-attendances?id=${id}`, "POST"),
  updateEmployee: (id: string, data: any) => api(`/admin/employee-info-update?id=${id}`, "PUT", data),
  deleteEmployee: (id: string) => api(`/admin/employee-info-delete?id=${id}`, "DELETE"),
  
  // Location
  getCurrentLocation: (id: string) => api(`/location/current-location?id=${id}`, "POST"),
  getLocationHistory: (id: string) => api(`/location/track-direction-line-that-day?id=${id}`, "POST"),
};

// Employee APIs
export const employeeAPI = {
  login: (credentials: { email: string; password: string }) =>
    api("/auth/employee/login", "POST", credentials),
  register: (data: any) => api("/auth/employee/register", "POST", data),
  logout: () => api("/auth/employee/logout", "POST"),
  refreshToken: (refreshToken: string) =>
    api("/auth/employee/refresh-token", "POST", { refreshToken }),
  
  // Profile
  getProfile: () => api("/employee/employee-details", "POST"),
  
  // Attendance
  checkIn: (location: { latitude: number; longitude: number; accuracy?: number }) =>
    api("/attendance/check-in", "POST", location),
  checkOut: (location: { latitude: number; longitude: number; accuracy?: number }) =>
    api("/attendance/check-out", "POST", location),
  getTodayAttendance: () => api("/attendance/get-today-attendance", "POST"),
  getAttendanceHistory: () => api("/attendance/history-all-attendance", "POST"),
  
  // Location tracking
  trackLocation: (data: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    attendanceId: string;
  }) => api("/location/location-track", "POST", data),
};

// Auth verification
export const authAPI = {
  verifyToken: () => api("/auth/current_access_token_valid", "POST"),
};

export default { adminAPI, employeeAPI, authAPI };
