"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { employeeAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AttendanceHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await employeeAPI.getAttendanceHistory();
      if (response.success) {
        setAttendanceHistory(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "half-day":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Attendance History
                </h1>
                <p className="text-gray-600">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {attendanceHistory.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No attendance records
            </h3>
            <p className="text-gray-600">
              Your attendance history will appear here once you start checking
              in.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceHistory?.length > 0 &&
              attendanceHistory.map((record: any) => (
                <div
                  key={record._id}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">
                        {formatDate(record.date)}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}
                    >
                      {record.status?.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Check-in
                        </p>
                        <p className="text-sm text-green-600">
                          {record.checkIn?.time
                            ? formatTime(record.checkIn.time)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-red-50 rounded-lg">
                      <Clock className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Check-out
                        </p>
                        <p className="text-sm text-red-600">
                          {record.checkOut?.time
                            ? formatTime(record.checkOut.time)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Total Hours
                        </p>
                        <p className="text-sm text-blue-600">
                          {record.totalHours
                            ? `${record.totalHours} hrs`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(record.checkIn?.location_coordinates ||
                    record.checkOut?.location_coordinates) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Location data recorded</span>
                      </div>
                    </div>
                  )}

                  {record.message && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        {record.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
