"use client";
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const subscribeToLocationUpdates = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('location:update', callback);
      socketRef.current.emit('admin:subscribe');
    }
  };

  const sendLocationUpdate = (data: { userId: string; lat: number; lng: number }) => {
    if (socketRef.current) {
      socketRef.current.emit('location:update', data);
    }
  };

  return {
    socket: socketRef.current,
    subscribeToLocationUpdates,
    sendLocationUpdate,
  };
};