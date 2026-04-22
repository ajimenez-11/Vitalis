import api from './client';
export const tracabilitatLot = (numero) => api.get(`/tracabilitat/lot/${numero}`);
export const tracabilitatProducte = (id) => api.get(`/tracabilitat/producte/${id}`);
