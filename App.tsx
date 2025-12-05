
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LeafletMap from './components/Map';
import Analytics from './components/Analytics';
import FleetView from './components/FleetView';
import DriverView from './components/DriverView';
import ShipmentView from './components/ShipmentView';
import BillingView from './components/BillingView';
import ProfileView from './components/ProfileView';
import MessagesView from './components/MessagesView';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_SHIPMENTS, MOCK_MAINTENANCE, MOCK_INVOICES, MOCK_ALERTS, MOCK_MESSAGES } from './constants';
import { Vehicle, Shipment, Driver, MaintenanceRecord, Coordinates, ViewMode } from './types';
import { searchAddress, SearchResult } from './services/mapService';


type NotificationFilter = 'ALL' | 'DRIVER' | 'SYSTEM';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);
  const [invoices] = useState(MOCK_INVOICES);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [messages] = useState(MOCK_MESSAGES);
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]); 

  const [isFleetSidebarOpen, setIsFleetSidebarOpen] = useState(false);
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
    setIsMenuOpen(false); // Close menu when navigating
    setIsNotificationsOpen(false); // Close notifications panel if navigating
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
    setIsMenuOpen(false); // Ensure menu is closed on back navigation
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

  const toggleAlertRead = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
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

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const unreadAlertCount = alerts.filter(a => !a.read).length;
  const filteredAlerts = alerts.filter(a => {
    if (notificationFilter === 'DRIVER') return a.type === 'DRIVER' || a.type === 'SAFETY';
    if (notificationFilter === 'SYSTEM') return a.type === 'SYSTEM' || a.type === 'FINANCE' || a.type === 'SHIPMENT';
    return true;
  });

  // Styles for Menu Button Items
  const MenuItem = ({ active, onClick, icon, label, badge }: any) => (
    <button 
      onClick={onClick} 
      className={`
        w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 group relative overflow-hidden
        ${active 
          ? 'bg-emerald-50 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-100/50' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
        }
      `}
    >
      <div className={`
        w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
        ${active 
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
          : 'bg-white border border-slate-100 text-slate-400 group-hover:border-emerald-200 group-hover:text-emerald-500'
        }
      `}>
        {icon}
      </div>
      <span className="text-sm tracking-wide flex-1">{label}</span>
      {badge && <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>}
    </button>
  );

  return (
    // ROOT CONTAINER
    <div className="relative w-screen h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* SIDEBAR: Static background layer */}
      <div 
        className={`absolute top-0 left-0 w-full sm:w-80 h-full pt-16 px-5 bg-white/95 backdrop-blur-2xl z-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-r border-gray-100 shadow-xl ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-90 -translate-x-10'}`}
        aria-hidden={!isMenuOpen}
        id="main-navigation-sidebar"
      >
        {/* Company Logo */}
        <div className="mb-8 pl-1">
          <img src="assets/tmslogo.png" alt="SmartTMS Logo" className="h-8 w-auto object-contain" />
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.25em] uppercase mt-2 pl-0.5">Enterprise Logistics AI</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto no-scrollbar pb-8">
          <ul className="space-y-1.5">
            <li>
              <MenuItem 
                active={currentView === 'map'} 
                onClick={() => navigateTo('map')} 
                label="Map Overview"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
              />
            </li>
            <li>
              <MenuItem 
                active={currentView === 'fleet'} 
                onClick={() => navigateTo('fleet')} 
                label="Fleet Management"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              />
            </li>
            <li>
              <MenuItem 
                active={currentView === 'drivers'} 
                onClick={() => navigateTo('drivers')} 
                label="Driver Roster"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              />
            </li>
            <li>
              <MenuItem 
                active={currentView === 'shipments'} 
                onClick={() => navigateTo('shipments')} 
                label="Shipments"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
              />
            </li>
            <li>
              <MenuItem 
                active={currentView === 'billing'} 
                onClick={() => navigateTo('billing')} 
                label="Billing & Invoices"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </li>
            <li>
              <MenuItem 
                active={currentView === 'analytics'} 
                onClick={() => navigateTo('analytics')} 
                label="Analytics & Reports"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
              />
            </li>
             <li>
              <MenuItem 
                active={currentView === 'messages'} 
                onClick={() => navigateTo('messages')} 
                label="Messages"
                badge={messages.filter(m => m.unread).length > 0 ? messages.filter(m => m.unread).length : null}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
              />
            </li>
          </ul>
        </nav>
        
        <div className="pb-6">
            <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors group">
                 <div className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:border-red-100 group-hover:bg-red-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                 </div>
                 <span className="font-semibold text-sm">Log Out</span>
            </button>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`
          absolute inset-0 z-10 
          flex flex-col bg-white
          transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] origin-center will-change-transform
          ${isMenuOpen 
            ? 'scale-[0.88] translate-x-[70%] sm:translate-x-[340px] rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-black/5' 
            : 'scale-100 translate-x-0 rounded-none shadow-none'}
        `}
      >
        {/* Clickable Overlay for Closing */}
        {isMenuOpen && (
          <div 
            className="absolute inset-0 z-50 cursor-pointer bg-white/10 backdrop-blur-[1px]"
            onClick={() => setIsMenuOpen(false)} 
            aria-label="Close menu"
          />
        )}

        {/* Actual App Content */}
        <div className="flex flex-col h-full w-full bg-slate-50 overflow-hidden relative">
          
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
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900/90 text-white px-6 py-3 rounded-full shadow-xl animate-bounce font-bold flex items-center gap-3 backdrop-blur-md" aria-live="polite">
                    <svg className="w-5 h-5 animate-pulse text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Click map to pin {mapSelectionMode}
                </div>
            )}
          </div>

          {/* Header */}
          {!mapSelectionMode && (
          <div className="absolute top-0 left-0 w-full z-40 p-4 sm:p-5 pointer-events-none flex justify-between items-start">
            {/* Left: Menu & Logo */}
            <div className="relative pointer-events-auto">
              <div className="bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/40 rounded-2xl p-2 flex items-center gap-3 border border-white/60 ring-1 ring-black/5 transition-transform hover:scale-[1.02]">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className={`p-2.5 rounded-xl transition-all duration-300 ${isMenuOpen ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-700'}`}
                  aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div className="pl-3 pr-4 border-l border-slate-100/50">
                  <img src="assets/tmslogo.png" alt="SmartTMS Logo" className="h-6 w-auto object-contain opacity-90" />
                </div>
              </div>
            </div>

            {/* Right: Notifications Toggle (Top) & Profile */}
            <div className="relative bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/40 rounded-2xl p-2 flex items-center gap-3 pointer-events-auto border border-white/60 ring-1 ring-black/5 transition-transform hover:scale-[1.02]">
                <div className="relative">
                    <button 
                      onClick={handleNotificationsToggle}
                      className={`p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}
                      aria-label="Toggle notifications panel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        {unreadAlertCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" aria-hidden="true"></span>
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-3 pl-2 border-l border-slate-100/50 cursor-pointer pr-1" onClick={() => navigateTo('profile')} role="button" tabIndex={0} aria-label="Open profile settings">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold text-slate-800 leading-tight">J. Smith</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin</div>
                    </div>
                    <div className="relative hover:opacity-90 transition-opacity">
                      <img src="https://ui-avatars.com/api/?name=J+Smith&background=10B981&color=fff&font-size=0.4" className="w-9 h-9 rounded-full border border-white shadow-sm" alt="Profile" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" aria-hidden="true"></span>
                    </div>
                </div>
            </div>
          </div>
          )}

          {/* MODULE VIEWS */}
          {currentView !== 'map' && !mapSelectionMode && (
            <div className="absolute inset-0 z-30 bg-slate-900/10 backdrop-blur-sm pt-28 sm:pt-36 pb-4 sm:pb-6 px-3 sm:px-6 overflow-hidden animate-fade-in flex justify-center">
              <div className="w-full max-w-7xl h-full bg-white backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/60 overflow-hidden relative flex flex-col ring-1 ring-black/5">
                  {currentView === 'fleet' && <FleetView vehicles={vehicles} maintenanceRecords={maintenanceRecords} onViewReport={handleViewVehicleReport} onAddVehicle={handleAddVehicle} onDeleteVehicle={handleDeleteVehicle} onClose={handleBack} />}
                  {currentView === 'drivers' && <DriverView drivers={drivers} onClose={handleBack} onAddDriver={handleAddDriver} onViewReport={handleViewDriverReport} />}
                  {currentView === 'shipments' && <ShipmentView shipments={shipments} vehicles={vehicles} drivers={drivers} onCreateShipment={handleCreateShipment} onClose={handleBack} onSelectLocation={(type) => setMapSelectionMode(type)} tempCoords={tempShipmentCoords} onSelectShipment={handleSelectShipmentOnMap} />}
                  {currentView === 'billing' && <BillingView invoices={invoices} onClose={handleBack} />}
                  {currentView === 'analytics' && <Analytics vehicles={vehicles} drivers={drivers} maintenanceRecords={maintenanceRecords} selectedVehicleId={selectedVehicleId} selectedDriverId={selectedDriverId} onClose={handleBack} />}
                  {currentView === 'profile' && <ProfileView onClose={handleBack} />}
                  {currentView === 'messages' && <MessagesView initialMessages={messages} onClose={handleBack} />}
              </div>
            </div>
          )}

          {/* NOTIFICATION PANEL (Full Width Bottom Sheet) */}
          <div className={`absolute bottom-0 left-0 right-0 z-[35] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col justify-end ${isNotificationsOpen ? 'h-[80%] translate-y-0 opacity-100' : 'h-0 translate-y-full opacity-0'}`}>
             <div 
               className="bg-white rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] flex flex-col border-t border-gray-100 w-full h-full overflow-hidden"
             >
                <div className="w-full p-6 sm:p-8 flex items-center justify-between border-b border-gray-50 bg-white relative shrink-0">
                   <div className="flex items-center gap-5">
                       <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl text-rose-500 shadow-sm border border-rose-100/50">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                       </div>
                       <div>
                           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h2>
                           <p className="text-sm text-gray-500 font-medium">Keep track of system alerts and updates.</p>
                       </div>
                   </div>
                   <button onClick={() => setIsNotificationsOpen(false)} className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>

                {/* Filter Tabs */}
                <div className="px-6 sm:px-8 py-4 bg-white flex gap-2 shrink-0 border-b border-gray-50">
                     <button onClick={() => setNotificationFilter('ALL')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${notificationFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>ALL</button>
                     <button onClick={() => setNotificationFilter('DRIVER')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${notificationFilter === 'DRIVER' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>DRIVER</button>
                     <button onClick={() => setNotificationFilter('SYSTEM')} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${notificationFilter === 'SYSTEM' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>SYSTEM</button>
                </div>

                <div className="flex-1 overflow-y-auto p-0 bg-white no-scrollbar">
                   {filteredAlerts.length > 0 ? (
                       <div className="divide-y divide-gray-50">
                           {filteredAlerts.map(alert => (
                               <div 
                                   key={alert.id}
                                   className={`p-6 sm:px-8 transition-all hover:bg-gray-50 group flex items-start gap-5 ${alert.read ? 'opacity-60' : 'bg-blue-50/20'}`}
                               >
                                   {/* Circular Checkbox */}
                                   <div className="pt-1.5 shrink-0">
                                       <label className="relative cursor-pointer flex items-center justify-center">
                                         <input 
                                             type="checkbox" 
                                             checked={alert.read} 
                                             onChange={(e) => toggleAlertRead(alert.id, e as any)}
                                             className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:bg-emerald-500 checked:border-emerald-500 transition-all hover:border-emerald-300"
                                         />
                                         <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                       </label>
                                   </div>

                                   <div className="flex-1 min-w-0">
                                       <div className="flex justify-between items-start mb-1.5">
                                           <h4 className={`font-bold text-lg leading-snug ${alert.read ? 'text-gray-500' : 'text-gray-900'}`}>{alert.title}</h4>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50 border border-gray-100 px-2 py-1 rounded ml-2 whitespace-nowrap">{alert.timestamp}</span>
                                       </div>
                                       <p className={`text-sm leading-relaxed ${alert.read ? 'text-gray-400' : 'text-gray-600'}`}>{alert.message}</p>
                                       
                                       <div className="flex items-center gap-3 mt-3">
                                           <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                                               alert.severity === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                               alert.severity === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                               'bg-blue-50 text-blue-600 border-blue-100'
                                           }`}>{alert.severity} Priority</span>
                                           
                                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                               {alert.type}
                                           </span>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300 shadow-inner">
                               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                           </div>
                           <h3 className="text-gray-400 font-bold text-xl mb-1">No Notifications</h3>
                           <p className="text-gray-400 text-sm">You're all caught up!</p>
                       </div>
                   )}
                </div>
             </div>
          </div>

          {/* MAP CONTROLS & FLEET SIDEBAR */}
          {currentView === 'map' && !mapSelectionMode && !isNotificationsOpen && (
            <>
            {/* Invisible HBox for Search and Add Buttons */}
            <div 
              className={`absolute left-0 right-0 z-30 px-6 flex items-end justify-center gap-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isFleetSidebarOpen ? 'bottom-[75%]' : 'bottom-28'} ${selectedVehicle ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}`}
            >
                {/* Search Bar */}
                <div className={`pointer-events-auto relative group flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-lg shadow-slate-300/30 ${
                    isFleetSidebarOpen 
                        ? 'w-12 h-12 bg-white/60 backdrop-blur-md rounded-full shadow-none border-transparent' 
                        : 'flex-1 md:flex-none md:w-[32rem] h-14 bg-white/80 backdrop-blur-md border border-white/60 rounded-full'
                }`}>
                    {/* Search Icon */}
                    <div className={`absolute inset-0 flex items-center transition-all duration-500 ${isFleetSidebarOpen ? 'justify-center text-slate-500' : 'justify-start left-6 text-slate-400'}`}>
                        {isSearching ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-500 border-t-transparent"></div>
                        ) : (
                            <svg className={`transition-all duration-500 ${isFleetSidebarOpen ? 'h-6 w-6' : 'h-5 w-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        )}
                    </div>

                    {/* Input */}
                    <input 
                        type="text" 
                        className={`block w-full h-full bg-transparent text-slate-800 placeholder:text-sm placeholder:text-slate-400 placeholder:font-semibold font-bold focus:outline-none focus:ring-0 transition-all duration-300 text-center ${
                            isFleetSidebarOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 px-14'
                        }`}
                        placeholder="Search map, vehicles, shipments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isFleetSidebarOpen}
                        aria-label="Search places, vehicles, or shipments"
                    />
                    
                    {/* Search Results Dropdown */}
                    {!isFleetSidebarOpen && searchResults.length > 0 && (
                        <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-fade-in-up flex flex-col-reverse">
                            {searchResults.map((result) => (
                                <button
                                    key={result.place_id}
                                    onClick={() => handleGlobalSearchSelect(result)}
                                    className="w-full text-left px-5 py-3.5 hover:bg-emerald-50 transition-colors text-sm border-b border-gray-50 last:border-0"
                                    aria-label={`Select ${result.display_name}`}
                                >
                                    <div className="font-bold text-slate-800 truncate">{result.display_name.split(',')[0]}</div>
                                    <div className="text-xs text-slate-500 truncate">{result.display_name}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Button (Right) */}
                <div className="pointer-events-auto relative flex flex-col items-end gap-3">
                    {isQuickActionOpen && !isFleetSidebarOpen && (
                        <div className="flex flex-col gap-3 animate-fade-in-up items-end pb-2 mb-2 absolute bottom-full right-0">
                            <button onClick={() => handleQuickAction('shipments')} className="flex items-center gap-3 group relative" aria-label="Create New Shipment">
                                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">New Shipment</div>
                                <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                            </button>
                            <button onClick={() => handleQuickAction('drivers')} className="flex items-center gap-3 group relative" aria-label="Add New Driver">
                                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">Add Driver</div>
                                <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div>
                            </button>
                            <button onClick={() => handleQuickAction('fleet')} className="flex items-center gap-3 group relative" aria-label="Add New Vehicle">
                                <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-md border border-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap opacity-100 transition-opacity">Add Vehicle</div>
                                <div className="w-10 h-10 rounded-full bg-white text-emerald-600 shadow-xl border border-emerald-50 flex items-center justify-center hover:bg-emerald-50 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => !isFleetSidebarOpen && setIsQuickActionOpen(!isQuickActionOpen)} 
                        className={`flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                            isFleetSidebarOpen 
                                ? 'w-12 h-12 rounded-full bg-white/60 backdrop-blur-sm text-slate-400 shadow-none cursor-default' 
                                : `w-14 h-14 rounded-full border-4 border-white/50 backdrop-blur-md shadow-xl ${isQuickActionOpen ? 'bg-rose-500 text-white rotate-45 shadow-rose-500/30' : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/40'}`
                        }`}
                        disabled={isFleetSidebarOpen}
                        aria-label={isQuickActionOpen ? "Close quick actions" : "Open quick actions"}
                        aria-expanded={isQuickActionOpen}
                    >
                        <svg className={`transition-all duration-500 ${isFleetSidebarOpen ? 'w-6 h-6' : 'w-7 h-7'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex flex-col justify-end h-[85vh]">
              {selectedVehicle && (
                <div className="px-4 mb-4 pointer-events-auto w-full max-w-md mx-auto">
                  <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-white/60 p-6 animate-slide-up relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${selectedVehicle.status === 'IN_TRANSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{selectedVehicle.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-md">{selectedVehicle.status?.replace('_', ' ') || 'IDLE'}</p>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setSelectedVehicleId(null)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors" aria-label={`Close details for ${selectedVehicle.name}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      {/* Detailed Vehicle Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Driver</div>
                              <div className="font-bold text-slate-800 text-sm truncate">{selectedVehicle.driver || 'Unassigned'}</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</div>
                              <div className="font-bold text-slate-800 text-sm truncate">{selectedVehicle.destination || 'Depot'}</div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Load</div>
                              <div className="flex items-center gap-2">
                                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${selectedVehicle.loadPercentage}%` }}></div>
                                  </div>
                                  <span className="text-xs font-bold text-indigo-600">{selectedVehicle.loadPercentage}%</span>
                              </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fuel</div>
                              <div className="flex items-center gap-2">
                                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${selectedVehicle.fuelLevel! < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${selectedVehicle.fuelLevel}%` }}></div>
                                  </div>
                                  <span className={`text-xs font-bold ${selectedVehicle.fuelLevel! < 20 ? 'text-rose-600' : 'text-emerald-600'}`}>{selectedVehicle.fuelLevel}%</span>
                              </div>
                          </div>
                      </div>

                      <button onClick={() => handleViewVehicleReport(selectedVehicle.id)} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 relative z-10 active:scale-98">
                          <span>View Full Report</span>
                      </button>
                  </div>
                </div>
              )}

              <div className={`bg-white rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col border-t border-gray-100 ${isFleetSidebarOpen ? 'h-[75%]' : 'h-24'}`}>
                <div className="w-full p-4 flex flex-col items-center cursor-pointer shrink-0 relative bg-white rounded-t-[2.5rem]" onClick={() => setIsFleetSidebarOpen(!isFleetSidebarOpen)} role="button" aria-expanded={isFleetSidebarOpen} aria-controls="fleet-overview-sidebar">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4 mt-2"></div>
                  <div className="w-full px-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-slate-400 uppercase tracking-widest text-xs font-bold">Fleet Overview</h2>
                      {!isFleetSidebarOpen && <p className="text-xs font-bold text-emerald-600 mt-0.5">{vehicles.length} vehicles active</p>}
                    </div>
                    <div className={`transform transition-transform duration-300 ${isFleetSidebarOpen ? 'rotate-180' : ''}`}>
                        <button className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors" aria-label={isFleetSidebarOpen ? "Collapse fleet overview" : "Expand fleet overview"}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 bg-white custom-scrollbar scroll-smooth" id="fleet-overview-sidebar">
                  <Sidebar vehicles={vehicles} selectedVehicleId={selectedVehicleId} onSelectVehicle={(id) => { handleVehicleSelect(id); setIsFleetSidebarOpen(false); }} />
                </div>
                {isFleetSidebarOpen && <div className="p-3 text-center bg-white border-t border-gray-50 pb-6 sm:pb-3 shrink-0"><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© TAAK GROUP</p></div>}
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
