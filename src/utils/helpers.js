export const today = () => new Date().toISOString().split('T')[0];

export const mesActual = () => today().slice(0, 7);

export const deudaAlta = (saldo) => saldo >= 4;

export const formatFecha = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const validarTelefono = (tel) => /^\d{3}\d{7}$/.test(tel);

export const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);
