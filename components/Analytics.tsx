

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
            <div className="bg-white h-full flex flex-col font-sans">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      </button>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                              Driver Report
                          </h2>
                          <p className="text-sm text-slate-500 font-medium">{driver.name}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block border ${
                          driver.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-100' :
                          driver.status === 'ON_TRIP' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          driver.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                          {driver.status.replace('_', ' ')}
                      </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Driver Rating</div>
                            <div className="text-4xl font-black text-amber-500 flex items-center gap-2">
                                {driver.rating} <span className="text-lg text-slate-300">★</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Total Distance</div>
                            <div className="text-4xl font-black text-indigo-600">{driver.totalDistance.toLocaleString()} <span className="text-sm text-slate-400 font-normal">km</span></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Experience</div>
                            <div className="text-4xl font-black text-emerald-600">{driver.experienceYears || 0} <span className="text-sm text-slate-400 font-normal">Years</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 text-lg">Contact Information</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-slate-500 font-medium">Phone</span>
                                    <span className="font-bold text-slate-800">{driver.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="font-bold text-slate-800">{driver.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-slate-500 font-medium">License</span>
                                    <span className="font-bold text-slate-800">{driver.licenseNumber}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-3">
                                    <span className="text-slate-500 font-medium">License Expiry</span>
                                    <span className="font-bold text-slate-800">{driver.licenseExpiry || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                             <h3 className="font-bold text-slate-800 mb-6 text-lg">Certifications</h3>
                             <div className="flex flex-wrap gap-2">
                                 {driver.certifications && driver.certifications.length > 0 ? (
                                     driver.certifications.map((cert, idx) => (
                                         <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 uppercase tracking-wide">
                                             {cert}
                                         </span>
                                     ))
                                 ) : (
                                     <span className="text-slate-400 text-sm italic">No certifications listed.</span>
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
          <div className="bg-white h-full flex flex-col font-sans">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Vehicle Report
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">{selectedVehicle.name} ({selectedVehicle.id})</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Efficiency</div>
                    <div className="text-2xl font-black text-slate-900">{selectedVehicle.efficiency} <span className="text-sm text-slate-400 font-normal">km/L</span></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Monthly Distance</div>
                          <div className="text-4xl font-black text-indigo-600">2,450 <span className="text-sm text-slate-400 font-normal">km</span></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Fuel Consumed</div>
                          <div className="text-4xl font-black text-emerald-600">645 <span className="text-sm text-slate-400 font-normal">L</span></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">Current Load</div>
                          <div className="text-4xl font-black text-amber-500">{selectedVehicle.loadPercentage}%</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-6 text-lg">Weekly Fuel Usage</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={fuelUsageHistory}>
                                      <defs>
                                          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                      <Area type="monotone" dataKey="usage" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="font-bold text-slate-800 mb-6 text-lg">Maintenance History</h3>
                          {vehicleMaintenance.length > 0 ? (
                              <div className="space-y-4">
                                  {vehicleMaintenance.map(rec => (
                                      <div key={rec.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                          <div>
                                              <div className="font-bold text-slate-800 text-sm">{rec.type}</div>
                                              <div className="text-xs text-slate-500 mt-0.5">{rec.date}</div>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-slate-800 text-sm">${rec.cost}</div>
                                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block ${rec.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rec.status}</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="text-center text-slate-400 py-10 italic">No maintenance records found.</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col font-sans">
      <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-start sticky top-0 z-20">
        <div>
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
            </div>
            <div className="flex gap-2 mt-4 ml-12">
                {['operational', 'financial', 'performance'].map(type => (
                    <button
                        key={type}
                        onClick={() => setReportType(type as any)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            reportType === type ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
        
        {reportType === 'operational' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Fleet Status Distribution</h3>
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
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <div className="text-indigo-600 text-xs font-bold uppercase tracking-wide mb-2">Average Load Efficiency</div>
                        <div className="text-4xl font-black text-indigo-900 mb-4">{Math.round(totalLoad)}%</div>
                        <div className="w-full bg-indigo-200/50 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${totalLoad}%` }}
                        ></div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {reportType === 'financial' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Monthly Revenue</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <div className="text-xs text-emerald-600 uppercase font-bold tracking-wide">Total Profit</div>
                        <div className="text-2xl font-black text-emerald-900 mt-2">$124,500</div>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                        <div className="text-xs text-rose-600 uppercase font-bold tracking-wide">Operational Costs</div>
                        <div className="text-2xl font-black text-rose-900 mt-2">$42,300</div>
                    </div>
                </div>
            </div>
        )}

        {reportType === 'performance' && (
            <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-orange-900 text-lg">Safety Score</h4>
                        <p className="text-xs text-orange-700/80 font-medium mt-1">Top 5% of fleets in region.</p>
                    </div>
                    <div className="text-5xl font-black text-orange-600">94<span className="text-lg text-orange-400 font-bold">/100</span></div>
                </div>
                
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 text-lg">Top Performing Drivers</h4>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-600 font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                                John Doe
                            </span>
                            <span className="font-bold text-emerald-600 bg-white px-2 py-1 rounded-md shadow-sm">4.9 ★</span>
                        </li>
                        <li className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-600 font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
                                Sarah Connor
                            </span>
                            <span className="font-bold text-emerald-600 bg-white px-2 py-1 rounded-md shadow-sm">5.0 ★</span>
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
