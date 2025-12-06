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
  const [isSimulating, setIsSimulating] = useState(false);
  
  const watchId = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const simulationProgress = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, []);

  const stopSharing = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsSharing(false);
    setIsSimulating(false);
    setLocation(null);
    setStatusMessage('Location sharing stopped.');
    onLocationUpdate(null, driverName);
  };

  const toggleLocationSharing = () => {
    if (isSharing) {
      stopSharing();
    } else {
      if ('geolocation' in navigator) {
        setStatusMessage('Starting location sharing...');
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { lat: latitude, lng: longitude };
            setLocation(newLocation);
            setIsSharing(true);
            setIsSimulating(false);
            setStatusMessage(`Live location is being shared with admin.`);
            onLocationUpdate(newLocation, driverName);
          },
          (error) => {
            console.error("Geolocation Error:", error);
            setStatusMessage(`Error: ${error.message}`);
            stopSharing();
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setStatusMessage('Geolocation is not supported by your browser.');
      }
    }
  };

  const toggleSimulation = () => {
    if (isSharing && isSimulating) {
        stopSharing();
    } else {
        // Stop any existing sharing first to be clean
        if (isSharing) stopSharing();

        setIsSharing(true);
        setIsSimulating(true);
        setStatusMessage('Simulating live trip...');
        
        // San Francisco Route Loop
        const center = { lat: 37.7749, lng: -122.4194 };
        const radius = 0.015; // ~1.5km radius
        
        const animate = () => {
            simulationProgress.current = (simulationProgress.current + 0.002) % (2 * Math.PI);
            
            // Simple circular path
            const lat = center.lat + (radius * Math.cos(simulationProgress.current));
            const lng = center.lng + (radius * Math.sin(simulationProgress.current));
            
            const newLocation = { lat, lng };
            setLocation(newLocation);
            onLocationUpdate(newLocation, driverName);
            
            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        animationFrameId.current = requestAnimationFrame(animate);
    }
  };

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

            <div className="mt-12 flex flex-col items-center gap-6">
                <button
                    onClick={toggleLocationSharing}
                    className={`
                        w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform active:scale-95 shadow-2xl relative z-10
                        ${isSharing && !isSimulating ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-slate-700 hover:bg-slate-600'}
                    `}
                >
                    <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    <span className="font-bold text-lg">{isSharing && !isSimulating ? 'Stop Sharing' : 'Share Location'}</span>
                    {isSharing && !isSimulating && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></span>}
                </button>
                
                <button 
                    onClick={toggleSimulation}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isSimulating ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {isSimulating ? 'Stop Simulation' : 'Simulate Demo Trip'}
                </button>

                <div className="mt-4 text-center text-slate-300 min-h-[60px] px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <p className={`text-sm font-bold ${isSharing ? 'text-emerald-400' : 'text-slate-400'}`}>{statusMessage}</p>
                    {location ? (
                        <p className="text-xs text-slate-400 font-mono mt-2 tabular-nums">
                            Lat: <span className="text-white">{location.lat.toFixed(6)}</span> <span className="mx-2">|</span> Lng: <span className="text-white">{location.lng.toFixed(6)}</span>
                        </p>
                    ) : (
                        <p className="text-xs text-slate-500 mt-2 italic">Ready to connect...</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DriverDashboard;