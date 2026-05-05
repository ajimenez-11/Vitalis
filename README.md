# Vitalis — Docker (Desenvolupament Local i Servidor)

## Estructura del repositori
```
vitalis/
├── docker-compose.yml
├── .env              ← el teu .env real (NO es puja a GitHub)
├── .env.example      ← plantilla sense credencials (SÍ es puja a GitHub)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env              ← el teu .env real de Laravel (NO es puja a GitHub)
│   ├── .env.example      ← plantilla sense credencials (SÍ es puja a GitHub)
│   └── ... (codi Laravel)
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    └── ... (codi React)
```
---

## Primers passos en local (només la primera vegada)

### 1. Clona el repositori
```bash
git clone https://github.com/el-teu-usuari/vitalis.git
cd vitalis
```

### 2. Crea el fitxer d'entorn de Docker
```bash
cp .env.example .env
```
Edita `.env` i omple les credencials:
```env
APP_KEY=
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
DB_ROOT_PASSWORD=root_pass
VITE_API_URL=http://localhost:8000/api
```

### 3. Crea el fitxer d'entorn del backend
```bash
cp backend/.env.example backend/.env
```
Edita `backend/.env` i omple les credencials:
```env
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
```
> El `APP_KEY` es generarà automàticament quan arranqui el contenidor.

### 4. Arranca tots els serveis
```bash
docker compose up --build
```
La primera vegada tarda uns minuts perquè:
- Descarrega les imatges de PHP, Node i MySQL
- Executa `composer install`
- Executa les migracions i seeders de Laravel

---

## Desplegament en servidor

### 1. Connecta't al servidor per SSH
```bash
ssh usuari@ip-del-servidor
```

### 2. Clona el repositori
```bash
git clone https://github.com/el-teu-usuari/vitalis.git
cd vitalis
```

### 3. Crea el fitxer d'entorn de Docker
```bash
cp .env.example .env
```
Edita `.env` amb les dades del servidor:
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
DB_ROOT_PASSWORD=root_pass
VITE_API_URL=http://IP-DEL-SERVIDOR:8000/api
```
> Substitueix `IP-DEL-SERVIDOR` per la IP real del servidor.

### 4. Crea el fitxer d'entorn del backend
```bash
cp backend/.env.example backend/.env
```
Edita `backend/.env`:
```env
APP_ENV=production
APP_DEBUG=false
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
```

### 5. Arranca els serveis en segon pla
```bash
docker compose up --build -d
```

### URLs en el servidor
| Servei   | URL                          |
|----------|------------------------------|
| Frontend | http://IP-DEL-SERVIDOR:5173  |
| API      | http://IP-DEL-SERVIDOR:8000  |

---

## URLs en local
| Servei   | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| API      | http://localhost:8000  |
| MySQL    | localhost:3307         |

Credencials MySQL per connectar amb TablePlus o DBeaver:
| Camp     | Valor         |
|----------|---------------|
| Host     | localhost     |
| Port     | 3307          |
| Database | vitalis       |
| User     | vitalis_user  |
| Password | vitalis_pass  |

---

## Comandes del dia a dia
```bash
# Arrancar en segon pla (sense veure logs)
docker compose up -d
# Veure logs de tots els serveis
docker compose logs -f
# Veure logs només del backend
docker compose logs -f backend
# Veure logs només del frontend
docker compose logs -f frontend
# Aturar tots els serveis
docker compose down
# Aturar i eliminar la base de dades (compte! es perden les dades)
docker compose down -v
# Reconstruir les imatges (després de canviar un Dockerfile)
docker compose up --build
```

### Comandes Artisan (Laravel)
```bash
# Executar migracions
docker compose exec backend php artisan migrate
# Executar seeders
docker compose exec backend php artisan db:seed
# Crear un nou model
docker compose exec backend php artisan make:model NomModel -m
# Llistat de rutes de l'API
docker compose exec backend php artisan route:list
# Netejar caché
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
```

### Comandes npm (React)
```bash
# Instal·lar un nou paquet
docker compose exec frontend npm install nom-paquet
# Executar linter
docker compose exec frontend npm run lint
```

---

## Solució de problemes freqüents

**Error de permisos a Laravel (storage / cache)**
```bash
docker compose exec backend chmod -R 775 storage bootstrap/cache
```

**El backend no connecta amb la base de dades**
→ Verifica que `DB_HOST=db` al teu `backend/.env` (no `127.0.0.1`).

**Canvis al codi no es reflecteixen**
```bash
docker compose restart backend
# o
docker compose restart frontend
```

**Vull resetejat la base de dades des de zero**
```bash
docker compose down -v
docker compose up --build
```

**Error `APP_KEY` buit**
```bash
docker compose exec backend php artisan key:generate
```

**El frontend no connecta amb el backend en el servidor**
→ Verifica que `VITE_API_URL` al `.env` de l'arrel té la IP correcta del servidor i no `localhost`.
→ Verifica que `allowed_origins` a `backend/config/cors.php` inclou la URL del frontend del servidor.