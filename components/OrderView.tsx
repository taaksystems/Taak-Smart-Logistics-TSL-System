
import React, { useState } from 'react';
import { Order } from '../types';

interface OrderViewProps {
  orders: Order[];
  onClose: () => void;
}

const OrderView: React.FC<OrderViewProps> = ({ orders, onClose }) => {
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                <p className="text-sm text-gray-500">Manage customer bookings and requests.</p>
            </div>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Booking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
         {['ALL', 'NEW', 'SCHEDULED', 'COMPLETED'].map(status => (
             <button 
                key={status}
                onClick={() => setFilter(status as any)}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                    filter === status 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
             >
                 {status}
             </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
        <div className="grid gap-4">
            {filteredOrders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{order.customerName}</h3>
                                <p className="text-xs text-gray-500">Req: {order.requestDate}</p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.status === 'NEW' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="block text-xs text-gray-400 uppercase">Service</span>
                            <span className="font-semibold text-gray-800">{order.serviceType}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="block text-xs text-gray-400 uppercase">Route</span>
                            <span className="font-semibold text-gray-800 truncate">{order.origin} → {order.destination}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="block text-xs text-gray-400 uppercase">Est. Price</span>
                            <span className="font-semibold text-gray-800">${order.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1">Details</button>
                        {order.status === 'NEW' && (
                            <button className="text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-1.5 rounded-lg transition-colors">
                                Schedule Pickup
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderView;
