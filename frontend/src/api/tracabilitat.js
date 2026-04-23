import api from './client';
export const tracabilitatList = () => {return api.get('/tracabilitat/lots');};
export const tracabilitatLot = (numero) => api.get(`/tracabilitat/lot/${numero}`);
export const tracabilitatProducte = (id) => api.get(`/tracabilitat/producte/${id}`);
