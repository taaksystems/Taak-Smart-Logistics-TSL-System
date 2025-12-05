
export enum VehicleStatus {
  IDLE = 'IDLE',
  IN_TRANSIT = 'IN_TRANSIT',
  MAINTENANCE = 'MAINTENANCE',
  DELIVERED = 'DELIVERED'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string; // Fleet Number
  name: string; // Simple unique identifier
  status?: VehicleStatus;
  location: Coordinates;
  destination?: string;
  loadPercentage: number;
  driver?: string;
  eta?: string;
  fuelLevel?: number;
  lastMaintenance?: string;
  efficiency?: number; // km per liter
  
  // Basic Information
  licensePlate?: string;
  type?: string; // Truck, Trailer, Van, etc.
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
  color?: string;
  ownership?: 'Owned' | 'Leased' | 'Contracted';

  // Capacity & Specs
  loadCapacity?: number; // kg/tons
  fuelType?: 'Diesel' | 'Petrol' | 'Hybrid-Petrol' | 'Hybrid-Diesel';
  tankCapacity?: number;
  enginePower?: string;
  
  // Compliance
  insuranceExpiry?: string;
  registrationExpiry?: string;

  // Maintenance
  odometer?: number;
  nextServiceDue?: string;
}

export interface EmergencyContact {
  type: 'PRIMARY' | 'SECONDARY';
  name: string;
  relationship: string;
  phone: string;
}

export interface Driver {
  id: string;
  name: string;
  email?: string; // Added for login
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'PENDING';
  rating: number; // 1-5
  totalDistance: number; // km
  phone: string;
  avatarUrl?: string;
  
  // Personal & Docs
  dob?: string;
  address?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  nationalId?: string;
  
  // Qualifications
  certifications?: string[];
  experienceYears?: number;

  // Emergency
  emergencyContacts?: EmergencyContact[];
}

export interface Shipment {
  id: string;
  trackingId: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
  cargoType: string;
  weight: string;
  vehicleId?: string;
  driverId?: string;
  eta?: string;
  
  // Geo Data
  originCoordinates?: Coordinates;
  destinationCoordinates?: Coordinates;
  routeCoordinates?: Coordinates[]; // The path
  progress?: number; // 0 to 100
  estimatedDuration?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  date: string;
  cost: number;
  status: 'COMPLETED' | 'SCHEDULED';
  comment?: string;
  reportedDate?: string;
  reportedBy?: string;
}

export interface Order {
  id: string;
  customerName: string;
  serviceType: string;
  origin: string;
  destination: string;
  requestDate: string;
  status: 'NEW' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  price: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
}

export interface Alert {
  id: string;
  type: 'SAFETY' | 'SYSTEM' | 'SHIPMENT' | 'FINANCE' | 'DRIVER';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
  actionRequired?: boolean;
  metadata?: {
    vehicleId?: string;
    issue?: string;
  };
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  unread: boolean;
  type: 'driver' | 'system';
}

export interface ChatMessage {
  id: string;
  role: 'model' | 'user';
  text: string;
  timestamp: Date;
}

export type ViewMode = 'map' | 'fleet' | 'drivers' | 'shipments' | 'analytics' | 'orders' | 'billing' | 'profile' | 'messages';