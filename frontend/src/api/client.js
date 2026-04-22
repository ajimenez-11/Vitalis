import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Injecta el token automàticament a totes les peticions
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el backend retorna 401, neteja sessió i redirigeix al login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vitalis_token');
      localStorage.removeItem('vitalis_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;