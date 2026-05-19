# Vitalis | **Antonio Jiménez & David Moya**
Aplicació web per a la gestió d'albarans i estoc en cuines professionals i empreses de càtering. Digitalitza i centralitza la recepció de mercaderia, el control d'estoc en temps real, la traçabilitat per lots i la gestió de receptes amb descàrrega automàtica d'estoc.

---

## 🚀 Funcionalitats Principals

- **Gestió d'Albarans:** Registre digital d'entrades de mercaderia associades a proveïdors, amb confirmació que actualitza l'estoc automàticament.
- **Control d'Estoc en Temps Real:** Consulta de l'estoc actual de cada producte amb alertes visuals quan es troba per sota del mínim.
- **Traçabilitat per Lots:** Cada línia d'albaran registra número de lot i data de caducitat. Permet rastrejar l'origen d'un ingredient fins al proveïdor.
- **Gestió de Receptes:** CRUD de receptes amb llista d'ingredients per porció. En registrar un consum, el sistema genera automàticament els moviments de sortida d'estoc.
- **Autenticació i Rols:** Sistema de rols diferenciat (administrador, responsable de cuina, cuiner) amb tokens JWT via Laravel Sanctum.
- **Gestió d'Usuaris (Admin):** Creació, edició i desactivació de comptes d'usuari.
- **Moviments Manuals:** Registre de sortides, ajustos i pèrdues d'estoc amb impacte automàtic.

---

## 🛠️ Stack Tècnic

- **Backend:** Laravel 11 + API REST
- **Frontend:** React + Tailwind CSS
- **Base de Dades:** MySQL 8
- **Autenticació:** Laravel Sanctum (JWT)
- **Infraestructura:** Docker + Docker Compose
- **CI/CD:** GitHub Actions + Self-hosted Runner
- **Eines:** Eloquent ORM, Migracions, Seeders, Form Requests

---

## 📦 Instal·lació

### Prerequisits
- Docker i Docker Compose instal·lats a la màquina.

### Passos

1. **Clonar el repositori:**
```bash
   git clone https://github.com/ajimenez-11/vitalis.git
   cd vitalis
```

2. **Crear els fitxers d'entorn:**
```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
```
   Edita `.env` amb les credencials:
```env
   DB_DATABASE=vitalis
   DB_USERNAME=vitalis_user
   DB_PASSWORD=vitalis_pass
   DB_ROOT_PASSWORD=root_pass
   VITE_API_URL=http://localhost:8000/api        # En local
   # VITE_API_URL=http://IP-DEL-SERVIDOR:8000/api  # En servidor
```

3. **Construir i aixecar els contenidors:**
```bash
   docker compose up --build -d
```
   > La primera vegada tarda uns minuts. Les migracions s'executen automàticament. Els seeders només s'executen si la base de dades està buida.

4. **Accés a l'aplicació:** http://localhost:5173

---

## 🖥️ Ports Utilitzats

| Port | Servei |
|------|--------|
| 5173 | Frontend React |
| 8000 | API Laravel |
| 3307 | MySQL (accessible externament per a eines com TablePlus o DBeaver) |

---

## 🔑 Credencials de Prova

| Rol | Email | Contrasenya |
|-----|-------|-------------|
| Administrador | admin@vitalis.com | password |
| Responsable de Cuina | capcuina@vitalis.com | password |
| Cuiner | cuiner@vitalis.com | password |

---

## 🌐 Desplegament en Servidor

### ⚠️ Configuració CORS obligatòria

Si desplegueu en una IP diferent de `localhost` o `172.20.2.205`, cal afegir la IP del servidor a `backend/config/cors.php` **abans** d'aixecar els contenidors:

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://172.20.2.205:5173',
    'http://IP-DEL-SERVIDOR:5173',   // ← afegeix la teva IP aquí
],
```

> Sense aquest pas, el navegador bloquejarà totes les crides a l'API per política CORS.

### Passos de desplegament manual

```bash
# 1. Clonar el repositori
git clone https://github.com/ajimenez-11/vitalis.git
cd vitalis

# 2. Crear els fitxers d'entorn
cp .env.example .env
cp backend/.env.example backend/.env
# Editar .env amb les següents variables (substitueix IP-DEL-SERVIDOR per la IP real):
APP_ENV=production
APP_DEBUG=false
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
DB_ROOT_PASSWORD=root_pass
VITE_API_URL=http://IP-DEL-SERVIDOR:8000/api

# 3. Afegir la IP a backend/config/cors.php (vegeu apartat anterior)

# 4. Construir i aixecar els contenidors en segon pla
docker compose up --build -d
```

Accés a l'aplicació: `http://IP-DEL-SERVIDOR:5173`

---

## 🔄 CI/CD — Deploy Automàtic

Cada `push` a la branca `develop` llança automàticament el deploy al servidor via GitHub Actions.

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy a Servidor

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    name: Deploy via SSH
    runs-on: self-hosted

    steps:
      - name: Checkout codi
        uses: actions/checkout@v4

      - name: Deploy al servidor
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            set -e
            echo "📁 Accedint al directori del projecte..."
            cd /home/${{ secrets.SERVER_USER }}/Vitalis
            echo "⬇️  Baixant canvis de develop..."
            git fetch origin
            git reset --hard origin/develop
            echo "🐳 Reconstruint i reiniciant contenidors..."
            docker compose down
            docker compose up --build -d
            echo "⏳ Esperant que el backend estigui sa..."
            sleep 20
            echo "🗃️  Executant migracions..."
            docker compose exec -T backend php artisan migrate --force
            echo "🧹 Netejant caché..."
            docker compose exec -T backend php artisan cache:clear
            docker compose exec -T backend php artisan config:clear
            echo "✅ Deploy completat correctament!"
```

### Secrets necessaris a GitHub

Afegeix-los a: **Settings → Secrets and variables → Actions**

| Secret | Valor |
|--------|-------|
| `SERVER_HOST` | IP del servidor |
| `SERVER_USER` | Usuari SSH (ex: `proj5`) |
| `SERVER_SSH_KEY` | Clau privada SSH (`~/.ssh/github_actions`) |
| `SERVER_PORT` | Port SSH (normalment `22`) |

---

## 📂 Model de Dades

- **User:** id, nom, email, password, rol (admin | responsable_cuina | cuiner), actiu
  Relacions: `hasMany` Albaran, Recepta, ReceptaConsum, MovimentStock.

- **Proveidor:** id, nom, nif, telefon, email, adreca
  Relació: `hasMany` Albaran.

- **Producte:** id, nom, unitat_mesura, estoc_actual `decimal(10,3)`, estoc_minim `decimal(10,3)`
  Relacions: `hasMany` LiniaAlbaran, LiniaRecepta, MovimentStock.

- **Albaran:** id, proveidor_id, usuari_id, data, estat (esborrany | confirmat), observacions
  Relacions: `belongsTo` Proveidor, User — `hasMany` LiniaAlbaran.

- **LiniaAlbaran:** id, albaran_id, producte_id, quantitat `decimal(10,3)`, preu_unitari `decimal(10,4)`
  Relacions: `belongsTo` Albaran, Producte — `hasMany` Lot.

- **Lot:** id, linia_albaran_id, numero_lot, quantitat `decimal(10,3)`, data_caducitat
  Relacions: `belongsTo` LiniaAlbaran — `hasMany` MovimentStock.

- **Recepta:** id, usuari_id, nom, descripcio, porcions_base, imatge
  Relacions: `belongsTo` User — `hasMany` LiniaRecepta, ReceptaConsum.

- **LiniaRecepta:** id, recepta_id, producte_id, quantitat_per_porcio `decimal(10,4)`, temperatura_coccio `decimal(5,2)`
  Relacions: `belongsTo` Recepta, Producte.

- **ReceptaConsum:** id, recepta_id, usuari_id, porcions, data, observacions
  Relacions: `belongsTo` Recepta, User — `hasMany` MovimentStock.
  En crear-se, genera automàticament un `MovimentStock` de sortida per a cada ingredient de la recepta.

- **MovimentStock:** id, producte_id, lot_id *(nullable)*, usuari_id, recepta_consum_id *(nullable)*, tipus (entrada | sortida | ajust), quantitat `decimal(10,3)`, data, observacions
  Relacions: `belongsTo` Producte, Lot, User, ReceptaConsum.