
import React, { useState } from 'react';
import { Vehicle, MaintenanceRecord, VehicleStatus } from '../types';

interface FleetViewProps {
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  onViewReport: (vehicleId: string) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onClose: () => void;
}

const FleetView: React.FC<FleetViewProps> = ({ vehicles, maintenanceRecords, onViewReport, onAddVehicle, onDeleteVehicle, onClose }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'maintenance' | 'fuel'>('registry');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, vehicleId: string | null}>({ isOpen: false, vehicleId: null });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [formData, setFormData] = useState<Partial<Vehicle>>({
      name: '',
      fuelLevel: 100,
      loadPercentage: 0,
      efficiency: 0,
      location: { lat: 37.7749, lng: -122.4194 },
      licensePlate: '',
      type: 'Truck',
      make: '',
      model: '',
      year: '',
      vin: '',
      color: '',
      loadCapacity: 0,
      fuelType: 'Diesel',
      tankCapacity: 0,
      insuranceExpiry: '',
      odometer: 0,
      nextServiceDue: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.name) {
          const newVehicle: Vehicle = {
              ...formData,
              id: `VEH-${Date.now()}`, 
              status: VehicleStatus.IDLE,
              driver: 'Unassigned',
          } as Vehicle;

          onAddVehicle(newVehicle);
          setIsAdding(false);
          setFormData({ 
            name: '', fuelLevel: 100, efficiency: 0, loadPercentage: 0, 
            location: { lat: 37.7749, lng: -122.4194 }, licensePlate: '', type: 'Truck', make: '', model: '', year: '', 
            vin: '', color: '', loadCapacity: 0, fuelType: 'Diesel', tankCapacity: 0, insuranceExpiry: '', odometer: 0, nextServiceDue: '' 
          });
      }
  };

  const handleInputChange = (field: keyof Vehicle, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (id: string) => {
      setDeleteModal({ isOpen: true, vehicleId: id });
      setPasscode('');
      setPasscodeError('');
  };

  const confirmDelete = () => {
      if (passcode === '1234') { // Hardcoded demo passcode
          if (deleteModal.vehicleId) {
              onDeleteVehicle(deleteModal.vehicleId);
          }
          setDeleteModal({ isOpen: false, vehicleId: null });
      } else {
          setPasscodeError('Incorrect passcode');
      }
  };

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (vehicle.driver && vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())) ||
    vehicle.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative font-sans">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
                <p className="text-sm text-gray-500 hidden sm:block">Manage vehicles, maintenance, and fuel consumption.</p>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
             <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                {['registry', 'maintenance', 'fuel'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Add Vehicle</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
        
        {/* DELETE CONFIRMATION MODAL */}
        {deleteModal.isOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
                 <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in border border-white/20">
                     <div className="text-center mb-6">
                         <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">Authorize Deletion</h3>
                         <p className="text-sm text-gray-500">This action cannot be undone. Please enter the administrator passcode to confirm.</p>
                     </div>
                     
                     <div className="mb-6">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Passcode</label>
                         <input 
                            type="password" 
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-center tracking-widest text-lg font-bold text-gray-800"
                            placeholder="••••"
                            autoFocus
                         />
                         {passcodeError && <p className="text-rose-500 text-xs mt-2 font-semibold text-center">{passcodeError}</p>}
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                         <button 
                             onClick={() => setDeleteModal({ isOpen: false, vehicleId: null })}
                             className="py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                             onClick={confirmDelete}
                             className="py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                         >
                             Delete
                         </button>
                     </div>
                 </div>
             </div>
        )}

        {/* ADD VEHICLE MODAL */}
        {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 w-full max-w-4xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto border border-gray-100">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
                        <h3 className="text-xl font-bold text-gray-800">Add New Vehicle</h3>
                        <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wide border-b border-gray-100 pb-2">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vehicle Identifier (Name)</label>
                                    <input required type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. Truck Alpha" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Plate</label>
                                    <input required type="text" value={formData.licensePlate} onChange={e => handleInputChange('licensePlate', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. 8XYZ-123" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Make</label>
                                    <input type="text" value={formData.make} onChange={e => handleInputChange('make', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. Volvo" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label>
                                    <input type="text" value={formData.model} onChange={e => handleInputChange('model', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. FH16" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                                    <select value={formData.type} onChange={e => handleInputChange('type', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none">
                                        <option>Truck</option><option>Van</option><option>Tanker</option><option>Trailer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Year</label>
                                    <input type="text" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="2023" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">VIN</label>
                                    <input type="text" value={formData.vin} onChange={e => handleInputChange('vin', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="Vehicle Identification Number" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
                                    <input type="text" value={formData.color} onChange={e => handleInputChange('color', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. White" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Specs & Ops */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide border-b border-gray-100 pb-2">Capacity & Specs</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Load Cap. (kg)</label>
                                        <input type="number" value={formData.loadCapacity} onChange={e => handleInputChange('loadCapacity', parseFloat(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuel Type</label>
                                        <select value={formData.fuelType} onChange={e => handleInputChange('fuelType', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none">
                                            <option>Diesel</option>
                                            <option>Petrol</option>
                                            <option>Hybrid-Petrol</option>
                                            <option>Hybrid-Diesel</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tank Cap. (L)</label>
                                        <input type="number" value={formData.tankCapacity} onChange={e => handleInputChange('tankCapacity', parseFloat(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wide border-b border-gray-100 pb-2">Maintenance & Compliance</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Odometer (km)</label>
                                        <input type="number" value={formData.odometer} onChange={e => handleInputChange('odometer', parseFloat(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Service</label>
                                        <input type="date" value={formData.lastMaintenance} onChange={e => handleInputChange('lastMaintenance', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Next Due</label>
                                        <input type="date" value={formData.nextServiceDue} onChange={e => handleInputChange('nextServiceDue', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Insurance Exp.</label>
                                        <input type="date" value={formData.insuranceExpiry} onChange={e => handleInputChange('insuranceExpiry', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-amber-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
                                    Add Vehicle to Fleet
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* REGISTRY TAB */}
        {activeTab === 'registry' && (
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                        placeholder="Search vehicles by name, ID, or driver..."
                    />
                </div>

                {/* Registry Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-100/50 rounded-lg text-[11px] font-bold text-gray-400 uppercase tracking-wider border border-gray-200/50">
                    <div className="col-span-4">Vehicle Details</div>
                    <div className="col-span-2">Assigned Driver</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Load</div>
                    <div className="col-span-1">Fuel</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="grid gap-3">
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map(vehicle => (
                            <div 
                                key={vehicle.id} 
                                className="bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-300 transition-all shadow-sm group hover:shadow-md grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                            >
                                {/* Vehicle Details */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4 cursor-pointer" onClick={() => onViewReport(vehicle.id)}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                        vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-100 text-emerald-600' : 
                                        vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                                    }`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2 truncate text-sm sm:text-base">
                                            {vehicle.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-mono">{vehicle.id}</p>
                                    </div>
                                </div>

                                {/* Driver */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="md:hidden text-[10px] uppercase font-bold text-gray-400 mb-1">Driver</div>
                                    <div className="text-sm font-medium text-gray-700 truncate">{vehicle.driver || 'Unassigned'}</div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <div className="md:hidden text-[10px] uppercase font-bold text-gray-400 mb-1">Status</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                        vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                                        vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-red-50 text-red-700 border border-red-100' : 
                                        'bg-gray-50 text-gray-600 border border-gray-100'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                            vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-500' : 
                                            vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-red-500' : 
                                            'bg-gray-400'
                                        }`}></span>
                                        {vehicle.status ? vehicle.status.replace('_', ' ').toLowerCase() : 'idle'}
                                    </span>
                                </div>

                                {/* Load */}
                                <div className="col-span-1 md:col-span-1">
                                    <div className="md:hidden text-[10px] uppercase font-bold text-gray-400 mb-1">Load</div>
                                    <span className="font-semibold text-gray-700 text-sm">{vehicle.loadPercentage}%</span>
                                </div>

                                {/* Fuel */}
                                <div className="col-span-1 md:col-span-1">
                                    <div className="md:hidden text-[10px] uppercase font-bold text-gray-400 mb-1">Fuel</div>
                                    <span className={`font-semibold text-sm ${vehicle.fuelLevel! < 20 ? 'text-red-500' : 'text-gray-700'}`}>{vehicle.fuelLevel}%</span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-2 flex items-center md:justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(vehicle.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Vehicle"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <p>No vehicles found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
            <div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0 text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm">Driver Requests Only</h4>
                        <p className="text-xs text-blue-700/80 mt-1 leading-relaxed">Maintenance requests are initiated by drivers via their mobile app. Fleet managers review and schedule based on priority.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maintenanceRecords.map(record => (
                        <div key={record.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                            
                            {/* Header Stripe */}
                            <div className={`h-1.5 w-full ${record.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                {/* Top Row */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{record.type}</h3>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                        record.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>

                                {/* Timeline Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="flex items-center gap-1.5 mb-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Reported By
                                        </div>
                                        <div className="font-semibold text-gray-800 text-xs truncate">{record.reportedBy || 'Unknown Driver'}</div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">{record.reportedDate || 'N/A'}</div>
                                    </div>
                                    <div className={`${record.status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'} rounded-lg p-3 border`}>
                                        <div className="flex items-center gap-1.5 mb-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {record.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}
                                        </div>
                                        <div className="font-bold text-gray-800 text-sm">{record.date}</div>
                                    </div>
                                </div>

                                {/* Comment Block */}
                                {record.comment ? (
                                    <blockquote className="relative p-3 mb-4 text-xs italic text-gray-600 bg-gray-50 border-l-4 border-gray-300 rounded-r-lg">
                                        <svg className="absolute top-1 left-1 w-3 h-3 text-gray-300 transform -translate-x-full -ml-1 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9 14.8954 9.89543 14 11 14C11.5523 14 12 13.5523 12 13V7C12 6.44772 11.5523 6 11 6H5C4.44772 6 4 6.44772 4 7V13C4 14.6569 5.34315 16 7 16V18C7 19.6569 8.34315 21 10 21H14.017ZM24.017 21L24.017 18C24.017 16.8954 23.122 16 22.017 16H19C19 14.8954 19.8954 14 21 14C21.5523 14 22 13.5523 22 13V7C22 6.44772 21.5523 6 21 6H15C14.4477 6 14 6.44772 14 7V13C14 14.6569 15.3431 16 17 16V18C17 19.6569 18.3431 21 20 21H24.017Z" /></svg>
                                        "{record.comment}"
                                    </blockquote>
                                ) : (
                                    <div className="p-3 mb-4 text-xs text-gray-400 italic bg-gray-50/50 rounded-lg text-center">No comments logged.</div>
                                )}

                                {/* Footer */}
                                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5 text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
                                        {record.vehicleId}
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm">${record.cost.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* FUEL TAB */}
        {activeTab === 'fuel' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl overflow-hidden min-h-[250px] flex flex-col justify-center group">
                    {/* Background Image with opacity increased to 75% */}
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-75 pointer-events-none mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop")' }}
                    ></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-2 text-gray-200">Fuel Efficiency Overview</h3>
                        <div className="text-5xl font-black mb-2 tracking-tight">3.8 <span className="text-lg font-medium text-slate-400">km/L</span></div>
                        <p className="text-slate-300 text-sm max-w-xs">Average fleet efficiency. Optimization strategies have improved consumption by 5% this month.</p>
                        <div className="mt-8">
                            <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-1">
                                <span>Efficiency Goal</span>
                                <span>95%</span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 content-start">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm cursor-pointer hover:border-emerald-300 transition-colors" onClick={() => onViewReport(vehicle.id)}>
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                                    {vehicle.efficiency}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{vehicle.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                            vehicle.fuelType === 'Diesel' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                            vehicle.fuelType === 'Petrol' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-teal-50 text-teal-700 border-teal-200'
                                        }`}>
                                            {vehicle.fuelType}
                                        </span>
                                    </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className={`font-bold text-lg ${vehicle.fuelLevel! < 30 ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {vehicle.fuelLevel}%
                                </div>
                                <div className="text-[10px] uppercase text-gray-400 font-bold">Fuel Level</div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FleetView;
  