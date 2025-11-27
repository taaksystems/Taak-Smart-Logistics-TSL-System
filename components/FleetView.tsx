import React, { useState } from 'react';
import { Vehicle, MaintenanceRecord, VehicleStatus } from '../types';

interface FleetViewProps {
  vehicles: Vehicle[];
  maintenanceRecords: MaintenanceRecord[];
  onViewReport: (vehicleId: string) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  onClose: () => void;
}

const FleetView: React.FC<FleetViewProps> = ({ vehicles, maintenanceRecords, onViewReport, onAddVehicle, onClose }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'maintenance' | 'fuel'>('registry');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
      name: '',
      id: '',
      status: VehicleStatus.IDLE,
      driver: '',
      fuelLevel: 100,
      loadPercentage: 0,
      efficiency: 0,
      location: { lat: 37.7749, lng: -122.4194 },
      // Extended Defaults
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
      if(formData.name && formData.id) {
          onAddVehicle(formData as Vehicle);
          setIsAdding(false);
          // Reset Form
          setFormData({ 
            name: '', id: '', status: VehicleStatus.IDLE, driver: '', fuelLevel: 100, efficiency: 0, loadPercentage: 0, 
            location: { lat: 37.7749, lng: -122.4194 }, licensePlate: '', type: 'Truck', make: '', model: '', year: '', 
            vin: '', color: '', loadCapacity: 0, fuelType: 'Diesel', tankCapacity: 0, insuranceExpiry: '', odometer: 0, nextServiceDue: '' 
          });
      }
  };

  const handleInputChange = (field: keyof Vehicle, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
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
        
        {/* ADD VEHICLE MODAL */}
        {isAdding && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 w-full max-w-4xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-xl font-bold text-gray-800">Add New Vehicle</h3>
                        <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                             <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wide border-b border-gray-100 pb-2">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vehicle Name</label>
                                    <input required type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. Truck Alpha" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fleet ID</label>
                                    <input required type="text" value={formData.id} onChange={e => handleInputChange('id', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. TRK-009" />
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
                                            <option>Diesel</option><option>Petrol</option><option>Electric</option><option>Hybrid</option>
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
                                <div className="mb-4">
                                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assigned Driver</label>
                                     <input required type="text" value={formData.driver} onChange={e => handleInputChange('driver', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="Driver Name" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                                    <select 
                                        value={formData.status} 
                                        onChange={e => handleInputChange('status', e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    >
                                        {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
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
            <div className="grid gap-4">
                {vehicles.map(vehicle => (
                    <div 
                        key={vehicle.id} 
                        onClick={() => onViewReport(vehicle.id)}
                        className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-100 text-emerald-600' : 
                                vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                            }`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2 truncate">
                                    {vehicle.name}
                                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </h3>
                                <p className="text-xs text-gray-500 truncate">{vehicle.id} • {vehicle.driver}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
                            <div>
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Status</span>
                                <span className={`font-semibold ${
                                    vehicle.status === VehicleStatus.IN_TRANSIT ? 'text-emerald-600' : 
                                    vehicle.status === VehicleStatus.MAINTENANCE ? 'text-red-600' : 'text-gray-600'
                                }`}>{vehicle.status.replace('_', ' ')}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Load</span>
                                <span className="font-semibold text-gray-700">{vehicle.loadPercentage}%</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Fuel</span>
                                <span className={`font-semibold ${vehicle.fuelLevel! < 20 ? 'text-red-500' : 'text-gray-700'}`}>{vehicle.fuelLevel}%</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-gray-400 uppercase font-bold">Service</span>
                                <span className="font-semibold text-gray-700">{vehicle.lastMaintenance || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
            <div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <h4 className="font-bold text-blue-900">Maintenance Schedule</h4>
                        <p className="text-sm text-blue-700">Requests flagged by drivers are highlighted below.</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full text-sm text-left text-gray-500 min-w-[600px]">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Vehicle ID</th>
                                <th className="px-6 py-3">Type/Issue</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Cost</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {maintenanceRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{record.vehicleId}</td>
                                    <td className="px-6 py-4">
                                        <div>{record.type}</div>
                                        {record.comment && (
                                            <div className="flex items-center gap-1 mt-1 text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                                <span className="text-xs font-semibold italic">"{record.comment}"</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{record.date}</td>
                                    <td className="px-6 py-4">${record.cost}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            record.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* FUEL TAB */}
        {activeTab === 'fuel' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl overflow-hidden min-h-[250px] flex flex-col justify-center">
                    {/* Background Image with opacity increased to 60% */}
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none mix-blend-overlay"
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
                                    <div className="text-xs text-gray-500">Target: 4.0 km/L</div>
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
