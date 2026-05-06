import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validarEmail } from '../utils/helpers';
import { Field, Input, Button } from '../components/ui/UI';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined, general: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())         e.email    = 'El correo es obligatorio';
    else if (!validarEmail(form.email)) e.email = 'Formato de correo inválido';
    if (!form.password)             e.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = login(form.email.trim(), form.password);
      if (!ok) {
        setErrors({ general: 'Credenciales incorrectas. Verifica tu correo y contraseña.' });
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0c3b6e 0%, #1a6ea8 60%, #0ea5e9 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        padding: '40px 44px', width: '100%', maxWidth: 420,
        boxShadow: '0 32px 64px rgba(0,0,0,.3)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #1d6fa4, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            🌊
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
              Agua del 7mo Día
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1d6fa4', letterSpacing: '.03em' }}>
              “Exodo 20:8”
            </div>
          </div>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 32, marginTop: 10 }}>
          Sistema de gestión de entregas · Agua del 7mo Día
        </p>

        {/* Error general */}
        {errors.general && (
          <div
            role="alert"
            style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 9, padding: '10px 14px',
              color: '#dc2626', fontSize: 13, marginBottom: 20,
            }}
          >
            {errors.general}
          </div>
        )}

        <Field label="Correo electrónico" error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="Correo"
            error={errors.email}
          />
        </Field>

        <Field label="Contraseña" error={errors.password} inputId="login-password">
          <div style={{ position: 'relative' }}>
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="Contraseña"
              error={errors.password}
              aria-invalid={errors.password ? 'true' : undefined}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                border: 0,
                background: 'transparent',
                color: '#475569',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10.6 10.6A2 2 0 0012 14a2 2 0 001.4-.6M9.9 5.1A9.8 9.8 0 0112 5c5 0 8.4 4 9.6 6a13.5 13.5 0 01-3.1 3.8M6.4 6.5A13.5 13.5 0 002.4 11c1.2 2 4.6 6 9.6 6 1.3 0 2.5-.3 3.6-.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2.4 12S5.8 6 12 6s9.6 6 9.6 6-3.4 6-9.6 6-9.6-6-9.6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </Field>

        <Button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Verificando...' : 'Ingresar al sistema'}
        </Button>

      </div>
    </div>
  );
}
