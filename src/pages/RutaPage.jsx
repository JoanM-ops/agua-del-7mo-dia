import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { today, deudaAlta } from '../utils/helpers';
import { PageTitle, Badge } from '../components/ui/UI';

export default function RutaPage() {
  const { clientes, entregas } = useApp();

  const entregadosHoy = useMemo(
    () => entregas.filter((e) => e.fecha === today()).map((e) => e.clienteId),
    [entregas]
  );

  const porZona = useMemo(() => {
    const pendientes = clientes.filter((c) => c.activo && !entregadosHoy.includes(c.id));
    return pendientes.reduce((acc, c) => {
      if (!acc[c.zona]) acc[c.zona] = [];
      acc[c.zona].push(c);
      return acc;
    }, {});
  }, [clientes, entregadosHoy]);

  const totalPendientes = Object.values(porZona).flat().length;

  return (
    <div>
      <PageTitle>🗺️ Ruta del día</PageTitle>

      {/* Contadores */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <Badge variant="blue">{totalPendientes} pendientes</Badge>
        <Badge variant="green">{entregadosHoy.length} entregados</Badge>
      </div>

      {totalPendientes === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: '#f0fdf4', borderRadius: 14,
          color: '#16a34a', fontSize: 16, fontWeight: 600,
        }}>
          🎉 ¡Todas las entregas del día completadas!
        </div>
      ) : (
        Object.entries(porZona).map(([zona, lista]) => (
          <div key={zona} style={{ marginBottom: 28 }}>
            {/* Encabezado de zona */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#f8fafc', borderRadius: 9,
              padding: '9px 16px', marginBottom: 10,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                📍 Zona {zona}
              </span>
              <Badge variant="gray">{lista.length} cliente(s)</Badge>
            </div>

            {/* Items */}
            {lista.map((c, i) => (
              <div
                key={c.id}
                style={{
                  background: '#fff',
                  border: '1px solid #f1f5f9',
                  borderLeft: `4px solid ${deudaAlta(c.saldo) ? '#ef4444' : '#3b82f6'}`,
                  borderRadius: 12,
                  padding: '14px 18px',
                  marginBottom: 8,
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}
              >
                {/* Número */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#f1f5f9', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#64748b',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                    {c.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    📍 {c.direccion} &nbsp;·&nbsp; 📱 {c.telefono} &nbsp;·&nbsp; {c.frecuencia}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Badge variant={deudaAlta(c.saldo) ? 'red' : 'gray'}>
                      Saldo: {c.saldo} bot.
                    </Badge>
                    {deudaAlta(c.saldo) && (
                      <Badge variant="red">⚠️ Deuda crítica</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
