// receptes
import api from './client';
export const getReceptes = () => api.get('/receptes');
export const getRecepta = (id) => api.get(`/receptes/${id}`);
export const createRecepta = (data) => api.post('/receptes', data);
export const updateRecepta = (id, d) => api.put(`/receptes/${id}`, d);
export const deleteRecepta = (id) => api.delete(`/receptes/${id}`);

// liniaRecepta
import api from './client';
export const createLiniaRecepta = (receptaId, d) => api.post(`/receptes/${receptaId}/linies`, d);
export const updateLiniaRecepta = (id, d) => api.put(`/linies-recepta/${id}`, d);
export const deleteLiniaRecepta = (id) => api.delete(`/linies-recepta/${id}`);

// consums
import api from './client';
export const registrarConsum = (receptaId, d) => api.post(`/receptes/${receptaId}/consum`, d);
export const getConsums = (receptaId) => api.get(`/receptes/${receptaId}/consums`);
export const getConsum = (id) => api.get(`/consums/${id}`);