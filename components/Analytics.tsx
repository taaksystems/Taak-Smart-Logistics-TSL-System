

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { Vehicle, VehicleStatus, MaintenanceRecord, Driver } from '../types';

interface AnalyticsProps {
  vehicles: Vehicle[];
  drivers?: Driver[];
  maintenanceRecords?: MaintenanceRecord[];
  selectedVehicleId?: string | null;
  selectedDriverId?: string | null;
  onClose: () => void;
}

const COLORS = ['#4F46E5', '#22C55E', '#EF4444', '#F59E0B'];

const Analytics: React.FC<AnalyticsProps> = ({ vehicles, drivers = [], maintenanceRecords = [], selectedVehicleId, selectedDriverId, onClose }) => {
  const [reportType, setReportType] = useState<'operational' | 'financial' | 'performance'>('operational');

  // Handle Driver Report View
  if (selectedDriverId) {
      const driver = drivers.find(d => d.id === selectedDriverId);
      if (driver) {
        return (
            <div className="bg-white h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                      <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </button>
                      <div>
                          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                              Driver Report: <span className="text-emerald-600">{driver.name}</span>
                          </h2>
                          <p className="text-sm text-gray-500">ID: {driver.id}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block ${
                          driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          driver.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-700' :
                          driver.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                          {driver.status.replace('_', ' ')}
                      </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Driver Rating</div>
                            <div className="text-3xl font-black text-amber-500 flex items-center gap-2">
                                {driver.rating} <span className="text-lg text-gray-300">★</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Total Distance</div>
                            <div className="text-3xl font-black text-indigo-600">{driver.totalDistance.toLocaleString()} <span className="text-sm text-gray-400 font-normal">km</span></div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-gray-400 uppercase mb-2">Experience</div>
                            <div className="text-3xl font-black text-emerald-600">{driver.experienceYears || 0} <span className="text-sm text-gray-400 font-normal">Years</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-medium">{driver.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium">{driver.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">License</span>
                                    <span className="font-medium">{driver.licenseNumber}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">License Expiry</span>
                                    <span className="font-medium">{driver.licenseExpiry || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                             <h3 className="font-bold text-gray-800 mb-4">Certifications</h3>
                             <div className="flex flex-wrap gap-2">
                                 {driver.certifications && driver.certifications.length > 0 ? (
                                     driver.certifications.map((cert, idx) => (
                                         <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                                             {cert}
                                         </span>
                                     ))
                                 ) : (
                                     <span className="text-gray-400 text-sm">No certifications listed.</span>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      }
  }

  // Existing Vehicle Report Logic
  const selectedVehicle = selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId) : null;
  const vehicleMaintenance = selectedVehicle ? maintenanceRecords.filter(m => m.vehicleId === selectedVehicleId) : [];

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const fleetStatusData = [
    { name: 'Idle', value: vehicles.filter(v => v.status === VehicleStatus.IDLE).length },
    { name: 'In Transit', value: vehicles.filter(v => v.status === VehicleStatus.IN_TRANSIT).length },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length },
    { name: 'Delivered', value: vehicles.filter(v => v.status === VehicleStatus.DELIVERED).length },
  ].filter(d => d.value > 0);

  const totalLoad = vehicles.reduce((acc, curr) => acc + curr.loadPercentage, 0) / (vehicles.length || 1);

  // Vehicle specific mock data
  const fuelUsageHistory = [
     { day: 'Mon', usage: 12 },
     { day: 'Tue', usage: 15 },
     { day: 'Wed', usage: 8 },
     { day: 'Thu', usage: 18 },
     { day: 'Fri', usage: 14 },
     { day: 'Sat', usage: 5 },
     { day: 'Sun', usage: 2 },
  ];

  if (selectedVehicle) {
      return (
          <div className="bg-white h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-emerald-600">{selectedVehicle.name}</span> Report
                        </h2>
                        <p className="text-sm text-gray-500">Detailed analytics for Vehicle ID: {selectedVehicle.id}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase">Current Efficiency</div>
                    <div className="text-2xl font-black text-gray-900">{selectedVehicle.efficiency} <span className="text-sm text-gray-400 font-normal">km/L</span></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-gray-400 uppercase mb-2">Distance Travelled (Month)</div>
                          <div className="text-3xl font-black text-indigo-600">2,450 <span className="text-sm text-gray-400 font-normal">km</span></div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-gray-400 uppercase mb-2">Fuel Consumed</div>
                          <div className="text-3xl font-black text-emerald-600">645 <span className="text-sm text-gray-400 font-normal">L</span></div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-gray-400 uppercase mb-2">Current Load</div>
                          <div className="text-3xl font-black text-amber-500">{selectedVehicle.loadPercentage}%</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-gray-800 mb-4">Weekly Fuel Usage</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={fuelUsageHistory}>
                                      <defs>
                                          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                      <YAxis axisLine={false} tickLine={false} />
                                      <Tooltip />
                                      <Area type="monotone" dataKey="usage" stroke="#10B981" fillOpacity={1} fill="url(#colorUsage)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-gray-800 mb-4">Maintenance History</h3>
                          {vehicleMaintenance.length > 0 ? (
                              <div className="space-y-4">
                                  {vehicleMaintenance.map(rec => (
                                      <div key={rec.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                          <div>
                                              <div className="font-bold text-gray-800 text-sm">{rec.type}</div>
                                              <div className="text-xs text-gray-500">{rec.date}</div>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-gray-800 text-sm">${rec.cost}</div>
                                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${rec.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rec.status}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="text-center text-gray-400 py-10">No maintenance records found.</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-start">
        <div>
            <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800">Reports & Analytics</h2>
            </div>
            <div className="flex gap-2 mt-3 ml-11">
                {['operational', 'financial', 'performance'].map(type => (
                    <button
                        key={type}
                        onClick={() => setReportType(type as any)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                            reportType === type ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto bg-gray-50/30">
        
        {reportType === 'operational' && (
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Fleet Status Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={fleetStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            >
                            {fleetStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="text-indigo-600 text-sm font-medium mb-1">Average Load</div>
                        <div className="text-2xl font-bold text-indigo-900">{Math.round(totalLoad)}%</div>
                        <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                        <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${totalLoad}%` }}
                        ></div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {reportType === 'financial' && (
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Monthly Revenue</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-xs text-green-600 uppercase font-bold">Total Profit</div>
                        <div className="text-xl font-black text-green-900 mt-1">$124,500</div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <div className="text-xs text-rose-600 uppercase font-bold">Costs</div>
                        <div className="text-xl font-black text-rose-900 mt-1">$42,300</div>
                    </div>
                </div>
            </div>
        )}

        {reportType === 'performance' && (
            <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-orange-900">Safety Score</h4>
                    <div className="text-3xl font-black text-orange-600 my-2">94<span className="text-base text-orange-400">/100</span></div>
                    <p className="text-xs text-orange-700">Top 5% of fleets in region.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3">Top Drivers</h4>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">John Doe</span>
                            <span className="font-bold text-emerald-600">4.9 ★</span>
                        </li>
                        <li className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Sarah Connor</span>
                            <span className="font-bold text-emerald-600">5.0 ★</span>
                        </li>
                    </ul>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;
