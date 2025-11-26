import React, { useState } from 'react';

export default function MenuItemForm({ initialData = {}, onSave, onCancel }) {
  // Initialize state with passed data (for editing) or empty strings (for adding)
  const [formData, setFormData] = useState({
    id: initialData.id || null,
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || 'Mains'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.price) {
      alert("Name and Price are required!");
      return;
    }

    // Pass the data back to the parent component
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Dish Name
        </label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          placeholder="e.g. Spicy Tacos"
          required
        />
      </div>

      {/* Price and Category Row */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Price ($)
          </label>
          <input 
            type="number" 
            step="0.01"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
            placeholder="0.00"
            required
          />
        </div>

        <div className="w-1/2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Category
          </label>
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all bg-white"
          >
            <option value="Mains">Mains</option>
            <option value="Starters">Starters</option>
            <option value="Desserts">Desserts</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Description
        </label>
        <textarea 
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          rows="3"
          placeholder="Describe the ingredients and flavor..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button 
          type="submit" 
          className="flex-1 bg-green-600 text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all shadow-sm"
        >
          Save Item
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 bg-slate-100 text-slate-600 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}