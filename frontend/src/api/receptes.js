import api from './client';

// receptes
export const getReceptes  = ()    => api.get('/receptes');
export const getRecepta   = (id)  => api.get(`/receptes/${id}`);

export const createRecepta = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') form.append(k, v);
  });
  return api.post('/receptes', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateRecepta = (id, data) => {
  const form = new FormData();

  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v === '') return; 
    form.append(k, v);  
  });

  return api.post(`/receptes/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteRecepta = (id) => api.delete(`/receptes/${id}`);

// liniaRecepta
export const createLiniaRecepta = (receptaId, d) => api.post(`/receptes/${receptaId}/linies`, d);
export const updateLiniaRecepta = (id, d) => api.put(`/linies-recepta/${id}`, d);
export const deleteLiniaRecepta = (id) => api.delete(`/linies-recepta/${id}`);

// consums
export const registrarConsum = (receptaId, d) => api.post(`/receptes/${receptaId}/consum`, d);
export const getConsums = (receptaId) => api.get(`/receptes/${receptaId}/consums`);
export const getConsum = (id) => api.get(`/consums/${id}`);