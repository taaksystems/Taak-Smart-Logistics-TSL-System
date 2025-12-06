import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userType: 'driver' | 'admin', name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<'driver' | 'admin'>('admin');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(userType, name.trim());
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex flex-col items-center justify-center font-sans p-4">
      <div className="text-center mb-8">
        <img src="assets/tmslogo.png" alt="SmartTMS Logo" className="h-10 w-auto object-contain mx-auto" />
        <p className="text-sm text-slate-500 font-bold tracking-widest uppercase mt-3">Logistics AI Platform</p>
      </div>

      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm font-bold text-slate-400 uppercase tracking-wider">
              Test Mode
            </span>
          </div>
        </div>
        
        <div className="mb-6 flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              userType === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setUserType('driver')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              userType === 'driver' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
              {userType === 'admin' ? "Admin's Name" : "Driver's Name"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={userType === 'admin' ? 'e.g. J. Smith' : 'e.g. John Doe'}
              required
              className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-50"
            disabled={!name.trim()}
          >
            Login
          </button>
        </form>
      </div>
      <p className="text-xs text-slate-400 font-semibold mt-8">© Taak Smart Logistics (TSL)</p>
    </div>
  );
};

export default Login;
