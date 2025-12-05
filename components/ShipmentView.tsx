
import React, { useState, useEffect } from 'react';
import { Shipment, Vehicle, Driver, Coordinates } from '../types';
import { searchAddress, reverseGeocode, SearchResult, getRoute } from '../services/mapService';

interface ShipmentViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onCreateShipment: (shipment: Shipment) => void;
  onClose: () => void;
  onSelectLocation: (type: 'origin' | 'destination') => void;
  tempCoords: { origin?: Coordinates, destination?: Coordinates };
  onSelectShipment: (shipment: Shipment) => void;
}

const ShipmentView: React.FC<ShipmentViewProps> = ({ 
  shipments, vehicles, drivers, onCreateShipment, onClose,
  onSelectLocation, tempCoords, onSelectShipment 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Route Selection
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    weight: ''
  });

  const [generatedRoutes, setGeneratedRoutes] = useState<any[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Address Search State
  const [originSuggestions, setOriginSuggestions] = useState<SearchResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<SearchResult[]>([]);
  
  // Real coordinates used for routing
  const [realCoords, setRealCoords] = useState<{origin?: Coordinates, destination?: Coordinates}>({});

  // Effect: When tempCoords change (from map pin), reverse geocode them to get address
  useEffect(() => {
    const fetchAddress = async (type: 'origin' | 'destination', coords: Coordinates) => {
        const address = await reverseGeocode(coords.lat, coords.lng);
        setFormData(prev => ({ ...prev, [type]: address }));
        setRealCoords(prev => ({ ...prev, [type]: coords }));
    };

    if (tempCoords.origin) {
        fetchAddress('origin', tempCoords.origin);
    }
    if (tempCoords.destination) {
        fetchAddress('destination', tempCoords.destination);
    }
  }, [tempCoords]);

  // Handle Input Changes for Address Search
  const handleAddressSearch = async (type: 'origin' | 'destination', query: string) => {
      setFormData(prev => ({ ...prev, [type]: query }));
      if (query.length > 2) {
          const results = await searchAddress(query);
          if (type === 'origin') setOriginSuggestions(results);
          else setDestSuggestions(results);
      } else {
          if (type === 'origin') setOriginSuggestions([]);
          else setDestSuggestions([]);
      }
  };

  const selectAddress = (type: 'origin' | 'destination', result: SearchResult) => {
      setFormData(prev => ({ ...prev, [type]: result.display_name }));
      const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
      setRealCoords(prev => ({ ...prev, [type]: coords }));
      // Clear suggestions
      if (type === 'origin') setOriginSuggestions([]);
      else setDestSuggestions([]);
  };

  const calculateRoute = async () => {
    if (!realCoords.origin || !realCoords.destination) return;

    setIsLoadingRoute(true);
    const route = await getRoute(realCoords.origin, realCoords.destination);
    setIsLoadingRoute(false);

    if (route) {
        setGeneratedRoutes([{
            name: 'Optimized Route',
            time: route.duration,
            distance: route.distance,
            points: route.coordinates,
            type: 'fast'
        }]);
        setStep(2);
    } else {
        alert("Could not calculate a route between these locations.");
    }
  };

  const handleFinalize = () => {
    if (selectedRouteIndex === null) return;
    
    const selectedRoute = generatedRoutes[selectedRouteIndex];
    
    const newShipment: Shipment = {
        id: `SHP-${Math.floor(Math.random() * 10000)}`,
        trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
        origin: formData.origin,
        destination: formData.destination,
        status: 'PENDING',
        cargoType: formData.cargoType,
        weight: formData.weight,
        eta: selectedRoute.time,
        originCoordinates: realCoords.origin,
        destinationCoordinates: realCoords.destination,
        routeCoordinates: selectedRoute.points,
        progress: 0,
        estimatedDuration: selectedRoute.time
    };
    onCreateShipment(newShipment);
    setIsCreating(false);
    setStep(1);
    setFormData({ origin: '', destination: '', cargoType: '', weight: '' });
    setRealCoords({});
    setGeneratedRoutes([]);
    setSelectedRouteIndex(null);
  };

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shipments</h2>
                <p className="text-sm text-slate-500 font-medium">Track loads, create orders, and manage deliveries.</p>
            </div>
        </div>
        {!isCreating && (
        <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
            + Create Shipment
        </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* CREATE SHIPMENT FLOW */}
        {isCreating && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100 mb-8 animate-slide-up">
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">New Shipment Request</h3>
                    <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>1</span>
                        <div className="w-8 h-1 bg-gray-100"></div>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cargo Type</label>
                            <input required type="text" value={formData.cargoType} onChange={e => setFormData({...formData, cargoType: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800" placeholder="e.g., Electronics" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Weight</label>
                            <input required type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800" placeholder="e.g., 500 kg" />
                        </div>

                        {/* Origin Selection */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Origin</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={formData.origin} 
                                    onChange={e => handleAddressSearch('origin', e.target.value)} 
                                    className="flex-1 p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium text-slate-800" 
                                    placeholder="Search Origin Address" 
                                />
                                <button onClick={() => onSelectLocation('origin')} className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 border border-emerald-200" title="Pin on Map">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                            {originSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-14 z-10 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {originSuggestions.map(result => (
                                        <div 
                                            key={result.place_id} 
                                            onClick={() => selectAddress('origin', result)}
                                            className="p-3 hover:bg-emerald-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                        >
                                            {result.display_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Destination Selection */}
                        <div className="relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Destination</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={formData.destination} 
                                    onChange={e => handleAddressSearch('destination', e.target.value)} 
                                    className="flex-1 p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-medium text-slate-800" 
                                    placeholder="Search Destination Address" 
                                />
                                <button onClick={() => onSelectLocation('destination')} className="p-3.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 border border-rose-200" title="Pin on Map">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                            {destSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-14 z-10 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {destSuggestions.map(result => (
                                        <div 
                                            key={result.place_id} 
                                            onClick={() => selectAddress('destination', result)}
                                            className="p-3 hover:bg-emerald-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0"
                                        >
                                            {result.display_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                            <button onClick={() => setIsCreating(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                            <button 
                                onClick={calculateRoute} 
                                disabled={!realCoords.origin || !realCoords.destination || isLoadingRoute}
                                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoadingRoute ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </>
                                ) : 'Calculate Routes'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-700 uppercase text-sm">Select Best Route</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {generatedRoutes.map((route, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedRouteIndex(idx)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRouteIndex === idx ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100 bg-gray-50 hover:border-emerald-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-800">{route.name}</div>
                                        {selectedRouteIndex === idx && <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>}
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 mb-1">{route.time}</div>
                                    <div className="text-sm text-gray-500">{route.distance}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                             <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Back</button>
                             <button 
                                onClick={handleFinalize}
                                disabled={selectedRouteIndex === null}
                                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                Confirm Shipment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* SHIPMENT LIST */}
        <div className="space-y-4">
            {shipments.map(shipment => (
                <div 
                    key={shipment.id} 
                    onClick={() => onSelectShipment(shipment)}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer hover:border-emerald-300 relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">{shipment.trackingId}</h4>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{shipment.cargoType} • {shipment.weight}</p>
                            </div>
                        </div>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                shipment.status === 'IN_TRANSIT' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                shipment.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                                {shipment.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-6 py-2 z-10 mb-4">
                         {/* Connecting Line */}
                         <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>
                         
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-[3px] border-emerald-500 bg-white shrink-0 shadow-sm z-10"></div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Origin</div>
                                    <div className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{shipment.origin}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-[3px] border-rose-500 bg-white shrink-0 shadow-sm z-10"></div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Destination</div>
                                    <div className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{shipment.destination}</div>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 relative pt-1 bg-slate-50 rounded-xl p-3 border border-slate-50">
                        <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Shipment Progress</span>
                            <span className="text-xs font-bold text-emerald-600">
                                {shipment.progress || 0}%
                            </span>
                        </div>
                        <div className="overflow-hidden h-2.5 mb-1 text-xs flex rounded-full bg-slate-200">
                            <div style={{ width: `${shipment.progress || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 pt-4 mt-2 relative z-10">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                             </div>
                             <span className="font-medium">{shipment.vehicleId || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">{shipment.estimatedDuration || shipment.eta}</span>
                        </div>
                    </div>
                    
                    {/* Hover Hint */}
                    <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/5 transition-colors pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-emerald-600 shadow-md border border-emerald-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-300">Click to View Route</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentView;
