import api from './client';
export const getUsuaris = () => api.get('/usuaris');
export const getUsuari = (id) => api.get(`/usuaris/${id}`);
export const createUsuari = (data) => api.post('/usuaris', data);
export const updateUsuari = (id, d) => api.put(`/usuaris/${id}`, d);
export const deleteUsuari = (id) => api.delete(`/usuaris/${id}`);
export const toggleUsuari = (id) => api.post(`/usuaris/${id}/toggle`);