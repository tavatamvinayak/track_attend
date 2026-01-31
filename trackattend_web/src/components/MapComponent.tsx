"use client";
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
  employeeId?: string;
  userId?: string;
  lat?: number;
  lng?: number;
}

interface MapComponentProps {
  locations: Location[];
  height?: string;
}

export default function MapComponent({ locations, height = '100%' }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([ 17.659920, 75.906387], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    if (locations.length > 0) {
      const bounds = L.latLngBounds([]);
      
      locations.forEach((location, index) => {
        const lat = location.latitude || location.lat;
        const lng = location.longitude || location.lng;
        
        if (lat && lng) {
          const marker = L.marker([lat, lng])
            .bindPopup(`Employee Location ${index + 1}<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);
          
          if (mapRef.current) {
            marker.addTo(mapRef.current);
            markersRef.current.push(marker);
            bounds.extend([lat, lng]);
          }
        }
      });

      // Fit map to show all markers
      if (bounds.isValid() && mapRef.current) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
}