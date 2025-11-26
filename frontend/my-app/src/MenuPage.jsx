import React, { useState, useEffect } from 'react';
import { ChefHat, LogOut, Plus, Trash2, ShoppingCart, Lock, X } from 'lucide-react';
import MenuItemForm from './components/MenuItemForm.jsx';
import { api } from './api.js';


export default function MenuPage({ user, onLogout, showNotification }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    api.getMenu().then(items => {
      setMenuItems(items);
      setLoading(false);
    });
  }, []);

  const handleAddItem = async (itemData) => {
    try {
      const newItem = await api.addMenuItem(itemData);
      setMenuItems([...menuItems, newItem]);
      setIsAdding(false);
      showNotification("Menu updated", "success");
    } catch (err) {
      showNotification("Failed to add item", "error");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
      await api.deleteMenuItem(id);
      setMenuItems(menuItems.filter(i => i.id !== id));
      showNotification("Item removed", "info");
    } catch (err) {
      showNotification("Error deleting item", "error");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-600">
            <ChefHat size={28} />
            <span className="font-bold text-xl text-slate-800">TastyBytes</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600">{user.username} ({user.role})</span>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Menu</h2>
            {isAdmin && !isAdding && (
              <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                <Plus size={18}/> Add Item
              </button>
            )}
          </div>

          {isAdding && (
            <div className="bg-white p-6 rounded-xl shadow border-2 border-orange-100">
              <h3 className="font-bold mb-4 text-orange-600">New Item</h3>
              <MenuItemForm onSave={handleAddItem} onCancel={() => setIsAdding(false)} />
            </div>
          )}

          {loading ? <div>Loading...</div> : (
            <div className="grid md:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <span className="font-bold text-orange-600">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 flex-grow">{item.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">{item.category}</span>
                    {isAdmin ? (
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                    ) : (
                      <button onClick={() => { setCart([...cart, item]); showNotification(`Added ${item.name}`, 'success'); }} className="text-slate-800 hover:bg-slate-100 p-2 rounded flex gap-2 text-sm font-bold">
                        <Plus size={16}/> Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex gap-2">
              {isAdmin ? <Lock className="text-orange-600"/> : <ShoppingCart className="text-orange-600"/>}
              {isAdmin ? 'Admin Panel' : 'Your Order'}
            </h3>
            {isAdmin ? (
               <p className="text-sm text-slate-500">You are in manager mode. You can add or remove items.</p>
            ) : (
              <div>
                {cart.length === 0 ? <p className="text-slate-400 text-sm">Cart is empty.</p> : (
                  <div className="space-y-2 mb-4">
                    {cart.map((c, i) => (
                      <div key={i} className="flex justify-between text-sm border-b pb-2">
                        <span>{c.name}</span>
                        <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500"><X size={14}/></button>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${cart.reduce((a, b) => a + Number(b.price), 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <button disabled={cart.length===0} onClick={() => { setCart([]); showNotification("Order Sent!", "success"); }} className="w-full bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700 disabled:opacity-50">Checkout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}