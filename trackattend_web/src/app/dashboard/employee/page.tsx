"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSocket } from '@/hooks/useSocket';
import { employeeAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, LogOut, Play, Square, History } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { getCurrentLocation, watchLocation } = useGeolocation();
  const { sendLocationUpdate } = useSocket();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    // Start location tracking if checked in
    if (todayAttendance?.status === 'checked-in' && !locationWatchId) {
      startLocationTracking();
    }
    // Stop location tracking if checked out
    if (todayAttendance?.status === 'checked-out' && locationWatchId) {
      stopLocationTracking();
    }
  }, [todayAttendance?.status]);

  const fetchTodayAttendance = async () => {
    try {
      const response = await employeeAPI.getTodayAttendance();
      if (response.success) {
        setTodayAttendance(response.data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    const watchId = watchLocation((location) => {
      // Send location update via socket
      sendLocationUpdate({
        userId: user._id,
        lat: location.latitude,
        lng: location.longitude,
      });

      // Also send to API for storage
      if (todayAttendance?._id) {
        employeeAPI.trackLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          attendanceId: todayAttendance._id,
        });
      }
    });

    if (watchId) {
      setLocationWatchId(watchId);
    }
  };

  const stopLocationTracking = () => {
    if (locationWatchId) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const location = await getCurrentLocation();
      const response = await employeeAPI.checkIn(location);
      
      if (response.success) {
        setTodayAttendance(response.data);
        startLocationTracking();
      } else {
        alert(response.error || 'Check-in failed');
      }
    } catch (error) {
      alert('Failed to get location. Please enable GPS.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const location = await getCurrentLocation();
      const response = await employeeAPI.checkOut(location);
      
      if (response.success) {
        setTodayAttendance(response.data);
        stopLocationTracking();
      } else {
        alert(response.error || 'Check-out failed');
      }
    } catch (error) {
      alert('Failed to get location. Please enable GPS.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'text-green-600 bg-green-100';
      case 'checked-out': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-gray-600">Welcome back, <span className='font-bold'>{user?.name}</span></p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/dashboard/employee/history')}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
              <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Today's Status</h2>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todayAttendance?.status || 'not-started')}`}>
                  {todayAttendance?.status?.replace('-', ' ').toUpperCase() || 'NOT STARTED'}
                </span>
                {locationWatchId && (
                  <span className="flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Location Tracking Active
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {todayAttendance?.checkIn?.time && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold">{formatTime(todayAttendance.checkIn.time)}</p>
                </div>
              )}
              {todayAttendance?.checkOut?.time && (
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold">{formatTime(todayAttendance.checkOut.time)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <Play className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check In</h3>
              <p className="text-gray-600 mb-4">Start your work day and begin location tracking</p>
              <Button
                onClick={handleCheckIn}
                disabled={actionLoading || todayAttendance?.status === 'checked-in' || todayAttendance?.status === 'checked-out'}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? 'Getting Location...' : 'Check In'}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <Square className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Out</h3>
              <p className="text-gray-600 mb-4">End your work day and stop location tracking</p>
              <Button
                onClick={handleCheckOut}
                disabled={actionLoading || todayAttendance?.status !== 'checked-in'}
                variant="destructive"
                className="w-full"
              >
                {actionLoading ? 'Getting Location...' : 'Check Out'}
              </Button>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        {todayAttendance && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-xl font-bold text-gray-900">
                  {todayAttendance.totalHours || '0'} hrs
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Check-in Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {todayAttendance.checkIn?.location_coordinates ? 'Recorded' : 'N/A'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Check-out Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {todayAttendance.checkOut?.location_coordinates ? 'Recorded' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}