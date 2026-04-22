import api from './client';
export const getStock = () => api.get('/stock');
export const getStockProducte = (id) => api.get(`/stock/producte/${id}`);
export const getMoviments = () => api.get('/stock/moviments');
export const getMovimentsProducte = (id) => api.get(`/stock/producte/${id}/moviments`);
export const ajustStock = (data) => api.post('/stock/ajust', data);
export const sortidaStock = (data) => api.post('/stock/sortida', data);
