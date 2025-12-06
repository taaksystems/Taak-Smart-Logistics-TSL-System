import React, { useState } from 'react';

interface ProfileViewProps {
  user: { name: string; type: 'admin' | 'driver' };
  onClose: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user: loggedInUser, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'settings'>('details');
  const [user, setUser] = useState({
    name: loggedInUser.name,
    role: 'Fleet Manager / Admin',
    email: `${loggedInUser.name.split(' ').join('.').toLowerCase()}@smarttms.com`,
    phone: '+1 (555) 123-4567',
    location: 'San Francisco HQ',
    bio: 'Overseeing fleet operations for the West Coast region since 2019.'
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>
            <p className="text-sm text-gray-500">Manage your account and preferences.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10B981&color=fff&size=128`} alt="Profile" className="w-24 h-24 rounded-full border-4 border-emerald-50 shadow-md" />
                 <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-sm text-emerald-600 font-semibold mb-4">{user.role}</p>
              <div className="w-full pt-4 border-t border-gray-100 flex justify-between text-sm">
                 <div className="text-center">
                    <div className="font-bold text-gray-800">42</div>
                    <div className="text-xs text-gray-400">Drivers</div>
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-gray-800">28</div>
                    <div className="text-xs text-gray-400">Vehicles</div>
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-gray-800">1.2k</div>
                    <div className="text-xs text-gray-400">Trips</div>
                 </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3">Contact Info</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {user.email}
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {user.phone}
                    </li>
                    <li className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {user.location}
                    </li>
                </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                   <button 
                     onClick={() => setActiveTab('details')}
                     className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   >
                     Profile Details
                   </button>
                   <button 
                     onClick={() => setActiveTab('settings')}
                     className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   >
                     Account Settings
                   </button>
                </div>

                <div className="p-6">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                             <div>
                                <h4 className="text-sm font-bold text-gray-800 uppercase mb-3">About Me</h4>
                                <textarea 
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-emerald-400 min-h-[100px]"
                                    value={user.bio}
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                />
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Display Name</label>
                                    <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-400" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role / Title</label>
                                    <input type="text" value={user.role} onChange={e => setUser({...user, role: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-400" />
                                </div>
                             </div>

                             <div className="flex justify-end">
                                <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors">
                                    Save Changes
                                </button>
                             </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
                                <strong>Note:</strong> Some settings are managed by your organization's IT department.
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <div>
                                        <div className="font-bold text-gray-800">Email Notifications</div>
                                        <div className="text-xs text-gray-500">Receive daily digests and critical alerts</div>
                                    </div>
                                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <div>
                                        <div className="font-bold text-gray-800">Two-Factor Authentication</div>
                                        <div className="text-xs text-gray-500">Add an extra layer of security</div>
                                    </div>
                                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4">
                                <button className="text-rose-600 font-bold text-sm hover:underline">Log Out</button>
                            </div>
                        </div>
                    )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
