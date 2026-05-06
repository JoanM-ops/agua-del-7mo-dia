import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const SESSION_KEY = 'Agua del 7mo Día_user';
const INACTIVITY_LIMIT = 5 * 60 * 1000;

const USUARIOS = [
  { email: 'joanperez@7modia.com', password: '12345678', nombre: 'Joan Pérez' },
  { email: 'severindeleon@7modia.com', password: '12345678', nombre: 'Miguel De Leon' },
  { email: 'abelvargas@7modia.com', password: '12345678', nombre: 'AbAbel Vargas' },
  { email: 'taniavilla@7modia.com', password: '12345678', nombre: 'Tania Villa' },
  { email: 'hamsselrodriguez@7modia.com', password: '12345678', nombre: 'Hamssell Rodriguez' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const usuario = USUARIOS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!usuario) return false;

    const sessionUser = { nombre: usuario.nombre, email: usuario.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  useEffect(() => {
    if (!user) return;

    let timerId;
    const resetTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(logout, INACTIVITY_LIMIT);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
