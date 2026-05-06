import { useApp } from '../context/AppContext';

export function useClientes() {
  const {
    clientes,
    agregarCliente,
    editarCliente,
    toggleActivo,
    showToast,
  } = useApp();

  return {
    clientes,
    agregarCliente,
    editarCliente,
    toggleActivo,
    showToast,
  };
}
