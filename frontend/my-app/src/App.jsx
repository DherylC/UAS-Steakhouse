import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import AuthLayout from './components/layout/AuthLayout.jsx';
import LoginForm from './Login.jsx';
import RegisterForm from './Register.jsx';
import MenuPage from './MenuPage.jsx';

export default function App() {
  const [route, setRoute] = useState('/login'); 
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const navigate = (path) => setRoute(path);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/menu');
    showNotification(`Welcome, ${userData.username}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
    showNotification('Logged out', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Toast Notification Layer */}
      {notification && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white animate-bounce-in z-50 ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
          {notification.message}
        </div>
      )}

      {/* Router Switch */}
      {route === '/login' && (
        <AuthLayout title="Gourmet Login">
          <LoginForm 
            onRegisterClick={() => navigate('/register')} 
            onLoginSuccess={handleLogin}
            onError={(msg) => showNotification(msg, 'error')}
          />
        </AuthLayout>
      )}

      {route === '/register' && (
        <AuthLayout title="Join Our Table">
          <RegisterForm 
            onLoginClick={() => navigate('/login')}
            onRegisterSuccess={handleLogin}
            onError={(msg) => showNotification(msg, 'error')}
          />
        </AuthLayout>
      )}

      {route === '/menu' && user && (
        <MenuPage 
          user={user} 
          onLogout={handleLogout}
          showNotification={showNotification}
        />
      )}
    </div>
  );
}