import { useState } from 'react';
import { validarTelefono } from '../../utils/helpers';
import { Field, Input, Select, Button } from '../ui/UI';

const ZONAS = ['Norte', 'Sur', 'Este', 'Metro'];
const FRECUENCIAS = ['semanal', 'quincenal'];
const EMPTY = { nombre: '', direccion: '', telefono: '', zona: 'Norte', frecuencia: 'semanal', saldo: 0 };

export default function ClienteModal({ data, onClose, onSave }) {
  const [form, setForm]     = useState(data ? { ...data } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())               e.nombre    = 'El nombre es obligatorio';
    if (!form.direccion.trim())            e.direccion = 'La dirección es obligatoria';
    if (!form.telefono.trim())             e.telefono  = 'El teléfono es obligatorio';
    else if (!validarTelefono(form.telefono)) e.telefono = 'Formato requerido: 0000000000';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cliente-modal-title"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 16,
        padding: '28px 32px', width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 id="cliente-modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
            {data ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar formulario de cliente"
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        <Field label="Nombre completo *" error={errors.nombre}>
          <Input
            value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            placeholder=""
            error={errors.nombre}
          />
        </Field>

        <Field label="Dirección *" error={errors.direccion}>
          <Input
            value={form.direccion}
            onChange={(e) => set('direccion', e.target.value)}
            placeholder=""
            error={errors.direccion}
          />
        </Field>

        <Field label="Teléfono *" error={errors.telefono}>
          <Input
            value={form.telefono}
            onChange={(e) => set('telefono', e.target.value)}
            placeholder=""
            error={errors.telefono}
          />
        </Field>

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Zona">
            <Select value={form.zona} onChange={(e) => set('zona', e.target.value)}>
              {ZONAS.map((z) => <option key={z}>{z}</option>)}
            </Select>
          </Field>
          <Field label="Frecuencia">
            <Select value={form.frecuencia} onChange={(e) => set('frecuencia', e.target.value)}>
              {FRECUENCIAS.map((f) => <option key={f}>{f}</option>)}
            </Select>
          </Field>
        </div>

        {data && (
          <Field label="Saldo actual (botellones)">
            <Input
              type="number" min={0}
              value={form.saldo}
              onChange={(e) => set('saldo', Number(e.target.value))}
            />
          </Field>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</Button>
          <Button onClick={handleSave} style={{ flex: 2 }}>
            {data ? 'Guardar cambios' : 'Registrar cliente'}
          </Button>
        </div>
      </div>
    </div>
  );
}
