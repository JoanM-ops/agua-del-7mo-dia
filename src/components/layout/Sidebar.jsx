import { useAuth } from '../../context/AuthContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',     icon: '📊' },
  { id: 'ruta',      label: 'Ruta del día',  icon: '🗺️' },
  { id: 'entregas',  label: 'Entregas',       icon: '📦' },
  { id: 'clientes',  label: 'Clientes',       icon: '👥' },
];

export default function Sidebar({ view, setView }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar" style={{
      width: 220, flexShrink: 0,
      background: '#0f172a', color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '0 0 16px',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#1d6fa4', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>
          🌊
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.1 }}>Agua del 7mo Día</div>
        </div>
      </div>

      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#1e40af', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700,
        }}>
          {user.nombre[0]}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{user.nombre}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Gestión de entregas</div>
        </div>
      </div>

      <nav aria-label="Navegación principal" style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            aria-current={view === n.id ? 'page' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px',
              border: 'none', borderRadius: 8,
              background: view === n.id ? '#1e293b' : 'transparent',
              color: view === n.id ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer', fontSize: 13,
              fontWeight: view === n.id ? 700 : 400,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 15 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        aria-label="Cerrar sesión"
        style={{
          margin: '0 10px', padding: '9px 12px',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 8, background: 'transparent',
          color: '#64748b', cursor: 'pointer', fontSize: 12,
          textAlign: 'left',
        }}
      >
        ← Cerrar sesión
      </button>
    </aside>
  );
}
