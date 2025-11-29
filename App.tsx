import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LeafletMap from './components/Map';
import Analytics from './components/Analytics';
import FleetView from './components/FleetView';
import DriverView from './components/DriverView';
import ShipmentView from './components/ShipmentView';
import OrderView from './components/OrderView';
import BillingView from './components/BillingView';
import ProfileView from './components/ProfileView';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_SHIPMENTS, MOCK_MAINTENANCE, MOCK_ORDERS, MOCK_INVOICES, MOCK_ALERTS } from './constants';
import { Vehicle, Shipment, Driver, MaintenanceRecord, Coordinates } from './types';
import { searchAddress, SearchResult } from './services/mapService';

type ViewMode = 'map' | 'fleet' | 'drivers' | 'shipments' | 'analytics' | 'orders' | 'billing' | 'profile';
type NotificationFilter = 'ALL' | 'DRIVER' | 'SYSTEM';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);
  const [orders] = useState(MOCK_ORDERS);
  const [invoices] = useState(MOCK_INVOICES);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('ALL');

  // Map & Search State
  const [mapSelectionMode, setMapSelectionMode] = useState<'origin' | 'destination' | null>(null);
  const [tempShipmentCoords, setTempShipmentCoords] = useState<{origin?: Coordinates, destination?: Coordinates}>({});
  const [activeRoute, setActiveRoute] = useState<Coordinates[] | null>(null);
  const [routeMarkers, setRouteMarkers] = useState<{origin?: Coordinates, destination?: Coordinates} | null>(null);
  
  // Global Map Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        const results = await searchAddress(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleGlobalSearchSelect = (result: SearchResult) => {
    const coords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setFocusedLocation(coords);
    setSelectedVehicleId(null);
    navigateTo('map');
    setSearchQuery(''); // Clear search after selection
    setSearchResults([]);
  };

  const navigateTo = (view: ViewMode) => {
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
    setIsMenuOpen(false);
    setIsQuickActionOpen(false);
    // Reset map visuals when leaving map view related tasks
    if (view !== 'shipments' && view !== 'map') {
        setActiveRoute(null);
        setRouteMarkers(null);
    }
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
      if (prevView !== 'analytics') setSelectedDriverId(null);
    } else {
      setCurrentView('map');
      setSelectedVehicleId(null);
      setSelectedDriverId(null);
    }
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    setFocusedLocation(null);
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView('map'); 
  };

  const handleCreateShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
    setActiveRoute(null);
    setRouteMarkers(null);
  };
  
  const handleAddVehicle = (newVehicle: Vehicle) => {
      setVehicles(prev => [newVehicle, ...prev]);
  };
  
  const handleDeleteVehicle = (id: string) => {
      setVehicles(prev => prev.filter(v => v.id !== id));
      if (selectedVehicleId === id) setSelectedVehicleId(null);
  };

  const handleAddDriver = (newDriver: Driver) => {
      setDrivers(prev => [newDriver, ...prev]);
  };

  const handleQuickAction = (action: ViewMode) => {
    navigateTo(action);
  };

  const toggleAlertRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: !a.read } : a));
  };

  const handleViewVehicleReport = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    navigateTo('analytics');
  };

  const handleViewDriverReport = (driverId: string) => {
      setSelectedDriverId(driverId);
      navigateTo('analytics');
  };

  // Map Interaction Handler
  const handleMapClick = (coords: Coordinates) => {
      if (mapSelectionMode === 'origin') {
          setTempShipmentCoords(prev => ({ ...prev, origin: coords }));
          setMapSelectionMode(null); // Return to modal
      } else if (mapSelectionMode === 'destination') {
          setTempShipmentCoords(prev => ({ ...prev, destination: coords }));
          setMapSelectionMode(null); // Return to modal
      }
  };

  const handleSelectShipmentOnMap = (shipment: Shipment) => {
      navigateTo('map');
      setSelectedVehicleId(null);
      if (shipment.routeCoordinates) setActiveRoute(shipment.routeCoordinates);
      setRouteMarkers({ origin: shipment.originCoordinates, destination: shipment.destinationCoordinates });
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const unreadAlertCount = alerts.filter(a => !a.read).length;
  const filteredAlerts = alerts.filter(a => {
    if (notificationFilter === 'DRIVER') return a.type === 'DRIVER' || a.type === 'SAFETY';
    if (notificationFilter === 'SYSTEM') return a.type === 'SYSTEM' || a.type === 'FINANCE' || a.type === 'SHIPMENT';
    return true;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden relative font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <LeafletMap 
          vehicles={vehicles} 
          selectedVehicleId={selectedVehicleId}
          onVehicleSelect={handleVehicleSelect}
          mapSelectionMode={mapSelectionMode}
          onMapClick={handleMapClick}
          activeRoute={activeRoute}
          routeMarkers={routeMarkers}
          focusedLocation={focusedLocation}
        />
        
        {/* Map Selection Overlay Hint */}
        {mapSelectionMode && (
             <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl animate-bounce font-bold flex items-center gap-3">
                 <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 Click map to pin {mapSelectionMode}
             </div>
        )}
      </div>

      {/* Header (Hidden during map selection) */}
      {!mapSelectionMode && (
      <div className="absolute top-0 left-0 w-full z-40 p-4 pointer-events-none flex justify-between items-start">
        {/* Left: Menu & Logo */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-3 flex items-center gap-3 pointer-events-auto border border-white/40 ring-1 ring-black/5">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="pl-3 border-l border-gray-200">
              <img src="assets/tmslogo.png" alt="SmartTMS Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>

          {/* Main Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50 animate-fade-in-up origin-top-left ring-1 ring-black/5 flex flex-col pointer-events-auto">
                <button onClick={() => navigateTo('map')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    </div>
                    Map View
                </button>
                <button onClick={() => navigateTo('fleet')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    Fleet
                </button>
                <button onClick={() => navigateTo('drivers')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    Drivers
                </button>
                <button onClick={() => navigateTo('shipments')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    Shipments
                </button>
                <button onClick={() => navigateTo('orders')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    Orders
                </button>
                <button onClick={() => navigateTo('billing')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold border-b border-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    Billing
                </button>
                <button onClick={() => navigateTo('analytics')} className="p-4 hover:bg-gray-50 flex items-center gap-3 text-gray-700 font-bold transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    Reports
                </button>
            </div>
          )}
        </div>

        {/* Right: Notifications & Profile */}
        <div className="relative bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-2.5 flex items-center gap-4 pointer-events-auto border border-white/40 ring-1 ring-black/5">
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-2 rounded-xl transition-colors relative ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-white text-gray-600'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {unreadAlertCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                    )}
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50 animate-fade-in-up origin-top-right ring-1 ring-black/5">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                <button onClick={() => setNotificationFilter('ALL')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${notificationFilter === 'ALL' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>ALL</button>
                                <button onClick={() => setNotificationFilter('DRIVER')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${notificationFilter === 'DRIVER' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>DRIVER</button>
                                <button onClick={() => setNotificationFilter('SYSTEM')} className={`px-2 py-0.5 text-[10px] font-bold rounded ${notificationFilter === 'SYSTEM' ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>SYSTEM</button>
                            </div>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map(alert => (
                                    <div 
                                        key={alert.id} 
                                        onClick={(e) => toggleAlertRead(alert.id, e)}
                                        className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${alert.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${alert.read ? 'text-gray-600' : 'text-gray-900'}`}>{alert.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{alert.message}</p>
                                                <div className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wide">{alert.timestamp} • {alert.type}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">No notifications found</div>
                            )}
                        </div>
                    </div>
                )}
             </div>
             <div className="flex items-center gap-3 pl-2 border-l border-gray-100 cursor-pointer" onClick={() => navigateTo('profile')}>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-800 leading-tight">J. Smith</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Admin</div>
                </div>
                <div className="relative hover:opacity-80 transition-opacity">
                  <img src="https://ui-avatars.com/api/?name=J+Smith&background=10B981&color=fff&font-size=0.4" className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt="Profile" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
             </div>
        </div>
      </div>
      )}

      {/* MODULE VIEWS */}
      {currentView !== 'map' && !mapSelectionMode && (
        <div className="absolute inset-0 z-30 bg-slate-900/20 backdrop-blur-md pt-24 sm:pt-28 pb-4 sm:pb-8 px-2 sm:px-8 overflow-hidden animate-fade-in flex justify-center">
           <div className="w-full max-w-6xl h-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden relative flex flex-col">
              {currentView === 'fleet' && <FleetView vehicles={vehicles} maintenanceRecords={maintenanceRecords} onViewReport={handleViewVehicleReport} onAddVehicle={handleAddVehicle} onDeleteVehicle={handleDeleteVehicle} onClose={handleBack} />}
              {currentView === 'drivers' && <DriverView drivers={drivers} onClose={handleBack} onAddDriver={handleAddDriver} onViewReport={handleViewDriverReport} />}
              {currentView === 'shipments' && <ShipmentView shipments={shipments} vehicles={vehicles} drivers={drivers} onCreateShipment={handleCreateShipment} onClose={handleBack} onSelectLocation={(type) => setMapSelectionMode(type)} tempCoords={tempShipmentCoords} onSelectShipment={handleSelectShipmentOnMap} />}
              {currentView === 'orders' && <OrderView orders={orders} onClose={handleBack} />}
              {currentView === 'billing' && <BillingView invoices={invoices} onClose={handleBack} />}
              {currentView === 'analytics' && <Analytics vehicles={vehicles} drivers={drivers} maintenanceRecords={maintenanceRecords} selectedVehicleId={selectedVehicleId} selectedDriverId={selectedDriverId} onClose={handleBack} />}
              {currentView === 'profile' && <ProfileView onClose={handleBack} />}
           </div>
        </div>
      )}

      {/* MAP CONTROLS & SIDEBAR */}
      {currentView === 'map' && !mapSelectionMode && (
        <>
        {/* Invisible HBox for Search and Add Buttons (Anchored above Fleet Overview) */}
        <div 
          className="absolute left-0 right-0 z-30 px-4 flex items-end justify-center gap-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ bottom: isSidebarOpen ? 'calc(75% + 1rem)' : '7rem' }}
        >
            
            {/* Search Bar */}
            <div className={`pointer-events-auto relative group flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-xl ${
                isSidebarOpen 
                    ? 'w-10 h-10 bg-gray-200/60 backdrop-blur-sm rounded-full shadow-none border-transparent' 
                    : 'flex-1 md:flex-none md:w-[32rem] h-12 bg-white/40 backdrop-blur-md border border-white/40 rounded-full'
            }`}>
                {/* Search Icon */}
                <div className={`absolute inset-0 flex items-center transition-all duration-500 ${isSidebarOpen ? 'justify-center text-gray-500' : 'justify-start left-4 text-gray-700'}`}>
                    {isSearching ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                    ) : (
                        <svg className={`transition-all duration-500 ${isSidebarOpen ? 'h-5 w-5' : 'h-5 w-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    )}
                </div>

                {/* Input */}
                <input 
                    type="text" 
                    className={`block w-full h-full bg-transparent text-gray-900 placeholder:text-[10px] sm:placeholder:text-xs placeholder:text-gray-500 placeholder:font-bold font-bold focus:outline-none focus:ring-0 transition-all duration-300 text-center ${
                        isSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 px-10'
                    }`}
                    placeholder="PLACES, VEHICLES, SHIPMENTS, ORDERS"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSidebarOpen}
                />
                
                {/* Search Results Dropdown (Opens Upwards) */}
                {!isSidebarOpen && searchResults.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden max-h-60 overflow-y-auto animate-fade-in-up flex flex-col-reverse">
                        {searchResults.map((result) => (
                            <button
                                key={result.place_id}
                                onClick={() => handleGlobalSearchSelect(result)}
                                className="w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors text-sm border-b border-gray-100 last:border-0"
                            >
                                <div className="font-semibold text-gray-800 truncate">{result.display_name.split(',')[0]}</div>
                                <div className="text-xs text-gray-500 truncate">{result.display_name}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Button (Right) */}
            <div className="pointer-events-auto relative flex flex-col items-end gap-3">
                 {isQuickActionOpen && !isSidebarOpen && (
                    <div className="flex flex-col gap-3 animate-fade-in-up items-end pb-2 mb-2 absolute bottom-full right-0">
                         <button onClick={() => handleQuickAction('orders')} className="flex items-center gap-3 group relative">
                            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">New Order</div>
                            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                        </button>
                        <button onClick={() => handleQuickAction('shipments')} className="flex items-center gap-3 group relative">
                            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">New Shipment</div>
                            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                        </button>
                        <button onClick={() => handleQuickAction('drivers')} className="flex items-center gap-3 group relative">
                            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">Add Driver</div>
                            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>
                        </button>
                        <button onClick={() => handleQuickAction('fleet')} className="flex items-center gap-3 group relative">
                            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">Add Vehicle</div>
                            <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
                        </button>
                    </div>
                )}
                <button 
                    onClick={() => !isSidebarOpen && setIsQuickActionOpen(!isQuickActionOpen)} 
                    className={`flex items-center justify-center transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
                        isSidebarOpen 
                            ? 'w-10 h-10 rounded-full bg-gray-200/60 backdrop-blur-sm text-gray-400 shadow-none cursor-default' 
                            : `w-14 h-14 rounded-full border-4 border-white/50 backdrop-blur-md shadow-xl ${isQuickActionOpen ? 'bg-red-500 text-white rotate-45 shadow-lg shadow-red-200' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/40'}`
                    }`}
                    disabled={isSidebarOpen}
                >
                    <svg className={`transition-all duration-500 ${isSidebarOpen ? 'w-5 h-5' : 'w-7 h-7'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex flex-col justify-end h-[85vh]">
          {selectedVehicle && (
            <div className="px-4 mb-4 pointer-events-auto w-full max-w-md mx-auto">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-5 animate-slide-up relative overflow-hidden">
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${selectedVehicle.status === 'IN_TRANSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedVehicle.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{selectedVehicle.status?.replace('_', ' ') || 'IDLE'}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedVehicleId(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <button onClick={() => handleViewVehicleReport(selectedVehicle.id)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 relative z-10">
                      <span>View Full Report</span>
                  </button>
              </div>
            </div>
          )}

          <div className={`bg-white rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pointer-events-auto transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col border-t border-gray-100 ${isSidebarOpen ? 'h-[75%]' : 'h-24'}`}>
            <div className="w-full p-4 flex flex-col items-center cursor-pointer shrink-0 relative bg-white rounded-t-[2.5rem]" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-full px-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Fleet Overview</h2>
                  {!isSidebarOpen && <p className="text-xs font-medium text-emerald-600 mt-0.5">{vehicles.length} vehicles active</p>}
                </div>
                <div className={`transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`}>
                    <button className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 bg-white scroll-smooth">
              <Sidebar vehicles={vehicles} selectedVehicleId={selectedVehicleId} onSelectVehicle={(id) => { handleVehicleSelect(id); setIsSidebarOpen(false); }} />
            </div>
            {isSidebarOpen && <div className="p-3 text-center bg-white border-t border-gray-50 pb-6 sm:pb-3 shrink-0"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">© TAAK GROUP OF COMPANIES</p></div>}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default App;