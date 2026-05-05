import api from './client';
export const getProveidors = () => api.get('/proveidors');
export const getProveidor = (id) => api.get(`/proveidors/${id}`);
export const createProveidor = (data) => api.post('/proveidors', data);
export const updateProveidor = (id, d) => api.put(`/proveidors/${id}`, d);
export const deleteProveidor = (id) => api.delete(`/proveidors/${id}`);