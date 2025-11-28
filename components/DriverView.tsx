

import React, { useState } from 'react';
import { Driver, EmergencyContact } from '../types';

interface DriverViewProps {
  drivers: Driver[];
  onClose: () => void;
  onAddDriver: (driver: Driver) => void;
  onViewReport: (driverId: string) => void;
}

const DriverView: React.FC<DriverViewProps> = ({ drivers, onClose, onAddDriver, onViewReport }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [createdDriverId, setCreatedDriverId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Driver> & { 
    primaryContactName: string; primaryContactRel: string; primaryContactPhone: string;
    secondaryContactName: string; secondaryContactRel: string; secondaryContactPhone: string;
    certsInput: string;
  }>({
    name: '', email: '', phone: '', dob: '', address: '',
    licenseNumber: '', licenseExpiry: '', nationalId: '',
    experienceYears: 0, certsInput: '',
    primaryContactName: '', primaryContactRel: '', primaryContactPhone: '',
    secondaryContactName: '', secondaryContactRel: '', secondaryContactPhone: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `DRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Parse certifications
    const certs = formData.certsInput.split(',').map(s => s.trim()).filter(s => s !== '');

    // Construct Driver Object
    const newDriver: Driver = {
      id,
      name: formData.name || '',
      email: formData.email,
      phone: formData.phone || '',
      status: 'PENDING', // Default to PENDING as user requested
      rating: 0, // Initial rating
      totalDistance: 0,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Driver')}&background=10B981&color=fff`,
      
      // Personal & Docs
      dob: formData.dob,
      address: formData.address,
      licenseNumber: formData.licenseNumber,
      licenseExpiry: formData.licenseExpiry,
      nationalId: formData.nationalId,

      // Qualifications
      experienceYears: formData.experienceYears,
      certifications: certs,

      // Emergency Contacts
      emergencyContacts: ([
        {
          type: 'PRIMARY',
          name: formData.primaryContactName,
          relationship: formData.primaryContactRel,
          phone: formData.primaryContactPhone
        },
        {
          type: 'SECONDARY',
          name: formData.secondaryContactName,
          relationship: formData.secondaryContactRel,
          phone: formData.secondaryContactPhone
        }
      ] as EmergencyContact[]).filter(c => c.name !== '') // Remove empty secondaries if unused
    };

    onAddDriver(newDriver);
    setIsAdding(false);
    setCreatedDriverId(id);
    
    // Reset Form
    setFormData({
      name: '', email: '', phone: '', dob: '', address: '',
      licenseNumber: '', licenseExpiry: '', nationalId: '',
      experienceYears: 0, certsInput: '',
      primaryContactName: '', primaryContactRel: '', primaryContactPhone: '',
      secondaryContactName: '', secondaryContactRel: '', secondaryContactPhone: '',
    });
  };

  const copyToClipboard = () => {
    if (createdDriverId) {
      navigator.clipboard.writeText(createdDriverId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
            <p className="text-sm text-gray-500">Monitor performance, manage profiles, and onboarding.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Driver
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {drivers.map(driver => (
              <div 
                key={driver.id} 
                onClick={() => onViewReport(driver.id)}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-emerald-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md group-hover:scale-105 transition-transform" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{driver.name}</h3>
                      <p className="text-xs text-emerald-600 font-bold mt-1">{driver.id}</p>
                      <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          driver.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          driver.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-700' :
                          driver.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                          {driver.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg">
                        <span>{driver.rating}</span>
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-2">
                  <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Contact</div>
                      <div className="text-sm font-semibold text-gray-800 truncate">{driver.email || driver.phone}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">License</div>
                      <div className="text-sm font-semibold text-gray-800">{driver.licenseNumber || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* ADD DRIVER MODAL */}
      {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 w-full max-w-4xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 sticky top-0 bg-white z-10 shrink-0">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">New Driver Profile</h3>
                        <p className="text-xs text-gray-500 mt-1">Fill in the required details to generate a driver ID.</p>
                      </div>
                      <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  
                  <form onSubmit={handleCreate} className="space-y-8 pb-4">
                      {/* Section 1: Personal Info */}
                      <div>
                          <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">1. Personal Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. Michael Knight" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="e.g. driver@taak.com" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="+1 555 000 0000" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Birth</label>
                                  <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Residential Address</label>
                                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" placeholder="123 Street Name, City, State" />
                              </div>
                          </div>
                      </div>

                      {/* Section 2: Documents */}
                      <div>
                          <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">2. ID & License Documents</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Driver's License No.</label>
                                  <input required type="text" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" placeholder="DL-XXXX-XXXX" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Expiry</label>
                                  <input type="date" value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">National ID / SSN</label>
                                  <input type="text" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" placeholder="ID Number" />
                              </div>
                          </div>
                      </div>

                      {/* Section 3: Qualifications */}
                      <div>
                          <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">3. Certifications & Qualifications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Certifications (comma separated)</label>
                                  <input type="text" value={formData.certsInput} onChange={e => setFormData({...formData, certsInput: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" placeholder="e.g. Hazmat, Forklift, Defensive Driving" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Years of Experience</label>
                                  <input type="number" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
                              </div>
                          </div>
                      </div>

                      {/* Section 4: Emergency Contacts */}
                      <div>
                          <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">4. Emergency Contacts</h4>
                          <div className="space-y-4">
                              {/* Primary */}
                              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                                  <span className="text-xs font-bold text-rose-500 uppercase block mb-3">Primary Contact</span>
                                  <div className="grid grid-cols-3 gap-3">
                                      <input type="text" required value={formData.primaryContactName} onChange={e => setFormData({...formData, primaryContactName: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Name" />
                                      <input type="text" required value={formData.primaryContactRel} onChange={e => setFormData({...formData, primaryContactRel: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Relationship" />
                                      <input type="tel" required value={formData.primaryContactPhone} onChange={e => setFormData({...formData, primaryContactPhone: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Phone" />
                                  </div>
                              </div>
                              {/* Secondary */}
                              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                  <span className="text-xs font-bold text-gray-400 uppercase block mb-3">Secondary Contact (Optional)</span>
                                  <div className="grid grid-cols-3 gap-3">
                                      <input type="text" value={formData.secondaryContactName} onChange={e => setFormData({...formData, secondaryContactName: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Name" />
                                      <input type="text" value={formData.secondaryContactRel} onChange={e => setFormData({...formData, secondaryContactRel: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Relationship" />
                                      <input type="tel" value={formData.secondaryContactPhone} onChange={e => setFormData({...formData, secondaryContactPhone: e.target.value})} className="w-full p-2 bg-white rounded-lg border border-gray-200 text-sm" placeholder="Phone" />
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                          <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                              Cancel
                          </button>
                          <button type="submit" className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                              Create Driver Profile
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* SUCCESS ID MODAL */}
      {createdDriverId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center border border-white/20 animate-scale-in">
               <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Driver Profile Created</h3>
               <p className="text-gray-500 text-sm mb-6">
                 Share this ID Code with the driver. They will use it to claim their account.
               </p>
               
               <div className="bg-gray-100 rounded-xl p-4 mb-6 border border-gray-200 flex items-center justify-between">
                   <span className="font-mono text-lg font-bold text-gray-800 tracking-wider select-all">{createdDriverId}</span>
                   <button 
                      onClick={copyToClipboard} 
                      className={`font-bold text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${isCopied ? 'bg-emerald-600 text-white' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                   >
                        {isCopied ? (
                            <>
                                <span>Copied!</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </>
                        ) : (
                            <>
                                <span>Copy</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            </>
                        )}
                   </button>
               </div>

               <button 
                  onClick={() => setCreatedDriverId(null)}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
               >
                   Done
               </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DriverView;
