import React, { useEffect, useRef } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_ATTRIBUTION, MAP_LAYER_URL } from '../constants';

interface MapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
}

const LeafletMap: React.FC<MapProps> = ({ vehicles, selectedVehicleId, onVehicleSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // Leaflet map instance
  const markersRef = useRef<Map<string, any>>(new Map()); // Map vehicle IDs to markers

  // Initialize Map
  useEffect(() => {
    // Access global L variable from the CDN script
    const L = (window as any).L;

    if (!L) {
      console.error("Leaflet is not loaded.");
      return;
    }

    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map on the referenced DOM element
      const map = L.map(mapContainerRef.current, {
        zoomControl: false, // Removed zoom control as requested
        attributionControl: false
      }).setView([INITIAL_CENTER.lat, INITIAL_CENTER.lng], INITIAL_ZOOM);

      L.tileLayer(MAP_LAYER_URL, {
        attribution: MAP_ATTRIBUTION,
        maxZoom: 19,
        className: 'map-tiles'
      }).addTo(map);

      mapRef.current = map;

      // Invalidate size to ensure tiles render correctly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    // Cleanup function to destroy map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []); // Run once on mount

  // Update markers
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    vehicles.forEach(vehicle => {
      const existingMarker = markersRef.current.get(vehicle.id);
      
      const isSelected = vehicle.id === selectedVehicleId;

      // Color mapping - Emerald Theme
      const baseColor = vehicle.status === VehicleStatus.IN_TRANSIT ? '#10B981' : // emerald-500
                        vehicle.status === VehicleStatus.MAINTENANCE ? '#EF4444' : // red-500
                        '#3B82F6'; // blue-500

      const pulseClass = vehicle.status === VehicleStatus.IN_TRANSIT ? 'animate-ping' : '';

      // Custom div icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${vehicle.status === VehicleStatus.IN_TRANSIT ? 
              `<div class="${pulseClass}" style="position: absolute; width: 100%; height: 100%; background-color: ${baseColor}; opacity: 0.4; border-radius: 50%;"></div>` 
              : ''}
            <div style="background-color: ${baseColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 10; transition: all 0.3s ease;"></div>
            ${isSelected ? `<div style="position: absolute; bottom: 36px; background: white; color: ${baseColor}; padding: 6px 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 12px; font-weight: 800; white-space: nowrap; transform: translateX(0%); border: 2px solid ${baseColor}; z-index: 50;">${vehicle.name}</div>` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (existingMarker) {
        existingMarker.setLatLng([vehicle.location.lat, vehicle.location.lng]);
        existingMarker.setIcon(customIcon);
        // Bring selected marker to front
        if (isSelected) {
            existingMarker.setZIndexOffset(1000);
        } else {
            existingMarker.setZIndexOffset(0);
        }
      } else {
        const marker = L.marker([vehicle.location.lat, vehicle.location.lng], { icon: customIcon })
          .addTo(mapRef.current);
        
        marker.on('click', () => onVehicleSelect(vehicle.id));
        markersRef.current.set(vehicle.id, marker);
      }
    });

    // Clean up markers for removed vehicles
    markersRef.current.forEach((marker, id) => {
      if (!vehicles.find(v => v.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

  }, [vehicles, selectedVehicleId, onVehicleSelect]);

  // Fly to selected vehicle
  useEffect(() => {
    if (selectedVehicleId && mapRef.current) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        mapRef.current.flyTo([vehicle.location.lat, vehicle.location.lng], 16, {
          animate: true,
          duration: 1.2,
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedVehicleId, vehicles]);

  return (
    <div ref={mapContainerRef} className="w-full h-full z-0 outline-none bg-slate-100"></div>
  );
};

export default LeafletMap;