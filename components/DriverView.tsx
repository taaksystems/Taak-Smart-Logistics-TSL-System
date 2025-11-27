import React from 'react';
import { Driver } from '../types';

interface DriverViewProps {
  drivers: Driver[];
  onClose: () => void;
  onAddDriver: (driver: Driver) => void;
}

const DriverView: React.FC<DriverViewProps> = ({ drivers, onClose, onAddDriver }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
            <p className="text-sm text-gray-500">Monitor driver performance, availability, and trip history.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            // Placeholder for add driver logic or modal
            const newDriver: Driver = {
               id: `DRV-${Date.now()}`,
               name: 'New Driver',
               status: 'AVAILABLE',
               rating: 5.0,
               totalDistance: 0,
               phone: '',
               avatarUrl: 'https://ui-avatars.com/api/?name=New+Driver&background=random'
            };
            onAddDriver(newDriver);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           Add Driver
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drivers.map(driver => (
            <div key={driver.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-500">{driver.id}</p>
                    <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        driver.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                             driver.status === 'AVAILABLE' ? 'bg-green-500' :
                             driver.status === 'ON_TRIP' ? 'bg-blue-500' :
                             'bg-gray-500'
                        }`}></span>
                        {driver.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <span>{driver.rating}</span>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   </div>
                   <span className="text-xs text-gray-400 uppercase tracking-wider">Rating</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                    <div className="text-xs text-gray-400 uppercase">Total Distance</div>
                    <div className="font-semibold text-gray-800">{driver.totalDistance.toLocaleString()} km</div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase">Contact</div>
                    <div className="font-semibold text-gray-800">{driver.phone}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex gap-2">
                 <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverView;