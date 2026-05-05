# Frontend Dockerfile — React + Vite (desenvolupament)
# Col·loca aquest fitxer a: frontend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copia primer els fitxers de dependències per aprofitar la caché de Docker
COPY package*.json ./

RUN npm install

# El codi complet es munta via volum (vegeu docker-compose.yml)

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
