
import React, { useEffect, useRef } from 'react';
import { Vehicle, VehicleStatus, Coordinates } from '../types';
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_ATTRIBUTION, MAP_LAYER_URL } from '../constants';

interface MapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string) => void;
  // New props for shipment features
  mapSelectionMode?: 'origin' | 'destination' | null;
  onMapClick?: (coords: Coordinates) => void;
  activeRoute?: Coordinates[] | null;
  routeMarkers?: { origin?: Coordinates, destination?: Coordinates } | null;
  focusedLocation?: Coordinates | null; // For global search
  userLocation?: Coordinates | null; // For live tracking
}

const LeafletMap: React.FC<MapProps> = ({ 
  vehicles, 
  selectedVehicleId, 
  onVehicleSelect,
  mapSelectionMode,
  onMapClick,
  activeRoute,
  routeMarkers,
  focusedLocation,
  userLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // Leaflet map instance
  const markersRef = useRef<Map<string, any>>(new Map()); // Map vehicle IDs to markers
  const routeLayerRef = useRef<any>(null); // Polyline layer
  const routeMarkersRef = useRef<any[]>([]); // Origin/Dest markers
  const userLocationMarkerRef = useRef<any>(null); // User's live location marker
  const isInitialLocationTrack = useRef(true);

  // Initialize Map
  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;

    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([INITIAL_CENTER.lat, INITIAL_CENTER.lng], INITIAL_ZOOM);

      L.tileLayer(MAP_LAYER_URL, {
        attribution: MAP_ATTRIBUTION,
        maxZoom: 19,
        className: 'map-tiles'
      }).addTo(map);

      mapRef.current = map;

      // Handle Map Clicks
      map.on('click', (e: any) => {
          if (mapContainerRef.current && mapContainerRef.current.dataset.mode !== 'none') {
             // Dispatch event via prop if we are in selection mode
             const mode = mapContainerRef.current.dataset.mode;
             if (mode && mode !== 'null') {
                 // Trigger callback provided by parent
                 const event = new CustomEvent('map-coordinate-selected', { detail: e.latlng });
                 window.dispatchEvent(event);
             }
          }
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Sync click handler with props (Hack to bridge Leaflet event to React prop)
  useEffect(() => {
      const handleCustomEvent = (e: any) => {
          if (onMapClick) onMapClick(e.detail);
      };
      window.addEventListener('map-coordinate-selected', handleCustomEvent);
      return () => window.removeEventListener('map-coordinate-selected', handleCustomEvent);
  }, [onMapClick]);

  // Update Data Attribute for Click Mode
  useEffect(() => {
      if (mapContainerRef.current) {
          mapContainerRef.current.dataset.mode = mapSelectionMode || 'none';
          mapContainerRef.current.style.cursor = mapSelectionMode ? 'crosshair' : 'grab';
      }
  }, [mapSelectionMode]);

  // Render Vehicles
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    vehicles.forEach(vehicle => {
      const existingMarker = markersRef.current.get(vehicle.id);
      const isSelected = vehicle.id === selectedVehicleId;
      const baseColor = vehicle.status === VehicleStatus.IN_TRANSIT ? '#10B981' : 
                        vehicle.status === VehicleStatus.MAINTENANCE ? '#EF4444' : '#3B82F6';

      const pulseClass = vehicle.status === VehicleStatus.IN_TRANSIT ? 'animate-ping' : '';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${vehicle.status === VehicleStatus.IN_TRANSIT ? 
              `<div class="${pulseClass}" style="position: absolute; width: 100%; height: 100%; background-color: ${baseColor}; opacity: 0.4; border-radius: 50%;"></div>` 
              : ''}
            <div style="background-color: ${baseColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 10;"></div>
            ${isSelected ? `<div style="position: absolute; bottom: 36px; background: white; color: ${baseColor}; padding: 6px 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 12px; font-weight: 800; white-space: nowrap; border: 2px solid ${baseColor}; z-index: 50;">${vehicle.name}</div>` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (existingMarker) {
        existingMarker.setLatLng([vehicle.location.lat, vehicle.location.lng]);
        existingMarker.setIcon(customIcon);
        if (isSelected) existingMarker.setZIndexOffset(1000);
        else existingMarker.setZIndexOffset(0);
      } else {
        const marker = L.marker([vehicle.location.lat, vehicle.location.lng], { icon: customIcon }).addTo(mapRef.current);
        marker.on('click', () => onVehicleSelect(vehicle.id));
        markersRef.current.set(vehicle.id, marker);
      }
    });

    markersRef.current.forEach((marker, id) => {
      if (!vehicles.find(v => v.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [vehicles, selectedVehicleId, onVehicleSelect]);

  // Render Routes and Special Markers
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    // Clear previous routes/markers
    if (routeLayerRef.current) routeLayerRef.current.remove();
    routeMarkersRef.current.forEach(m => m.remove());
    routeMarkersRef.current = [];

    // Draw Polyline
    if (activeRoute && activeRoute.length > 1) {
        const latlngs = activeRoute.map(c => [c.lat, c.lng]);
        routeLayerRef.current = L.polyline(latlngs, {
            color: '#3B82F6', // Blue-500
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round'
        }).addTo(mapRef.current);
        
        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
    }

    // Draw Markers (Origin/Dest)
    if (routeMarkers) {
        if (routeMarkers.origin) {
            const originIcon = L.divIcon({
                className: 'origin-icon',
                html: `<div style="width: 24px; height: 24px; background: #10B981; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>`,
                iconSize: [24, 24]
            });
            const m = L.marker([routeMarkers.origin.lat, routeMarkers.origin.lng], { icon: originIcon }).addTo(mapRef.current);
            routeMarkersRef.current.push(m);
        }
        if (routeMarkers.destination) {
            const destIcon = L.divIcon({
                className: 'dest-icon',
                html: `<div style="width: 24px; height: 24px; background: #EF4444; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>`,
                iconSize: [24, 24]
            });
            const m = L.marker([routeMarkers.destination.lat, routeMarkers.destination.lng], { icon: destIcon }).addTo(mapRef.current);
            routeMarkersRef.current.push(m);
        }
    }

  }, [activeRoute, routeMarkers]);

  // Render User's Live Location
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    if (userLocation) {
        const customIcon = L.divIcon({
            className: 'user-location-icon',
            html: `
                <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                    <div class="animate-ping" style="position: absolute; width: 100%; height: 100%; background-color: #3B82F6; opacity: 0.75; border-radius: 50%;"></div>
                    <div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10;"></div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        } else {
            const marker = L.marker([userLocation.lat, userLocation.lng], { icon: customIcon, zIndexOffset: 2000 }).addTo(mapRef.current);
            userLocationMarkerRef.current = marker;
        }
    } else {
        // Remove marker if userLocation is null (tracking stopped)
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
            userLocationMarkerRef.current = null;
        }
    }
  }, [userLocation]);


  // Fly/Pan to selection (User, Vehicle, or Global Search)
  useEffect(() => {
    if (!mapRef.current) return;

    if (userLocation) {
        if (isInitialLocationTrack.current) {
            mapRef.current.flyTo([userLocation.lat, userLocation.lng], 16, { animate: true, duration: 1.5 });
            isInitialLocationTrack.current = false;
        } else {
            mapRef.current.panTo([userLocation.lat, userLocation.lng], { animate: true, duration: 1.0 });
        }
    } else {
        isInitialLocationTrack.current = true; // Reset for next time
        if (selectedVehicleId) {
            const vehicle = vehicles.find(v => v.id === selectedVehicleId);
            if (vehicle) {
                mapRef.current.flyTo([vehicle.location.lat, vehicle.location.lng], 16, { animate: true, duration: 1.2 });
            }
        } else if (focusedLocation) {
            mapRef.current.flyTo([focusedLocation.lat, focusedLocation.lng], 14, { animate: true, duration: 1.5 });
        }
    }
  }, [selectedVehicleId, vehicles, focusedLocation, userLocation]);

  return (
    <div ref={mapContainerRef} className="w-full h-full z-0 outline-none bg-slate-100"></div>
  );
};

export default LeafletMap;
