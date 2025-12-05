
import React from 'react';
import { Invoice } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  onClose: () => void;
}

const BillingView: React.FC<BillingViewProps> = ({ invoices, onClose }) => {
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'OVERDUE').reduce((acc, inv) => acc + inv.amount, 0);
  const paidCount = invoices.filter(i => i.status === 'PAID').length;

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoicing</h2>
                <p className="text-sm text-slate-500 font-medium">Financial overview and invoice management.</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overdue</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">${overdueAmount.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Invoices</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{paidCount}</div>
            </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-slate-800 text-lg">Recent Invoices</h3>
                <button className="text-sm text-emerald-600 font-bold hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-xs tracking-wider font-bold">
                        <tr>
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-700">{invoice.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{invoice.customerName}</td>
                                <td className="px-6 py-4 text-slate-500">{invoice.issueDate}</td>
                                <td className="px-6 py-4 font-mono font-medium text-slate-800">${invoice.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                                        invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        invoice.status === 'UNPAID' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                        'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-300 hover:text-emerald-600 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BillingView;
