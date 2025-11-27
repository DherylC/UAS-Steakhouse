const BASE_URL = 'http://localhost:3000/api'; // The URL of your running backend

export const api = {
  // --- AUTHENTICATION ---
  
  register: async (username, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return response.json();
  },

  // --- MENU ---

  getMenu: async () => {
    const response = await fetch(`${BASE_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  },

  addMenuItem: async (item) => {
    const response = await fetch(`${BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    
    if (!response.ok) throw new Error('Failed to add item');
    return response.json();
  },

  updateMenuItem: async (item) => {
    const response = await fetch(`${BASE_URL}/menu/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  deleteMenuItem: async (id) => {
    const response = await fetch(`${BASE_URL}/menu/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete item');
    return response.json(); 
  },

  submitOrder: async (orderData) => {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error('Failed to submit order');
    return response.json();
  }
};