import { useState, useCallback } from 'react';
import { isAdminAuthenticated } from '../utils/auth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function ProtectedRoute() {
  const [authState, setAuthState] = useState(() => isAdminAuthenticated());

  const handleLoginSuccess = useCallback(() => {
    setAuthState(true);
  }, []);

  const handleLogout = useCallback(() => {
    setAuthState(false);
  }, []);

  if (authState) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
}

export default ProtectedRoute;