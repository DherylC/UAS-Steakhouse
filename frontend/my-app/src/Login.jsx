import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import InputField from './components/InputField.jsx';
import { api } from './api.js';

export default function LoginForm({ onRegisterClick, onLoginSuccess, onError }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return onError("All fields required");
    
    setLoading(true);
    try {
      const user = await api.login(formData.username, formData.password);
      onLoginSuccess(user);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-100">
      <InputField 
        label="Username" 
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        icon={<User size={18} />}
      />
      <InputField 
        label="Password" 
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        icon={<Lock size={18} />}
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
        {!loading && <ArrowRight size={18} />}
      </button>
      <div className="text-center text-sm text-slate-500 mt-4">
        New customer? <button type="button" onClick={onRegisterClick} className="text-orange-600 font-bold hover:underline">Create account</button>
      </div>
    </form>
  );
}