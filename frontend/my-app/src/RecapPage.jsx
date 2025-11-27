import React from 'react';
import { api } from './api';
import { ChefHat, Printer, ArrowLeft } from 'lucide-react';

export default function RecapPage({ order, onNewOrder }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-slate-200 relative print:shadow-none print:border-none print:w-full">
        
        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-6">
          <div className="flex justify-center mb-2 text-orange-600">
            <ChefHat size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">TastyBytes</h2>
          <p className="text-slate-500 text-sm">Receipt #{order.id}</p>
          <p className="text-slate-400 text-xs mt-1">{order.date}</p>
          <p className="text-slate-400 text-xs">Server: {order.user}</p>
        </div>

        {/* Items List */}
        <div className="space-y-3 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-slate-700 font-medium">{item.name}</span>
              <span className="text-slate-900">Rp{Number(item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t-2 border-dashed border-slate-200 pt-4 mb-8">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>Rp{Number(order.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="flex flex-col gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors"
          >
            <Printer size={18} /> Print Receipt
          </button>
          <button 
            onClick={onNewOrder}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft size={18} /> New Order
          </button>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block text-center text-xs text-slate-400 mt-8">
          <p>Thank you for dining with us!</p>
          <p>www.tastybytes.com</p>
        </div>
      </div>
    </div>
  );
}