import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    const storedAdmin = localStorage.getItem('adminInfo');
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('adminAccessToken', data.accessToken);
    localStorage.setItem('adminInfo', JSON.stringify(data.admin));
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
