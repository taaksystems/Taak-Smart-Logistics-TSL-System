import React from 'react';
import { Vehicle, VehicleStatus } from '../types';

interface SidebarProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ vehicles, selectedVehicleId, onSelectVehicle }) => {
  
  const getStatusColor = (status: VehicleStatus) => {
    switch(status) {
      case VehicleStatus.IN_TRANSIT: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case VehicleStatus.MAINTENANCE: return 'text-rose-600 bg-rose-50 border-rose-100';
      case VehicleStatus.IDLE: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {vehicles.map(vehicle => (
        <div 
          key={vehicle.id}
          onClick={() => onSelectVehicle(vehicle.id)}
          className={`group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 relative overflow-hidden active:scale-98 ${
            selectedVehicleId === vehicle.id 
              ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-1 ring-emerald-500' 
              : 'border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-200'
          }`}
        >
          {/* Status Stripe */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
             vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-emerald-500' :
             vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-rose-500' :
             'bg-indigo-500'
          }`}></div>

          <div className="flex-1 min-w-0 pl-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-900 truncate text-base group-hover:text-emerald-700 transition-colors">{vehicle.name}</h3>
              <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide border ${getStatusColor(vehicle.status)}`}>
                {vehicle.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md max-w-[45%]">
                 <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 <span className="truncate">{vehicle.driver}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md flex-1">
                 <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 <span className="truncate">{vehicle.destination || 'Depot'}</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 pl-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${selectedVehicleId === vehicle.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:text-emerald-500 group-hover:border-emerald-200'}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;