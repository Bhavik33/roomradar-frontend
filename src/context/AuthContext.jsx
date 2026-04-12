import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../api/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Axios instance with a 20-second timeout to handle Render cold starts gracefully
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `/api/auth`;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post(`${API_URL}/login`, { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Signed in successfully!');
      return { success: true };
    } catch (error) {
      const message = error.code === 'ECONNABORTED'
        ? 'Server is waking up, please try again in a moment.'
        : error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post(`${API_URL}/register`, { name, email, password });
      toast.success(data.message);
      return { success: true, email };
    } catch (error) {
      const message = error.code === 'ECONNABORTED'
        ? 'Server is waking up, please try again in a moment.'
        : error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOtp = async (email, code) => {
    try {
      const { data } = await api.post(`${API_URL}/verify-otp`, { email, code });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Email verified! Redirecting...');
      return { success: true };
    } catch (error) {
      const message = error.code === 'ECONNABORTED'
        ? 'Server is waking up, please try again in a moment.'
        : error.response?.data?.message || 'Verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Signed out.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOtp, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
