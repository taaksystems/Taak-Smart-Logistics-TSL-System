
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
import { db } from './services/database';
import { Vehicle, Shipment, Driver, MaintenanceRecord, Order, Invoice, Alert } from './types';
import AIChat from './components/AIChat';

type ViewMode = 'map' | 'fleet' | 'drivers' | 'shipments' | 'analytics' | 'orders' | 'billing' | 'profile';
type NotificationFilter = 'ALL' | 'DRIVER' | 'SYSTEM';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>([]); // Navigation Stack

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For bottom sheet in map mode
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For main navigation
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('ALL');

  // Initialize Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        db.init();
        const [v, d, s, m, o, i, a] = await Promise.all([
          db.getVehicles(),
          db.getDrivers(),
          db.getShipments(),
          db.getMaintenanceRecords(),
          db.getOrders(),
          db.getInvoices(),
          db.getAlerts()
        ]);
        
        setVehicles(v);
        setDrivers(d);
        setShipments(s);
        setMaintenanceRecords(m);
        setOrders(o);
        setInvoices(i);
        setAlerts(a);
      } catch (error) {
        console.error("Failed to fetch data from DB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Navigation Helper
  const navigateTo = (view: ViewMode) => {
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView(view);
    setIsMenuOpen(false);
    setIsQuickActionOpen(false);
  };

  const handleBack = () => {
    if (viewHistory.length > 0) {
      const prevView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setCurrentView(prevView);
    } else {
      setCurrentView('map');
      setSelectedVehicleId(null);
    }
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    setViewHistory(prev => [...prev, currentView]);
    setCurrentView('map'); 
  };

  const handleCreateShipment = async (newShipment: Shipment) => {
    const saved = await db.addShipment(newShipment);
    setShipments(prev => [saved, ...prev]);
  };
  
  const handleAddVehicle = async (newVehicle: Vehicle) => {
      const saved = await db.addVehicle(newVehicle);
      setVehicles(prev => [saved, ...prev]);
  };

  const handleAddDriver = async (newDriver: Driver) => {
      const saved = await db.addDriver(newDriver);
      setDrivers(prev => [saved, ...prev]);
  };

  const handleQuickAction = (action: ViewMode) => {
    navigateTo(action);
  };

  const toggleAlertRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      const updatedAlert = { ...alert, read: !alert.read };
      await db.updateAlert(updatedAlert);
      setAlerts(prev => prev.map(a => a.id === id ? updatedAlert : a));
    }
  };

  const handleApproveMaintenance = async (e: React.MouseEvent, alertId: string, vehicleId?: string, issue?: string) => {
    e.stopPropagation();
    if (vehicleId && issue) {
        const newRecord: MaintenanceRecord = {
            id: `MNT-${Date.now()}`,
            vehicleId: vehicleId,
            type: issue,
            date: new Date().toISOString().split('T')[0],
            cost: 0,
            status: 'SCHEDULED',
            comment: 'Approved from driver request'
        };
        await db.addMaintenanceRecord(newRecord);
        setMaintenanceRecords(prev => [newRecord, ...prev]);
    }
    // Remove alert after approval
    await db.deleteAlert(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleRejectMaintenance = async (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    await db.deleteAlert(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleViewVehicleReport = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    navigateTo('analytics');
  };

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const unreadAlertCount = alerts.filter(a => !a.read).length;

  const filteredAlerts = alerts.filter(a => {
    if (notificationFilter === 'DRIVER') return a.type === 'DRIVER' || a.type === 'SAFETY';
    if (notificationFilter === 'SYSTEM') return a.type === 'SYSTEM' || a.type === 'FINANCE' || a.type === 'SHIPMENT';
    return true;
  });

  const MenuButton: React.FC<{ label: string; icon: React.ReactNode; view: ViewMode }> = ({ label, icon, view }) => (
    <button 
      onClick={() => navigateTo(view)}
      className={`w-full p-4 flex items-center gap-4 rounded-xl transition-all ${currentView === view ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentView === view ? 'bg-emerald-100' : 'bg-white border border-gray-100'}`}>
        {icon}
      </div>
      <span className="text-lg">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-