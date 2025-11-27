
import React, { useState } from 'react';
import { Shipment, Vehicle, Driver } from '../types';

interface ShipmentViewProps {
  shipments: Shipment[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onCreateShipment: (shipment: Shipment) => void;
  onClose: () => void;
}

const ShipmentView: React.FC<ShipmentViewProps> = ({ shipments, vehicles, drivers, onCreateShipment, onClose }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    weight: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newShipment: Shipment = {
        id: `SHP-${Math.floor(Math.random() * 10000)}`,
        trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
        origin: formData.origin,
        destination: formData.destination,
        status: 'PENDING',
        cargoType: formData.cargoType,
        weight: formData.weight,
        eta: 'Pending Calculation'
    };
    onCreateShipment(newShipment);
    setIsCreating(false);
    setFormData({ origin: '', destination: '', cargoType: '', weight: '' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Shipment Management</h2>
                <p className="text-sm text-gray-500">Track loads, create orders, and manage deliveries.</p>
            </div>
        </div>
        <button 
            onClick={() => setIsCreating(!isCreating)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 ${isCreating ? 'bg-gray-100 text-gray-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
        >
            {isCreating ? 'Cancel' : '+ Create Shipment'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        
        {/* CREATE FORM */}
        {isCreating && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100 mb-8 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-800 mb-4">New Shipment Request</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin</label>
                        <input required type="text" value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-all" placeholder="e.g., Warehouse A" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Destination</label>
                        <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-all" placeholder="e.g., Retail Store 5" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cargo Type</label>
                        <input required type="text" value={formData.cargoType} onChange={e => setFormData({...formData, cargoType: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-all" placeholder="e.g., Electronics" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Weight</label>
                        <input required type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none transition-all" placeholder="e.g., 500 kg" />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-2">
                        <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors">
                            Confirm & Create
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* SHIPMENT LIST */}
        <div className="space-y-4">
            {shipments.map(shipment => (
                <div key={shipment.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{shipment.trackingId}</h4>
                                <p className="text-xs text-gray-500">{shipment.cargoType} • {shipment.weight}</p>
                            </div>
                        </div>
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                shipment.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-700' :
                                shipment.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {shipment.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-4 py-4">
                         {/* Connecting Line */}
                         <div className="absolute left-2.5 top-5 bottom-5 w-0.5 bg-gray-100 -z-10"></div>
                         
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-500 bg-white shrink-0 mt-0.5"></div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase">Origin</div>
                                    <div className="font-medium text-gray-800">{shipment.origin}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-100 shrink-0 mt-0.5"></div>
                                <div>
                                    <div className="text-xs text-gray-400 uppercase">Destination</div>
                                    <div className="font-medium text-gray-800">{shipment.destination}</div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                        <div>Assigned: <span className="font-semibold text-gray-700">{shipment.vehicleId || 'Unassigned'}</span></div>
                        <div>ETA: <span className="font-semibold text-gray-700">{shipment.eta}</span></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentView;
