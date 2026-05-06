import { useApp } from '../context/AppContext';
import { today, mesActual, deudaAlta, formatFecha } from '../utils/helpers';
import { PageTitle, MetricCard, SectionLabel, Badge, Card, Table } from '../components/ui/UI';

export default function DashboardPage() {
  const { clientes, entregas } = useApp();

  const hoy        = today();
  const entregasHoy = entregas.filter((e) => e.fecha === hoy);
  const entregasMes = entregas.filter((e) => e.fecha.startsWith(mesActual()));

  const totalHoy    = entregasHoy.reduce((s, e) => s + e.botellones, 0);
  const cobradoHoy  = entregasHoy.reduce((s, e) => s + (e.pagadoBotellones ?? e.pagado ?? 0) + (e.abonoDeuda ?? 0), 0);
  const totalMes    = entregasMes.reduce((s, e) => s + e.botellones, 0);
  const deudaTotal  = clientes.reduce((s, c) => s + c.saldo, 0);
  const criticos    = clientes.filter((c) => deudaAlta(c.saldo));

  const filas = entregasHoy.map((e) => {
    const cl  = clientes.find((c) => c.id === e.clienteId);
    const pagado = e.pagadoBotellones ?? e.pagado ?? 0;
    const pend = e.botellones - pagado;
    return [
      cl?.nombre ?? '—',
      cl?.zona ?? '—',
      e.botellones,
      pagado,
      <span style={{ color: pend > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{pend}</span>,
    ];
  });

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <p style={{ color: '#64748b', marginBottom: 28, marginTop: -16, fontSize: 13 }}>
        {formatFecha(hoy)} &nbsp;·&nbsp;
        <span style={{ color: '#1d6fa4', fontWeight: 600 }}>Agua del 7mo Día</span>
      </p>

      {/* Métricas */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        <MetricCard label="Botellones hoy"       value={totalHoy}            color="#2563eb" icon="💧" />
        <MetricCard label="Cobrados hoy"          value={cobradoHoy}          color="#16a34a" icon="✅" />
        <MetricCard label="Botellones este mes"   value={totalMes}            color="#7c3aed" icon="📦" />
        <MetricCard label="Deuda total (bot.)"    value={`${deudaTotal}`}     color="#d97706" icon="⚠️" />
      </div>

      {/* Alerta deuda crítica */}
      {criticos.length > 0 && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        }}>
          <div role="alert" style={{ fontWeight: 700, color: '#dc2626', fontSize: 14, marginBottom: 12 }}>
            🚨 Clientes con deuda crítica — más de 2 semanas sin pagar
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {criticos.map((c) => (
              <span key={c.id} style={{
                background: '#fff', border: '1px solid #fecaca',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, color: '#dc2626',
              }}>
                {c.nombre} — <strong>{c.saldo} bot.</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabla entregas de hoy */}
      <SectionLabel>Entregas registradas hoy</SectionLabel>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Table
          headers={['Cliente', 'Zona', 'Entregados', 'Pagados', 'Pendiente']}
          rows={filas}
          empty="No hay entregas registradas hoy."
        />
      </Card>
    </div>
  );
}
