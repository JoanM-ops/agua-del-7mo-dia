import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { today, deudaAlta } from '../utils/helpers';
import { PageTitle, SectionLabel, Field, Input, Select, Button, Card, Table } from '../components/ui/UI';

const EMPTY_FORM = { 
  clienteId: '', 
  botellones: 0,
  pagadoBotellones: 0, 
  abonoDeuda: 0,
  notas: '',     fecha: today() 
};

export default function EntregasPage() {
  const { clientes, entregas, registrarEntrega, showToast } = useApp();
  const [form, setForm]     = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    const cliente = clientes.find((c) => c.id === Number(form.clienteId));
    if (!form.clienteId) e.clienteId = 'Selecciona un cliente';
    if (Number(form.botellones) === 0)
      e.botellones = 'Debe entregar al menos 1 botellón';
    if (Number(form.pagadoBotellones) > Number(form.botellones))
      e.pagadoBotellones = 'No puede superar los botellones entregados';
    if (cliente && Number(form.abonoDeuda) > cliente.saldo)
      e.abonoDeuda = 'No puede superar el saldo pendiente del cliente';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    registrarEntrega(form);
    showToast('Entrega registrada');
    setForm({ ...EMPTY_FORM });
  };

  // Preview del impacto en saldo
  const clienteSeleccionado  = clientes.find((c) => c.id === Number(form.clienteId));
  const pendienteBotellones  = Number(form.botellones) - Number(form.pagadoBotellones);
  const saldoPreview = clienteSeleccionado
    ? Math.max(0, clienteSeleccionado.saldo + pendienteBotellones - Number(form.abonoDeuda))
    : 0;

  // Tabla historial
  const filas = [...entregas]
    .sort((a, b) => b.id - a.id)
    .slice(0, 20)
    .map((e) => {
      const cl  = clientes.find((c) => c.id === e.clienteId);
      const pb  = e.botellones - e.pagadoBotellones;
      const abono = e.abonoDeuda ?? 0;
      return [
        e.fecha,
        cl?.nombre ?? '—',
        cl?.zona ?? '—',
        e.botellones,
        e.pagadoBotellones,
        abono,
        <span style={{ color: pb > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{pb}</span>,
        <span style={{ color: '#94a3b8', fontSize: 12 }}>{e.notas || '—'}</span>,
      ];
    });

  return (
    <div>
      <PageTitle>📦 Entregas</PageTitle>

      {/* Formulario */}
      <Card style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
          Registrar nueva entrega
        </div>

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Cliente *" error={errors.clienteId}>
            <Select
              value={form.clienteId}
              onChange={(e) => set('clienteId', e.target.value)}
              error={errors.clienteId}
            >
              <option value="">Seleccionar cliente...</option>
              {clientes
                .filter((c) => c.activo)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}{deudaAlta(c.saldo) ? ' ⚠️' : ''} — {c.zona}
                  </option>
                ))}
            </Select>
          </Field>

          <Field label="Fecha *">
            <Input type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          </Field>

          <Field label="Botellones entregados" error={errors.botellones}>
            <Input type="number" min={0} value={form.botellones}
              onChange={(e) => set('botellones', e.target.value)} error={errors.botellones} />
          </Field>

          <Field label="Botellones pagados" error={errors.pagadoBotellones}>
            <Input type="number" min={0} value={form.pagadoBotellones}
              onChange={(e) => set('pagadoBotellones', e.target.value)} error={errors.pagadoBotellones} />
          </Field>

          <Field label="Abono a deuda anterior" error={errors.abonoDeuda}>
            <Input type="number" min={0} value={form.abonoDeuda}
              onChange={(e) => set('abonoDeuda', e.target.value)} error={errors.abonoDeuda} />
          </Field>

        </div>

        <Field label="Notas (opcional)">
          <Input
            id="entrega-notas"
            value={form.notas}
            onChange={(e) => set('notas', e.target.value)}
            placeholder="Ej: dejé con el vecino, cliente no estaba..."
          />
        </Field>

        {/* Preview */}
        {clienteSeleccionado && (
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 9, padding: '10px 14px',
            fontSize: 13, color: '#1e40af', marginBottom: 16,
          }}>
            <strong>{clienteSeleccionado.nombre}</strong>
            {' '}· Botellones: {clienteSeleccionado.saldo} pend.
            {saldoPreview !== clienteSeleccionado.saldo && (
              <span style={{ color: '#d97706' }}> → {saldoPreview}</span>
            )}
          </div>
        )}

        <Button onClick={handleSubmit}>Registrar entrega</Button>
      </Card>

      {/* Historial */}
      <SectionLabel>Historial reciente</SectionLabel>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Table
          headers={['Fecha', 'Cliente', 'Zona', 'Entregados', 'Pagados', 'Abono deuda', 'Pendiente', 'Notas']}
          rows={filas}
          empty="No hay entregas registradas aún."
        />
      </Card>
    </div>
  );
}
