import { useState, useEffect } from 'react';
import { AdminAuth } from './AdminAuth';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminAccounts } from './AdminAccounts';

type AdminSection = 'dashboard' | 'products' | 'categories' | 'orders' | 'accounts';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    // Persist auth across page refreshes within the same session
    const stored = sessionStorage.getItem('chelouve_admin_auth');
    if (stored === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('chelouve_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderSection = () => {
    switch (section) {
      case 'dashboard':   return <AdminDashboard />;
      case 'products':    return <AdminProducts />;
      case 'categories':  return <AdminCategories />;
      case 'orders':      return <AdminOrders />;
      case 'accounts':    return <AdminAccounts />;
      default:            return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      activeSection={section}
      onSectionChange={setSection}
      onLogout={handleLogout}
    >
      {renderSection()}
    </AdminLayout>
  );
}
