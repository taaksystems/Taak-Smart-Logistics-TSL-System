
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

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
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

  const InputField = ({ label, value, onChange, type = "text", placeholder, required }: any) => (
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide ml-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            required={required}
            className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400" 
            placeholder={placeholder} 
        />
      </div>
  );

  return (
    <div className="h-full flex flex-col relative font-sans">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Management</h2>
                <p className="text-sm text-slate-500 font-medium hidden sm:block">Manage vehicles, maintenance, and fuel consumption.</p>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
             <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto shadow-inner">
                {['registry', 'maintenance', 'fuel'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-white text-emerald-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Add Vehicle</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* DELETE CONFIRMATION MODAL */}
        {deleteModal.isOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
                 <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-scale-in border border-white/40">
                     <div className="text-center mb-8">
                         <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">Authorize Deletion</h3>
                         <p className="text-sm text-slate-500 leading-relaxed">This action cannot be undone. Please enter the administrator passcode to confirm.</p>
                     </div>
                     
                     <div className="mb-8">
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Passcode</label>
                         <input 
                            type="password" 
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none text-center tracking-[0.5em] text-xl font-bold text-slate-800 placeholder:text-slate-300 transition-all"
                            placeholder="••••"
                            autoFocus
                         />
                         {passcodeError && <p className="text-rose-500 text-xs mt-3 font-bold text-center bg-rose-50 py-1 rounded-lg">{passcodeError}</p>}
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                         <button 
                             onClick={() => setDeleteModal({ isOpen: false, vehicleId: null })}
                             className="py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                             onClick={confirmDelete}
                             className="py-3.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                         >
                             Delete
                         </button>
                     </div>
                 </div>
             </div>
        )}

        {/* ADD VEHICLE MODAL */}
        {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white rounded-[2rem] p-8 w-full max-w-4xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto border border-white/50">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6 sticky top-0 bg-white z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Add New Vehicle</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">Register a new asset to the fleet.</p>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Section 1: Basic Info */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-2">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <InputField label="Vehicle Identifier" value={formData.name} onChange={(e: any) => handleInputChange('name', e.target.value)} required placeholder="e.g. Truck Alpha" />
                                </div>
                                <div>
                                    <InputField label="License Plate" value={formData.licensePlate} onChange={(e: any) => handleInputChange('licensePlate', e.target.value)} required placeholder="e.g. 8XYZ-123" />
                                </div>
                                <div>
                                    <InputField label="Make" value={formData.make} onChange={(e: any) => handleInputChange('make', e.target.value)} placeholder="e.g. Volvo" />
                                </div>
                                <div>
                                    <InputField label="Model" value={formData.model} onChange={(e: any) => handleInputChange('model', e.target.value)} placeholder="e.g. FH16" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide ml-1">Type</label>
                                    <div className="relative">
                                        <select value={formData.type} onChange={e => handleInputChange('type', e.target.value)} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none font-medium text-slate-800">
                                            <option>Truck</option><option>Van</option><option>Tanker</option><option>Trailer</option>
                                        </select>
                                        <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                <div>
                                    <InputField label="Year" value={formData.year} onChange={(e: any) => handleInputChange('year', e.target.value)} placeholder="2023" />
                                </div>
                                <div className="col-span-2">
                                    <InputField label="VIN" value={formData.vin} onChange={(e: any) => handleInputChange('vin', e.target.value)} placeholder="Vehicle Identification Number" />
                                </div>
                                <div>
                                    <InputField label="Color" value={formData.color} onChange={(e: any) => handleInputChange('color', e.target.value)} placeholder="e.g. White" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Specs & Ops */}
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Capacity & Specs</h4>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <InputField label="Load Cap. (kg)" type="number" value={formData.loadCapacity} onChange={(e: any) => handleInputChange('loadCapacity', parseFloat(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide ml-1">Fuel Type</label>
                                        <div className="relative">
                                            <select value={formData.fuelType} onChange={e => handleInputChange('fuelType', e.target.value)} className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none font-medium text-slate-800">
                                                <option>Diesel</option>
                                                <option>Petrol</option>
                                                <option>Hybrid-Petrol</option>
                                                <option>Hybrid-Diesel</option>
                                            </select>
                                            <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <InputField label="Tank Cap. (L)" type="number" value={formData.tankCapacity} onChange={(e: any) => handleInputChange('tankCapacity', parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest border-b border-amber-100 pb-2">Maintenance & Compliance</h4>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <InputField label="Odometer (km)" type="number" value={formData.odometer} onChange={(e: any) => handleInputChange('odometer', parseFloat(e.target.value))} />
                                    </div>
                                    <div>
                                        <InputField label="Last Service" type="date" value={formData.lastMaintenance} onChange={(e: any) => handleInputChange('lastMaintenance', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputField label="Next Due" type="date" value={formData.nextServiceDue} onChange={(e: any) => handleInputChange('nextServiceDue', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputField label="Insurance Exp." type="date" value={formData.insuranceExpiry} onChange={(e: any) => handleInputChange('insuranceExpiry', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {vehicles.map(vehicle => (
                    <div 
                        key={vehicle.id} 
                        className="flex flex-col bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer hover:border-emerald-300 relative overflow-hidden"
                        onClick={() => onViewReport(vehicle.id)}
                    >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                                    vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-100 text-emerald-600' : 
                                    vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-rose-100 text-rose-600' : 
                                    'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                                }`}>
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{vehicle.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{vehicle.id}</p>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-emerald-500 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                            </button>
                        </div>

                        {/* Card Details Grid */}
                        <div className="grid grid-cols-2 gap-y-5 gap-x-2 border-t border-slate-50 pt-5 mb-4">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wide">Driver</div>
                                <div className="text-sm font-semibold text-slate-800 truncate">{vehicle.driver || 'Unassigned'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wide">Status</div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                    vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                    vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                                    'bg-slate-50 text-slate-600 border-slate-100'
                                }`}>
                                    {vehicle.status ? vehicle.status.replace('_', ' ') : 'idle'}
                                </span>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wide">Load</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[60px]">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${vehicle.loadPercentage}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{vehicle.loadPercentage}%</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wide">Fuel</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[60px]">
                                        <div className={`h-1.5 rounded-full ${vehicle.fuelLevel! < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${vehicle.fuelLevel}%` }}></div>
                                    </div>
                                    <span className={`text-xs font-bold ${vehicle.fuelLevel! < 20 ? 'text-rose-500' : 'text-slate-700'}`}>{vehicle.fuelLevel}%</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Footer Actions */}
                        <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button 
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                                title="Edit Vehicle"
                                onClick={(e) => { e.stopPropagation(); /* Add edit logic */ }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button 
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                                title="Remove Vehicle"
                                onClick={(e) => handleDeleteClick(vehicle.id, e)}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
            <div>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
                    <div className="p-2.5 bg-blue-100 rounded-xl shrink-0 text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">Driver Requests Only</h4>
                        <p className="text-sm text-blue-700/80 leading-relaxed">Maintenance requests are initiated by drivers via their mobile app. Fleet managers review and schedule based on priority.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maintenanceRecords.map(record => (
                        <div key={record.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                            
                            {/* Header Stripe */}
                            <div className={`h-1.5 w-full ${record.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                {/* Top Row */}
                                <div className="flex justify-between items-start mb-5">
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{record.type}</h3>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                        record.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>

                                {/* Timeline Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Reported By
                                        </div>
                                        <div className="font-semibold text-slate-800 text-xs truncate">{record.reportedBy || 'Unknown Driver'}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{record.reportedDate || 'N/A'}</div>
                                    </div>
                                    <div className={`${record.status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'} rounded-xl p-3 border`}>
                                        <div className="flex items-center gap-1.5 mb-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {record.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}
                                        </div>
                                        <div className="font-bold text-slate-800 text-sm">{record.date}</div>
                                    </div>
                                </div>

                                {/* Comment Block */}
                                {record.comment ? (
                                    <blockquote className="relative p-4 mb-5 text-xs italic text-slate-600 bg-slate-50 rounded-xl border-l-4 border-slate-300">
                                        "{record.comment}"
                                    </blockquote>
                                ) : (
                                    <div className="p-4 mb-5 text-xs text-slate-400 italic bg-slate-50/50 rounded-xl text-center">No comments logged.</div>
                                )}

                                {/* Footer */}
                                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5 text-slate-500 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
                                        {record.vehicleId}
                                    </div>
                                    <div className="font-bold text-slate-900 text-sm">${record.cost.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* FUEL TAB */}
        {activeTab === 'fuel' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl overflow-hidden min-h-[300px] flex flex-col justify-center group">
                    {/* Background Image with opacity increased to 75% */}
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop")' }}
                    ></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-3 text-slate-200">Fleet Efficiency</h3>
                        <div className="text-6xl font-black mb-3 tracking-tighter">3.8 <span className="text-2xl font-medium text-slate-400">km/L</span></div>
                        <p className="text-slate-300 text-base max-w-sm leading-relaxed mb-8">Average fleet efficiency. Optimization strategies have improved consumption by 5% this month.</p>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2 tracking-wide">
                                <span>Efficiency Goal</span>
                                <span>95%</span>
                            </div>
                            <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 content-start">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer hover:border-emerald-300 transition-all hover:shadow-md group" onClick={() => onViewReport(vehicle.id)}>
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl shrink-0 group-hover:bg-emerald-100 transition-colors">
                                    {vehicle.efficiency}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{vehicle.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                                            vehicle.fuelType === 'Diesel' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                            vehicle.fuelType === 'Petrol' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            'bg-teal-50 text-teal-700 border-teal-200'
                                        }`}>
                                            {vehicle.fuelType}
                                        </span>
                                    </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className={`font-bold text-xl ${vehicle.fuelLevel! < 30 ? 'text-rose-500' : 'text-emerald-600'}`}>
                                    {vehicle.fuelLevel}%
                                </div>
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wide">Fuel Level</div>
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
