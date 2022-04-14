import React, { createContext, useState, useEffect } from "react";

import api from "../api";
import history from "../history";

const Context = createContext();

const AuthProvider = ({ children }) => {
  const [autenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
    setLoading(false);
  }, [])

  const handleLogin = async () => {
    const { data: { token } } = await api.post('/authenticate');

    localStorage.setItem('token', JSON.stringify(token));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthenticated(true)
    history.push('/users');
  }

  const handleLogout = async () => {
    setAuthenticated(false)
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    history.push('/login');
  }

  if (loading) {
    return <h1>Loadding...</h1>
  }
  return (
    <Context.Provider value={{ autenticated, loading, handleLogin, handleLogout }}>
      {children}
    </Context.Provider>
  )
}

export { Context, AuthProvider };