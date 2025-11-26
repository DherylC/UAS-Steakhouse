import React from 'react';
import { Utensils } from 'lucide-react';

export default function AuthLayout({ children, title }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
          <div className="text-white text-center">
            <Utensils size={40} className="mx-auto mb-2 opacity-90" />
            <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}