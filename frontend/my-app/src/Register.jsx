import { useState } from 'react';
import { User, Lock, CheckCircle } from 'lucide-react';
import InputField from './components/InputField.jsx';
import { api } from './api.js';

export default function RegisterForm({ onLoginClick, onRegisterSuccess, onError }) {
  const [formData, setFormData] = useState({ username: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.confirm) return onError("All fields required");
    if (formData.password !== formData.confirm) return onError("Passwords do not match");

    setLoading(true);
    try {
      const user = await api.register(formData.username, formData.password);
      onRegisterSuccess(user);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-orange-50 p-3 rounded text-sm text-orange-800 border border-orange-100">
        <strong>Tip:</strong> Use username <strong>admin</strong> for manager access.
      </div>
      <InputField 
        label="Username" 
        value={formData.username} 
        onChange={e => setFormData({...formData, username: e.target.value})}
        icon={<User size={18} />}
      />
      <InputField 
        label="Password" 
        type="password" 
        value={formData.password} 
        onChange={e => setFormData({...formData, password: e.target.value})}
        icon={<Lock size={18} />}
      />
      <InputField 
        label="Confirm Password" 
        type="password" 
        value={formData.confirm} 
        onChange={e => setFormData({...formData, confirm: e.target.value})}
        icon={<CheckCircle size={18} />}
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-70"
      >
        {loading ? 'Creating...' : 'Register'}
      </button>
      <div className="text-center text-sm text-slate-500 mt-4">
        Have an account? <button type="button" onClick={onLoginClick} className="text-slate-800 font-bold hover:underline">Sign In</button>
      </div>
    </form>
  );
}