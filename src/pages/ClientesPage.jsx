import { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import { deudaAlta } from '../utils/helpers';
const ZONAS = ['DN', 'SDN', 'SDE', 'SDO'];
import { PageTitle, Badge, Button } from '../components/ui/UI';
import ClienteModal from '../components/clientes/ClienteModal';

export default function ClientesPage() {
  const { clientes, agregarCliente, editarCliente, toggleActivo, showToast } = useClientes();
  const [search, setSearch]       = useState('');
  const [filtroZona, setFiltroZona] = useState('');
  const [soloDeuda, setSoloDeuda]   = useState(false);
  const [modal, setModal]           = useState(null); // null | cliente obj

  const filtrados = clientes.filter((c) => {
    const q  = search.toLowerCase();
    const ms = c.nombre.toLowerCase().includes(q) || c.direccion.toLowerCase().includes(q);
    const mz = !filtroZona || c.zona === filtroZona;
    const md = !soloDeuda || deudaAlta(c.saldo);
    return ms && mz && md;
  });

  const handleSave = (data) => {
    if (data.id) {
      editarCliente(data);
      showToast('Cliente actualizado');
    } else {
      agregarCliente(data);
      showToast('Cliente registrado');
    }
    setModal(null);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="page-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <PageTitle style={{ margin: 0 }}>👥 Clientes</PageTitle>
        <Button onClick={() => setModal({})}>+ Nuevo cliente</Button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          aria-label="Buscar clientes por nombre o dirección"
          style={{
            padding: '8px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 8, fontSize: 13, outline: 'none',
            background: '#fff', color: '#0f172a', width: 220,
          }}
          placeholder="Buscar por nombre o dirección..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filtrar clientes por zona"
          style={{
            padding: '8px 12px', border: '1.5px solid #e2e8f0',
            borderRadius: 8, fontSize: 13, background: '#fff', color: '#0f172a',
          }}
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
        >
          <option value="">Todas las zonas</option>
          {ZONAS.map((z) => <option key={z}>{z}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={soloDeuda}
            onChange={(e) => setSoloDeuda(e.target.checked)}
          />
          Solo deuda crítica
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>
          {filtrados.length} cliente(s)
        </span>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtrados.length === 0 && (
          <p style={{ color: '#94a3b8', padding: '32px 0', textAlign: 'center' }}>
            No se encontraron clientes con ese criterio.
          </p>
        )}
        {filtrados.map((c) => (
          <div
            className="client-row"
            key={c.id}
            style={{
              background: '#fff', border: '1px solid #f1f5f9',
              borderRadius: 13, padding: '15px 20px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 16,
              opacity: c.activo ? 1 : 0.5,
            }}
          >
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                {c.nombre}
                {!c.activo && <Badge variant="gray" style={{ marginLeft: 8 }}>Inactivo</Badge>}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                📍 {c.direccion} &nbsp;·&nbsp; Zona {c.zona} &nbsp;·&nbsp; {c.frecuencia} &nbsp;·&nbsp; 📱 {c.telefono}
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <Badge variant={deudaAlta(c.saldo) ? 'red' : 'green'}>
                {deudaAlta(c.saldo) ? '⚠️ ' : '✓ '}{c.saldo} bot.
              </Badge>
              <Button variant="ghost" onClick={() => setModal(c)} style={{ padding: '6px 12px', fontSize: 12 }}>
                Editar
              </Button>
              <Button
                variant={c.activo ? 'danger' : 'ghost'}
                onClick={() => { toggleActivo(c.id); showToast('Estado actualizado'); }}
                style={{ padding: '6px 12px', fontSize: 12 }}
              >
                {c.activo ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== null && (
        <ClienteModal
          data={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
