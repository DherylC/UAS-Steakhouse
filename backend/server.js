const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// --- MIDDLEWARE ---
// Allow the frontend (running on a different port) to access this server
app.use(cors());
// Parse incoming JSON data in requests
app.use(express.json());

// --- CONSTANTS ---
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// --- HELPER FUNCTIONS ---

// Read data from a JSON file
async function readJsonFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return default empty array
    return [];
  }
}

// Write data to a JSON file
async function writeJsonFile(filepath, data) {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
}

// --- ROUTES ---

// 1. REGISTER USER
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const users = await readJsonFile(USERS_FILE);

    // Check if user exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Role Logic: 'admin' username gets admin role, others get 'user'
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

    const newUser = { id: Date.now(), username, password, role };
    users.push(newUser);

    await writeJsonFile(USERS_FILE, users);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Server error registering user" });
  }
});

// 2. LOGIN USER
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await readJsonFile(USERS_FILE);
    
    // Find matching user
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return user info (excluding sensitive data in a real app, but ok for now)
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error logging in" });
  }
});

// 3. GET MENU (Public)
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await readJsonFile(MENU_FILE);
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Could not load menu" });
  }
});

// 4. ADD MENU ITEM (Admin)
app.post('/api/menu', async (req, res) => {
  // In a real app, you would check a token here to verify the user is an admin.
  // For this prototype, we are trusting the request.

  const newItem = { ...req.body, id: Date.now() };

  try {
    const menu = await readJsonFile(MENU_FILE);
    menu.push(newItem);
    await writeJsonFile(MENU_FILE, menu);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Could not save item" });
  }
});



app.put('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const menu = await readJsonFile(MENU_FILE);
    const index = menu.findIndex(item => item.id == id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update item while preserving ID
    menu[index] = { ...menu[index], ...updatedData, id: Number(id) };
    
    await writeJsonFile(MENU_FILE, menu);
    res.json(menu[index]);
  } catch (error) {
    res.status(500).json({ error: "Could not update item" });
  }
});


app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const menu = await readJsonFile(MENU_FILE);
    const filteredMenu = menu.filter(item => item.id != id);

    if (menu.length === filteredMenu.length) {
      return res.status(404).json({ error: "Item not found" });
    }

    await writeJsonFile(MENU_FILE, filteredMenu);
    res.json({ message: "Item deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: "Could not delete item" });
  }
});

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  // Add a unique server-side ID and timestamp
  const newOrder = { 
    ...orderData, 
    id: Date.now(), 
    serverReceivedAt: new Date().toISOString() 
  };

  try {
    const orders = await readJsonFile(ORDERS_FILE);
    orders.push(newOrder);
    await writeJsonFile(ORDERS_FILE, orders);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});