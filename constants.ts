
import { Vehicle, VehicleStatus, Driver, Shipment, MaintenanceRecord, Order, Invoice, Alert, Message } from "./types";

export const INITIAL_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco
export const INITIAL_ZOOM = 13;

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'TRK-001',
    name: 'Truck Alpha',
    status: VehicleStatus.IN_TRANSIT,
    location: { lat: 37.7749, lng: -122.4194 },
    destination: 'Oakland Port',
    loadPercentage: 85,
    driver: 'John Doe',
    eta: '2h 15m',
    fuelLevel: 45,
    lastMaintenance: '2023-10-15',
    efficiency: 3.2,
    fuelType: 'Diesel'
  },
  {
    id: 'TRK-002',
    name: 'Van Beta',
    status: VehicleStatus.IDLE,
    location: { lat: 37.7849, lng: -122.4094 },
    destination: 'Warehouse District',
    loadPercentage: 0,
    driver: 'Jane Smith',
    eta: 'N/A',
    fuelLevel: 90,
    lastMaintenance: '2023-11-01',
    efficiency: 4.5,
    fuelType: 'Petrol'
  },
  {
    id: 'TRK-003',
    name: 'Hauler Gamma',
    status: VehicleStatus.MAINTENANCE,
    location: { lat: 37.7649, lng: -122.4294 },
    destination: 'Service Center',
    loadPercentage: 0,
    driver: 'Mike Johnson',
    eta: '1d',
    fuelLevel: 15,
    lastMaintenance: '2023-09-20',
    efficiency: 2.8,
    fuelType: 'Hybrid-Diesel'
  },
  {
    id: 'TRK-004',
    name: 'Express Delta',
    status: VehicleStatus.IN_TRANSIT,
    location: { lat: 37.7549, lng: -122.4494 },
    destination: 'SFO Airport',
    loadPercentage: 45,
    driver: 'Sarah Connor',
    eta: '45m',
    fuelLevel: 72,
    lastMaintenance: '2023-10-30',
    efficiency: 5.1,
    fuelType: 'Hybrid-Petrol'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Doe',
    email: 'john.doe@taak.com',
    status: 'ON_TRIP',
    rating: 4.8,
    totalDistance: 12500,
    phone: '+1 (555) 010-1001',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=0D9488&color=fff',
    licenseNumber: 'DL-CA-99281',
    certifications: ['Hazmat', 'Heavy Vehicle'],
    emergencyContacts: [
      { type: 'PRIMARY', name: 'Mary Doe', relationship: 'Spouse', phone: '+1 (555) 999-0001' }
    ]
  },
  {
    id: 'DRV-002',
    name: 'Jane Smith',
    email: 'jane.smith@taak.com',
    status: 'AVAILABLE',
    rating: 4.9,
    totalDistance: 9800,
    phone: '+1 (555) 010-1002',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=C026D3&color=fff',
    licenseNumber: 'DL-CA-77212',
    certifications: ['Safety Inspector'],
    emergencyContacts: [
      { type: 'PRIMARY', name: 'Bob Smith', relationship: 'Brother', phone: '+1 (555) 999-0002' }
    ]
  },
  {
    id: 'DRV-003',
    name: 'Mike Johnson',
    email: 'mike.j@taak.com',
    status: 'OFF_DUTY',
    rating: 4.5,
    totalDistance: 15400,
    phone: '+1 (555) 010-1003',
    avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=EA580C&color=fff',
    licenseNumber: 'DL-NV-44211',
    emergencyContacts: []
  },
  {
    id: 'DRV-004',
    name: 'Sarah Connor',
    email: 's.connor@taak.com',
    status: 'ON_TRIP',
    rating: 5.0,
    totalDistance: 22000,
    phone: '+1 (555) 010-1004',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=2563EB&color=fff',
    licenseNumber: 'DL-CA-33211',
    certifications: ['Defensive Driving', 'First Aid'],
    emergencyContacts: [
      { type: 'PRIMARY', name: 'Kyle Reese', relationship: 'Partner', phone: '+1 (555) 999-0004' }
    ]
  }
];

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-1001',
    trackingId: 'TRK-992834',
    origin: 'San Jose, CA',
    destination: 'San Francisco, CA',
    status: 'IN_TRANSIT',
    cargoType: 'Electronics',
    weight: '1200 kg',
    vehicleId: 'TRK-001',
    driverId: 'DRV-001',
    eta: '2h 15m',
    originCoordinates: { lat: 37.3382, lng: -121.8863 },
    destinationCoordinates: { lat: 37.7749, lng: -122.4194 },
    progress: 65,
    routeCoordinates: [
        { lat: 37.3382, lng: -121.8863 },
        { lat: 37.4, lng: -122.0 },
        { lat: 37.5, lng: -122.2 },
        { lat: 37.6, lng: -122.35 },
        { lat: 37.7749, lng: -122.4194 }
    ]
  },
  {
    id: 'SHP-1002',
    trackingId: 'TRK-882100',
    origin: 'Sacramento, CA',
    destination: 'Oakland, CA',
    status: 'PENDING',
    cargoType: 'Perishables',
    weight: '500 kg',
    eta: 'TBD',
    progress: 0,
    originCoordinates: { lat: 38.5816, lng: -121.4944 },
    destinationCoordinates: { lat: 37.8044, lng: -122.2711 },
    routeCoordinates: [] // Pending
  },
  {
    id: 'SHP-1003',
    trackingId: 'TRK-772341',
    origin: 'Reno, NV',
    destination: 'San Francisco, CA',
    status: 'DELIVERED',
    cargoType: 'Furniture',
    weight: '2500 kg',
    vehicleId: 'TRK-003',
    driverId: 'DRV-003',
    eta: 'Delivered',
    progress: 100,
    originCoordinates: { lat: 39.5296, lng: -119.8138 },
    destinationCoordinates: { lat: 37.7749, lng: -122.4194 },
    routeCoordinates: [
        { lat: 39.5296, lng: -119.8138 },
        { lat: 38.8, lng: -120.5 },
        { lat: 38.2, lng: -121.5 },
        { lat: 37.7749, lng: -122.4194 }
    ]
  }
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  { 
    id: 'MNT-001', 
    vehicleId: 'TRK-001', 
    type: 'Oil Change', 
    date: '2023-10-15', 
    cost: 150, 
    status: 'COMPLETED',
    reportedBy: 'John Doe',
    reportedDate: '2023-10-12',
    comment: 'Routine mileage interval reached.'
  },
  { 
    id: 'MNT-002', 
    vehicleId: 'TRK-003', 
    type: 'Engine Diagnostics', 
    date: '2023-11-12', 
    cost: 450, 
    status: 'SCHEDULED', 
    comment: 'Check engine light reported by driver. Engine seems to be running rough at idle.',
    reportedBy: 'Mike Johnson',
    reportedDate: '2023-11-10'
  },
  { 
    id: 'MNT-003', 
    vehicleId: 'TRK-002', 
    type: 'Tire Rotation', 
    date: '2023-11-01', 
    cost: 80, 
    status: 'COMPLETED',
    reportedBy: 'Jane Smith',
    reportedDate: '2023-10-28',
    comment: 'Uneven wear noticed on front left tire.'
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-5001', customerName: 'MegaCorp Inc.', serviceType: 'Freight', origin: 'Los Angeles, CA', destination: 'Las Vegas, NV', requestDate: '2023-11-20', status: 'NEW', price: 1200 },
  { id: 'ORD-5002', customerName: 'Fresh Foods Ltd.', serviceType: 'Cold Chain', origin: 'Salinas, CA', destination: 'Portland, OR', requestDate: '2023-11-19', status: 'SCHEDULED', price: 3500 },
  { id: 'ORD-5003', customerName: 'TechHub', serviceType: 'Express', origin: 'San Francisco, CA', destination: 'San Jose, CA', requestDate: '2023-11-18', status: 'COMPLETED', price: 450 }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', orderId: 'ORD-5003', customerName: 'TechHub', issueDate: '2023-11-18', dueDate: '2023-12-18', amount: 450, status: 'PAID' },
  { id: 'INV-2023-002', orderId: 'ORD-5001', customerName: 'MegaCorp Inc.', issueDate: '2023-11-20', dueDate: '2023-12-20', amount: 1200, status: 'UNPAID' },
  { id: 'INV-2023-003', orderId: 'ORD-4998', customerName: 'BuildRight Construction', issueDate: '2023-10-15', dueDate: '2023-11-15', amount: 5600, status: 'OVERDUE' }
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'ALT-001', type: 'SAFETY', title: 'Speeding Alert', message: 'Vehicle TRK-001 exceeded speed limit by 15km/h on I-5.', timestamp: '10 min ago', severity: 'high', read: false },
  { id: 'ALT-002', type: 'SHIPMENT', title: 'Delivery Delay', message: 'Shipment SHP-1002 is delayed due to heavy traffic.', timestamp: '1 hour ago', severity: 'medium', read: false },
  { id: 'ALT-003', type: 'SYSTEM', title: 'Maintenance Due', message: 'TRK-003 is due for scheduled maintenance in 2 days.', timestamp: '2 hours ago', severity: 'low', read: true },
  { id: 'ALT-004', type: 'FINANCE', title: 'Invoice Overdue', message: 'Invoice INV-2023-003 for BuildRight Construction is now overdue.', timestamp: '1 day ago', severity: 'medium', read: true },
  { id: 'ALT-005', type: 'DRIVER', title: 'Maintenance Request', message: 'Driver Mike Johnson flagged TRK-003: "Brake sensitivity issue".', timestamp: '5 min ago', severity: 'high', read: false }
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'MSG-001', sender: 'John Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D9488&color=fff', content: 'Hey, I just arrived at the depot. Loading now.', time: '10:30 AM', unread: true, type: 'driver' },
  { id: 'MSG-002', sender: 'Sarah Connor', avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=2563EB&color=fff', content: 'Traffic is heavy on Route 101. ETA delayed by 15m.', time: '09:45 AM', unread: false, type: 'driver' },
  { id: 'MSG-003', sender: 'System', avatar: 'https://ui-avatars.com/api/?name=SYS&background=64748B&color=fff', content: 'Maintenance scheduled for TRK-002 confirmed.', time: 'Yesterday', unread: false, type: 'system' }
];

export const MAP_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION = '';