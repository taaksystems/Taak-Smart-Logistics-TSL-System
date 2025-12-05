

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
    <div className="h-full flex flex-col font-sans relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Management</h2>
            <p className="text-sm text-slate-500 font-medium">Monitor performance, manage profiles, and onboarding.</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Driver
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {drivers.map(driver => (
              <div 
                key={driver.id} 
                onClick={() => onViewReport(driver.id)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer hover:border-emerald-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">{driver.name}</h3>
                      <p className="text-xs text-emerald-600 font-bold mt-1 tracking-wide">{driver.id}</p>
                      <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                          driver.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-100' :
                          driver.status === 'ON_TRIP' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          driver.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                          {driver.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100/50">
                        <span className="text-sm">{driver.rating}</span>
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-50 mt-2">
                  <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Contact</div>
                      <div className="text-sm font-semibold text-slate-800 truncate" title={driver.email || driver.phone}>{driver.email || driver.phone}</div>
                  </div>
                  <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">License</div>
                      <div className="text-sm font-semibold text-slate-800">{driver.licenseNumber || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* ADD DRIVER MODAL */}
      {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-white rounded-[2rem] p-8 w-full max-w-4xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto border border-white/50 flex flex-col">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6 sticky top-0 bg-white z-10 shrink-0">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">New Driver Profile</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">Fill in the required details to generate a driver ID.</p>
                      </div>
                      <button onClick={() => setIsAdding(false)} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  
                  <form onSubmit={handleCreate} className="space-y-8 pb-4">
                      {/* Section 1: Personal Info */}
                      <div>
                          <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-100 pb-2 mb-5">1. Personal Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="md:col-span-2">
                                  <InputField label="Full Name" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Michael Knight" />
                              </div>
                              <div>
                                  <InputField label="Email Address" type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} required placeholder="e.g. driver@taak.com" />
                              </div>
                              <div>
                                  <InputField label="Phone Number" type="tel" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required placeholder="+1 555 000 0000" />
                              </div>
                              <div>
                                  <InputField label="Date of Birth" type="date" value={formData.dob} onChange={(e: any) => setFormData({...formData, dob: e.target.value})} />
                              </div>
                              <div className="md:col-span-2">
                                  <InputField label="Residential Address" value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} placeholder="123 Street Name, City, State" />
                              </div>
                          </div>
                      </div>

                      {/* Section 2: Documents */}
                      <div>
                          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-5">2. ID & License Documents</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                  <InputField label="Driver's License No." value={formData.licenseNumber} onChange={(e: any) => setFormData({...formData, licenseNumber: e.target.value})} required placeholder="DL-XXXX-XXXX" />
                              </div>
                              <div>
                                  <InputField label="License Expiry" type="date" value={formData.licenseExpiry} onChange={(e: any) => setFormData({...formData, licenseExpiry: e.target.value})} />
                              </div>
                              <div>
                                  <InputField label="National ID / SSN" value={formData.nationalId} onChange={(e: any) => setFormData({...formData, nationalId: e.target.value})} placeholder="ID Number" />
                              </div>
                          </div>
                      </div>

                      {/* Section 3: Qualifications */}
                      <div>
                          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-2 mb-5">3. Certifications & Qualifications</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="md:col-span-2">
                                  <InputField label="Certifications (comma separated)" value={formData.certsInput} onChange={(e: any) => setFormData({...formData, certsInput: e.target.value})} placeholder="e.g. Hazmat, Forklift, Defensive Driving" />
                              </div>
                              <div>
                                  <InputField label="Years of Experience" type="number" value={formData.experienceYears} onChange={(e: any) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} />
                              </div>
                          </div>
                      </div>

                      {/* Section 4: Emergency Contacts */}
                      <div>
                          <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest border-b border-rose-100 pb-2 mb-5">4. Emergency Contacts</h4>
                          <div className="space-y-4">
                              {/* Primary */}
                              <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                                  <span className="text-xs font-bold text-rose-500 uppercase block mb-3 tracking-wide">Primary Contact</span>
                                  <div className="grid grid-cols-3 gap-3">
                                      <input type="text" required value={formData.primaryContactName} onChange={e => setFormData({...formData, primaryContactName: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-rose-400" placeholder="Name" />
                                      <input type="text" required value={formData.primaryContactRel} onChange={e => setFormData({...formData, primaryContactRel: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-rose-400" placeholder="Relationship" />
                                      <input type="tel" required value={formData.primaryContactPhone} onChange={e => setFormData({...formData, primaryContactPhone: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-rose-400" placeholder="Phone" />
                                  </div>
                              </div>
                              {/* Secondary */}
                              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                  <span className="text-xs font-bold text-slate-400 uppercase block mb-3 tracking-wide">Secondary Contact (Optional)</span>
                                  <div className="grid grid-cols-3 gap-3">
                                      <input type="text" value={formData.secondaryContactName} onChange={e => setFormData({...formData, secondaryContactName: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400" placeholder="Name" />
                                      <input type="text" value={formData.secondaryContactRel} onChange={e => setFormData({...formData, secondaryContactRel: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400" placeholder="Relationship" />
                                      <input type="tel" value={formData.secondaryContactPhone} onChange={e => setFormData({...formData, secondaryContactPhone: e.target.value})} className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-400" placeholder="Phone" />
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-6">
                           <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]">
                               Create Driver Profile
                           </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default DriverView;
