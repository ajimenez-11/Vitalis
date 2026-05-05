import api from './client';

// albarans
export const getAlbarans = () => api.get('/albarans');
export const getAlbaran = (id) => api.get(`/albarans/${id}`);
export const createAlbaran = (data) => api.post('/albarans', data);
export const updateAlbaran = (id, d) => api.put(`/albarans/${id}`, d);
export const deleteAlbaran = (id) => api.delete(`/albarans/${id}`);
export const confirmarAlbaran = (id) => api.post(`/albarans/${id}/confirmar`);
export const tornarEsborrany = (id) => api.post(`/albarans/${id}/esborrany`);

// linies albaran
export const getLinies = (albaranId) => api.get(`/albarans/${albaranId}/linies`);
export const getLinia = (id) => api.get(`/linies-albaran/${id}`);
export const createLinia = (albaranId, d) => api.post(`/albarans/${albaranId}/linies`, d);
export const updateLinia = (id, d) => api.put(`/linies-albaran/${id}`, d);
export const deleteLinia = (id) => api.delete(`/linies-albaran/${id}`);
export const getLots = (liniaId) => api.get(`/linies-albaran/${liniaId}/lots`);
export const createLot = (liniaId, d) => api.post(`/linies-albaran/${liniaId}/lots`, d);
export const deleteLot = (liniaId, lotId) => api.delete(`/linies-albaran/${liniaId}/lots/${lotId}`);
