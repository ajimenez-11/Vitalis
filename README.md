# Vitalis — Docker (Desenvolupament Local)

## Estructura del repositori

```
vitalis/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env              ← el teu .env real (NO es puja a GitHub)
│   ├── .env.example      ← plantilla sense credencials (SÍ es puja a GitHub)
│   └── ... (codi Laravel)
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    └── ... (codi React)
```

---

## Primers passos (només la primera vegada)

### 1. Clona el repositori
```bash
git clone https://github.com/el-teu-usuari/vitalis.git
cd vitalis
```

### 2. Crea el fitxer d'entorn del backend
```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` i omple les credencials:
```env
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
```

> El `APP_KEY` es generarà automàticament quan arranqui el contenidor.

### 3. Arranca tots els serveis
```bash
docker compose up --build
```

La primera vegada tarda uns minuts perquè:
- Descarrega les imatges de PHP, Node i MySQL
- Executa `composer install`
- Executa les migracions de Laravel

---

## URLs de l'aplicació

| Servei   | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| API      | http://localhost:8000  |
| MySQL    | localhost:3306         |

Credencials MySQL per connectar amb TablePlus o DBeaver:

| Camp     | Valor         |
|----------|---------------|
| Host     | localhost     |
| Port     | 3306          |
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
→ Verifica que `DB_HOST=db` al teu `.env` (no `127.0.0.1`).

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