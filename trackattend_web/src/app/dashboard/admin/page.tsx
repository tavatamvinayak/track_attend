"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/services/api';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Clock, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { subscribeToLocationUpdates } = useSocket();
  const [employees, setEmployees] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [liveLocations, setLiveLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupLocationUpdates();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, attendanceRes] = await Promise.all([
        adminAPI.getAllEmployees(),
        adminAPI.getTodayAttendance(),
      ]);

      if (employeesRes.success) { console.log(employeesRes.data); setEmployees(employeesRes.data.data)};
      if (attendanceRes.success) { console.log(attendanceRes.data); setTodayAttendance(attendanceRes.data)};
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupLocationUpdates = () => {
    subscribeToLocationUpdates((locationData: any) => {
      setLiveLocations(prev => {
        const updated = prev.filter(loc => loc.userId !== locationData.userId);
        return [...updated, locationData];
      });
    });
  };

  const getEmployeeStatus = (employeeId: string) => {
    const attendance = todayAttendance.length > 0 && todayAttendance.find((att: any) => att.employeeId === employeeId) ;
    if (!attendance) return { status: 'not-started', color: 'bg-yellow-500' };
    if (attendance.status === 'checked-in') return { status: 'checked-in', color: 'bg-green-500' };
    return { status: 'checked-out', color: 'bg-gray-500' };
  };

  const checkedInCount = todayAttendance.length > 0 ? todayAttendance.filter((att: any) => att.status === 'checked-in').length : 0;

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const viewSelectedOnMap = async () => {
    const locations = [];
    for (const empId of selectedEmployees) {
      try {
        const response = await adminAPI.getCurrentLocation(empId);
        if (response.success && response.data) {
          locations.push({
            employeeId: empId,
            ...response.data,
          });
        }
      } catch (error) {
        console.error(`Error fetching location for employee ${empId}:`, error);
      }
    }
    setLiveLocations(locations);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900"> {employees?.length > 0 ? employees.length : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Checked In Today</p>
                <p className="text-2xl font-bold text-gray-900">{checkedInCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Locations</p>
                <p className="text-2xl font-bold text-gray-900">{liveLocations.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Employees</h2>
                {selectedEmployees.length > 0 && (
                  <Button onClick={viewSelectedOnMap} size="sm">
                    View on Map ({selectedEmployees.length})
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {employees?.length > 0 && employees.map((employee: any) => {
                const { status, color } = getEmployeeStatus(employee._id);
                const isSelected = selectedEmployees.includes(employee._id);
                return (
                  <div
                    key={employee._id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                    onClick={() => handleEmployeeSelect(employee._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{status.replace('-', ' ')}</p>
                        <p className="text-xs text-gray-500">{employee.department || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Live Locations</h2>
            </div>
            <div className="h-96">
              <MapComponent locations={liveLocations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}