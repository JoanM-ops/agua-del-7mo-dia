import { cloneElement, isValidElement, useId } from 'react';

/* ── Badge ─────────────────────────────────────────────────────────────── */
export function Badge({ children, variant = 'gray' }) {
  const colors = {
    gray:  { background: '#f1f5f9', color: '#475569' },
    green: { background: '#f0fdf4', color: '#16a34a' },
    red:   { background: '#fef2f2', color: '#dc2626' },
    blue:  { background: '#eff6ff', color: '#2563eb' },
    amber: { background: '#fffbeb', color: '#d97706' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      ...colors[variant],
    }}>
      {children}
    </span>
  );
}

/* ── Field ─────────────────────────────────────────────────────────────── */
export function Field({ label, error, children, inputId }) {
  const generatedId = useId();
  const fieldId = inputId ?? children?.props?.id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const child = isValidElement(children) && !inputId
    ? cloneElement(children, {
        id: fieldId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errorId : children.props?.['aria-describedby'],
      })
    : children;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
      <label htmlFor={fieldId} style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</label>
      {child}
      {error && (
        <span id={errorId} role="alert" style={{ fontSize: 11, color: '#dc2626', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}

/* ── Input ─────────────────────────────────────────────────────────────── */
export function Input({ error, style: extraStyle, ...props }) {
  return (
    <input
      style={{
        padding: '9px 12px',
        border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: 8,
        fontSize: 13,
        background: '#fff',
        color: '#0f172a',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        ...extraStyle,
      }}
      {...props}
    />
  );
}

/* ── Select ────────────────────────────────────────────────────────────── */
export function Select({ error, children, style: extraStyle, ...props }) {
  return (
    <select
      style={{
        padding: '9px 12px',
        border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: 8,
        fontSize: 13,
        background: '#fff',
        color: '#0f172a',
        width: '100%',
        boxSizing: 'border-box',
        outline: 'none',
        ...extraStyle,
      }}
      {...props}
    >
      {children}
    </select>
  );
}

/* ── Button ────────────────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', style: extraStyle, ...props }) {
  const base = {
    border: 'none', borderRadius: 9, padding: '10px 22px',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    transition: 'opacity .15s',
  };
  const variants = {
    primary: { background: '#0f172a', color: '#fff' },
    ghost:   { background: '#f1f5f9', color: '#0f172a', border: '1.5px solid #e2e8f0' },
    danger:  { background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...extraStyle }} {...props}>
      {children}
    </button>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */
export function Card({ children, style: extra }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f1f5f9',
      borderRadius: 14,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,.05)',
      ...extra,
    }}>
      {children}
    </div>
  );
}

/* ── SectionLabel ──────────────────────────────────────────────────────── */
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#94a3b8',
      textTransform: 'uppercase', letterSpacing: '.06em',
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

/* ── Table ─────────────────────────────────────────────────────────────── */
export function Table({ headers, rows, empty = 'Sin registros.' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{
                padding: '9px 14px', textAlign: 'left', fontSize: 11,
                fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
                letterSpacing: '.04em', background: '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '10px 14px', color: '#0f172a', verticalAlign: 'middle' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Toast ─────────────────────────────────────────────────────────────── */
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={{
      position: 'fixed', bottom: 28, right: 28,
      padding: '11px 20px', borderRadius: 10,
      background: toast.type === 'error' ? '#ef4444' : '#22c55e',
      color: '#fff', fontWeight: 600, fontSize: 13,
      boxShadow: '0 8px 24px rgba(0,0,0,.18)',
      zIndex: 9999,
      animation: 'fadeIn .2s ease',
    }}>
      {toast.type === 'error' ? '✗' : '✓'} {toast.msg}
    </div>
  );
}

/* ── PageTitle ─────────────────────────────────────────────────────────── */
export function PageTitle({ children, style: extraStyle }) {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 24px', ...extraStyle }}>
      {children}
    </h1>
  );
}

/* ── MetricCard ────────────────────────────────────────────────────────── */
export function MetricCard({ label, value, color = '#0f172a', icon }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '18px 20px',
      border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,.04)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    </div>
  );
}
