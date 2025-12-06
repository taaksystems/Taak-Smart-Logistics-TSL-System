
import React, { useState, useRef, useEffect } from 'react';
import { Coordinates } from '../types';

interface DriverDashboardProps {
  driverName: string;
  onLogout: () => void;
  onLocationUpdate: (coords: Coordinates | null, name: string) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driverName, onLogout, onLocationUpdate }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [statusMessage, setStatusMessage] = useState('Location sharing is off.');
  const watchId = useRef<number | null>(null);

  const toggleLocationSharing = () => {
    if (isSharing) {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      setIsSharing(false);
      setLocation(null);
      setStatusMessage('Location sharing stopped.');
      onLocationUpdate(null, driverName); // Notify parent that sharing has stopped
    } else {
      if ('geolocation' in navigator) {
        setStatusMessage('Starting location sharing...');
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { lat: latitude, lng: longitude };
            setLocation(newLocation);
            setIsSharing(true);
            setStatusMessage(`Live location is being shared with admin.`);
            // In a real app, you would send `newLocation` to the server here.
            onLocationUpdate(newLocation, driverName); // Send location update to parent
          },
          (error) => {
            console.error("Geolocation Error:", error);
            setStatusMessage(`Error: ${error.message}`);
            setIsSharing(false);
            onLocationUpdate(null, driverName); // Notify parent of error
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setStatusMessage('Geolocation is not supported by your browser.');
      }
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        onLocationUpdate(null, driverName);
      }
    };
  }, [driverName, onLocationUpdate]);


  return (
    <div className="w-screen h-screen bg-slate-900 text-white flex flex-col items-center justify-center font-sans p-4 relative">
        <div className="absolute top-6 right-6">
            <button 
                onClick={onLogout}
                className="px-4 py-2 bg-rose-500/20 text-rose-300 rounded-lg text-sm font-bold hover:bg-rose-500/40 transition-colors"
            >
                Log Out
            </button>
        </div>

        <div className="text-center">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(driverName)}&background=10B981&color=fff&size=128`} alt={driverName} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700 shadow-lg"/>
            <h1 className="text-3xl font-bold">Welcome, {driverName}</h1>
            <p className="text-slate-400 mt-2">Driver Dashboard</p>

            <div className="mt-12 flex flex-col items-center">
                <button
                    onClick={toggleLocationSharing}
                    className={`
                        w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform active:scale-95 shadow-2xl
                        ${isSharing ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-700 hover:bg-slate-600'}
                    `}
                >
                    <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    <span className="font-bold text-lg">{isSharing ? 'Stop Sharing' : 'Share Location'}</span>
                </button>
                <div className="mt-8 text-center text-slate-300 min-h-[40px] px-4 py-2 bg-slate-800/50 rounded-lg">
                    <p className="text-sm font-medium">{statusMessage}</p>
                    {location && (
                        <p className="text-xs text-slate-400 font-mono mt-1">
                            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DriverDashboard;
