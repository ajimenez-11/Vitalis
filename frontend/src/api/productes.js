import api from './client';
export const getProductes = () => api.get('/productes');
export const getProducte = (id) => api.get(`/productes/${id}`);
export const createProducte = (data) => api.post('/productes', data);
export const updateProducte = (id, d) => api.put(`/productes/${id}`, d);
export const deleteProducte = (id) => api.delete(`/productes/${id}`);