import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchClientes, saveClientes, fetchEntregas, saveEntregas } from '../services/firestoreService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [toast, setToast]       = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!user) {
      setClientes([]);
      setEntregas([]);
      return;
    }
    setCargando(true);
    Promise.all([fetchClientes(), fetchEntregas()])
      .then(([cls, ents]) => {
        setClientes(cls);
        setEntregas(ents);
      })
      .catch(() => showToast('Error al conectar con la base de datos', 'error'))
      .finally(() => setCargando(false));
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const agregarCliente = async (data) => {
    const nuevo = { ...data, id: Date.now(), saldo: 0, activo: true };
    const actualizados = [...clientes, nuevo];
    setClientes(actualizados);
    try {
      await saveClientes(actualizados);
    } catch {
      showToast('Error al guardar en la base de datos', 'error');
    }
  };

  const editarCliente = async (data) => {
    const actualizados = clientes.map((c) => (c.id === data.id ? data : c));
    setClientes(actualizados);
    try {
      await saveClientes(actualizados);
    } catch {
      showToast('Error al guardar cambios', 'error');
    }
  };

  const toggleActivo = async (id) => {
    const actualizados = clientes.map((c) => (c.id === id ? { ...c, activo: !c.activo } : c));
    setClientes(actualizados);
    try {
      await saveClientes(actualizados);
    } catch {
      showToast('Error al guardar cambios', 'error');
    }
  };

const registrarEntrega = async (entrega) => {
  const nueva = {
    ...entrega,
    id: Date.now(),
    clienteId:       Number(entrega.clienteId),
    botellones:      Number(entrega.botellones),
    pagadoBotellones:Number(entrega.pagadoBotellones),
    abonoDeuda:      Number(entrega.abonoDeuda || 0),
  };
  const entregasActualizadas = [...entregas, nueva];
  setEntregas(entregasActualizadas);

  const pendienteBotellones = nueva.botellones - nueva.pagadoBotellones;

  const clientesActualizados = clientes.map((c) =>
    c.id === nueva.clienteId
      ? { ...c, saldo: Math.max(0, c.saldo + pendienteBotellones - nueva.abonoDeuda) }
      : c
  );
  setClientes(clientesActualizados);

  try {
    await Promise.all([
      saveEntregas(entregasActualizadas),
      saveClientes(clientesActualizados),
    ]);
  } catch {
    showToast('Error al guardar la entrega', 'error');
  }
};

  return (
    <AppContext.Provider
      value={{
        clientes, agregarCliente, editarCliente, toggleActivo,
        entregas, registrarEntrega,
        toast, showToast,
        cargando,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
