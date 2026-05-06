import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import { Toast } from './components/ui/UI';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RutaPage      from './pages/RutaPage';
import EntregasPage  from './pages/EntregasPage';
import ClientesPage  from './pages/ClientesPage';

const PAGES = {
  dashboard: DashboardPage,
  ruta:      RutaPage,
  entregas:  EntregasPage,
  clientes:  ClientesPage,
};

function Layout() {
  const [view, setView]   = useState('dashboard');
  const { toast, cargando } = useApp();
  const Page              = PAGES[view];

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar view={view} setView={setView} />
      <main className="app-main" style={{ flex: 1, padding: '36px 48px', maxWidth: 1080, overflowY: 'auto' }}>
        {cargando ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '60vh', flexDirection: 'column', gap: 16,
            color: '#64748b', fontSize: 14,
          }}>
            <div style={{
              width: 36, height: 36, border: '3px solid #e2e8f0',
              borderTop: '3px solid #1d6fa4', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Cargando datos...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <Page />
        )}
      </main>
      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  return user ? <Layout /> : <LoginPage />;
}
