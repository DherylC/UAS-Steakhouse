import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, ShoppingCart, Lock, X, ChefHat, Edit2 } from 'lucide-react';
import MenuItemForm from './components/MenuItemForm';
import RecapPage from './RecapPage'; // Import the new page
import { api } from './api';

export default function MenuPage({ user, onLogout, showNotification }) {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Customization State
  const [customizingItem, setCustomizingItem] = useState(null); 
  const [optionChoice, setOptionChoice] = useState('');

  // Editing State
  const [editingItem, setEditingItem] = useState(null);

  // Order State - If this is set, we show the RecapPage
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    api.getMenu().then(items => {
      setMenuItems(items);
      setLoading(false);
    });
  }, []);

  // --- API HANDLERS ---

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

  const handleUpdateItem = async (formData) => {
    try {
      const updatedItem = await api.updateMenuItem(formData);
      setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEditingItem(null);
      showNotification("Item updated successfully", "success");
    } catch (err) {
      showNotification("Failed to update item", "error");
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

  // --- CHECKOUT HANDLER ---

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Prepare data for the backend
    const orderData = {
      items: cart,
      total: cart.reduce((a, b) => a + Number(b.price), 0),
      user: user.username,
      date: new Date().toLocaleString()
    };

    try {
      // 1. Send to Express Backend
      const savedOrder = await api.submitOrder(orderData);
      
      // 2. Clear Cart
      setCart([]);
      
      // 3. Navigate to Recap Page using the data returned from Express
      setConfirmedOrder(savedOrder);
      
      showNotification("Order placed successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to submit order. Check server connection.", "error");
    }
  };

  // --- CUSTOMIZATION HANDLERS ---

  const handleAddToCartClick = (item) => {
    if (item.category === 'Steaks') {
      setCustomizingItem(item);
      setOptionChoice('Well Done');
    } else if (item.category === 'Drinks') {
      setCustomizingItem(item);
      setOptionChoice('Cold');
    } else {
      addToCart(item);
    }
  };

  const confirmCustomization = () => {
    if (!customizingItem) return;
    const itemWithOptions = {
      ...customizingItem,
      name: `${customizingItem.name} (${optionChoice})`
    };
    addToCart(itemWithOptions);
    setCustomizingItem(null);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    showNotification(`Added ${item.name}`, "success");
  };

  // --- RENDER LOGIC ---

  // If we have a confirmed order, show the Recap Page instead of the Menu
  if (confirmedOrder) {
    return <RecapPage order={confirmedOrder} onNewOrder={() => setConfirmedOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in border-2 border-orange-100">
            <h3 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
              <Edit2 size={24} /> Edit Item
            </h3>
            <MenuItemForm 
              initialData={editingItem} 
              onSave={handleUpdateItem} 
              onCancel={() => setEditingItem(null)} 
            />
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Customize {customizingItem.name}</h3>
            <p className="text-slate-500 mb-4 text-sm">Select preference:</p>
            
            {customizingItem.category === 'Steaks' && (
              <div className="space-y-2 mb-6">
                {['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input 
                      type="radio" 
                      name="doneness" 
                      value={opt} 
                      checked={optionChoice === opt}
                      onChange={(e) => setOptionChoice(e.target.value)}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {customizingItem.category === 'Drinks' && (
              <div className="flex gap-4 mb-6">
                {['Hot', 'Cold'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setOptionChoice(opt)}
                    className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                      optionChoice === opt 
                        ? 'border-orange-600 bg-orange-50 text-orange-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={confirmCustomization} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700">Add</button>
              <button onClick={() => setCustomizingItem(null)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-600">
            <ChefHat size={28} />
            <span className="font-bold text-xl text-slate-800">TastyBytes</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600">{user.username} ({user.role})</span>
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500" title="Logout"><LogOut size={20}/></button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Menu</h2>
            {isAdmin && !isAdding && (
              <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 shadow-sm transition-all hover:scale-105">
                <Plus size={18}/> Add Item
              </button>
            )}
          </div>

          {isAdding && (
            <div className="bg-white p-6 rounded-xl shadow border-2 border-orange-100 animate-fade-in">
              <h3 className="font-bold mb-4 text-orange-600">New Item</h3>
              <MenuItemForm onSave={handleAddItem} onCancel={() => setIsAdding(false)} />
            </div>
          )}

          {loading ? <div className="text-center py-10 text-slate-400">Loading menu...</div> : (
            <div className="grid md:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <span className="font-bold text-orange-600">Rp{Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 flex-grow">{item.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold uppercase">{item.category}</span>
                    
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingItem(item)} 
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 size={18}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddToCartClick(item)} 
                        className="text-slate-800 hover:bg-slate-100 p-2 rounded flex gap-2 text-sm font-bold transition-colors"
                      >
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
            <h3 className="font-bold text-lg mb-4 flex gap-2 items-center">
              {isAdmin ? <Lock size={20} className="text-orange-600"/> : <ShoppingCart size={20} className="text-orange-600"/>}
              {isAdmin ? 'Admin Panel' : 'Your Order'}
            </h3>
            
            {isAdmin ? (
               <div className="space-y-4">
                 <p className="text-sm text-slate-500">You are in manager mode.</p>
                 <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
                   <li>Add items using the button above.</li>
                   <li>Edit items using the blue pencil icon.</li>
                   <li>Remove items using the red trash icon.</li>
                 </ul>
               </div>
            ) : (
              <div>
                {cart.length === 0 ? <p className="text-slate-400 text-sm text-center py-4">Cart is empty.</p> : (
                  <div className="space-y-3 mb-4">
                    {cart.map((c, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">Rp{c.price}</span>
                          <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors"><X size={14}/></button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-4 border-t border-slate-100">
                      <span>Total</span>
                      <span>Rp{cart.reduce((a, b) => a + Number(b.price), 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <button 
                  disabled={cart.length===0} 
                  onClick={handleCheckout} 
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-lg shadow-orange-200"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}