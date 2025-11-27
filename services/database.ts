
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_SHIPMENTS, MOCK_MAINTENANCE, MOCK_ORDERS, MOCK_INVOICES, MOCK_ALERTS, MOCK_MESSAGES } from "../constants";
import { Vehicle, Driver, Shipment, MaintenanceRecord, Order, Invoice, Alert, Message } from "../types";

const STORAGE_KEYS = {
  VEHICLES: 'smarttms_vehicles',
  DRIVERS: 'smarttms_drivers',
  SHIPMENTS: 'smarttms_shipments',
  MAINTENANCE: 'smarttms_maintenance',
  ORDERS: 'smarttms_orders',
  INVOICES: 'smarttms_invoices',
  ALERTS: 'smarttms_alerts',
  MESSAGES: 'smarttms_messages'
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DatabaseService {
  init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(MOCK_VEHICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(MOCK_DRIVERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHIPMENTS)) {
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(MOCK_SHIPMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAINTENANCE)) {
        localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(MOCK_MAINTENANCE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(MOCK_INVOICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
        localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(MOCK_ALERTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
    }
  }

  // Generic Get
  private get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Generic Set
  private set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // VEHICLES
  async getVehicles(): Promise<Vehicle[]> {
    await delay(600); // Simulate network latency
    return this.get<Vehicle>(STORAGE_KEYS.VEHICLES);
  }

  async addVehicle(vehicle: Vehicle): Promise<Vehicle> {
    await delay(300);
    const vehicles = this.get<Vehicle>(STORAGE_KEYS.VEHICLES);
    const newVehicles = [vehicle, ...vehicles];
    this.set(STORAGE_KEYS.VEHICLES, newVehicles);
    return vehicle;
  }

  // DRIVERS
  async getDrivers(): Promise<Driver[]> {
    await delay(500);
    return this.get<Driver>(STORAGE_KEYS.DRIVERS);
  }
  
  async addDriver(driver: Driver): Promise<Driver> {
      await delay(300);
      const list = this.get<Driver>(STORAGE_KEYS.DRIVERS);
      this.set(STORAGE_KEYS.DRIVERS, [driver, ...list]);
      return driver;
  }

  // SHIPMENTS
  async getShipments(): Promise<Shipment[]> {
      await delay(500);
      return this.get<Shipment>(STORAGE_KEYS.SHIPMENTS);
  }

  async addShipment(shipment: Shipment): Promise<Shipment> {
      await delay(300);
      const list = this.get<Shipment>(STORAGE_KEYS.SHIPMENTS);
      this.set(STORAGE_KEYS.SHIPMENTS, [shipment, ...list]);
      return shipment;
  }

  // MAINTENANCE
  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
      await delay(400);
      return this.get<MaintenanceRecord>(STORAGE_KEYS.MAINTENANCE);
  }
  
  async addMaintenanceRecord(record: MaintenanceRecord): Promise<MaintenanceRecord> {
      await delay(300);
      const list = this.get<MaintenanceRecord>(STORAGE_KEYS.MAINTENANCE);
      this.set(STORAGE_KEYS.MAINTENANCE, [record, ...list]);
      return record;
  }

  // ORDERS
  async getOrders(): Promise<Order[]> {
      await delay(400);
      return this.get<Order>(STORAGE_KEYS.ORDERS);
  }

  // INVOICES
  async getInvoices(): Promise<Invoice[]> {
      await delay(400);
      return this.get<Invoice>(STORAGE_KEYS.INVOICES);
  }

  // ALERTS
  async getAlerts(): Promise<Alert[]> {
      await delay(300);
      return this.get<Alert>(STORAGE_KEYS.ALERTS);
  }

  async updateAlert(alert: Alert): Promise<Alert> {
      await delay(200);
      const list = this.get<Alert>(STORAGE_KEYS.ALERTS);
      const updated = list.map(a => a.id === alert.id ? alert : a);
      this.set(STORAGE_KEYS.ALERTS, updated);
      return alert;
  }

  async deleteAlert(id: string): Promise<void> {
      await delay(200);
      const list = this.get<Alert>(STORAGE_KEYS.ALERTS);
      const updated = list.filter(a => a.id !== id);
      this.set(STORAGE_KEYS.ALERTS, updated);
  }
}

export const db = new DatabaseService();
