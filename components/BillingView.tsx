
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
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Billing & Invoicing</h2>
                <p className="text-sm text-gray-500">Financial overview and invoice management.</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Overdue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${overdueAmount.toLocaleString()}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Paid Invoices</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{paidCount}</div>
            </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Invoices</h3>
                <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3 font-medium">Invoice ID</th>
                            <th className="px-6 py-3 font-medium">Client</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{invoice.id}</td>
                                <td className="px-6 py-4">{invoice.customerName}</td>
                                <td className="px-6 py-4">{invoice.issueDate}</td>
                                <td className="px-6 py-4 font-mono">${invoice.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                        invoice.status === 'UNPAID' ? 'bg-gray-100 text-gray-700' :
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600">
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
