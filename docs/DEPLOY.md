# Guia de Desplegament — Vitalis

Aquesta guia cobreix el desplegament en local, el desplegament manual en un servidor i el desplegament automàtic via CI/CD amb GitHub Actions.

---

## 🐳 Arquitectura de contenidors

El projecte s'executa íntegrament amb Docker Compose. Tres serveis:

| Servei | Imatge | Port exposat |
|--------|--------|--------------|
| frontend | Node (build Vite) | 5173 |
| backend | PHP 8.3 + Laravel | 8000 |
| db | MySQL 8 | 3307 |

---

## 💻 Desplegament en Local (Desenvolupament)

### 1. Clonar el repositori

```bash
git clone https://github.com/ajimenez-11/vitalis.git
cd vitalis
```

### 2. Crear els fitxers d'entorn

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Edita `.env` amb les següents variables:

```env
APP_ENV=local
APP_DEBUG=true
APP_KEY=
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
DB_ROOT_PASSWORD=root_pass
VITE_API_URL=http://localhost:8000/api
```

Edita `backend/.env` i assegura't que les credencials de base de dades coincideixen:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
```

### 3. Construir i aixecar els contenidors

```bash
docker compose up --build -d
```

> El contenidor de backend ja executa automàticament `key:generate`, `migrate` i `db:seed` en arrencar. No cal cap pas manual addicional.

### 4. Accedir a l'aplicació

```
http://localhost:5173
```

---

## 🌐 Desplegament Manual en Servidor

### 1. Clonar el repositori

```bash
git clone https://github.com/ajimenez-11/vitalis.git
cd vitalis
```

### 2. Crear els fitxers d'entorn

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Edita `.env` amb les següents variables (substitueix `IP-DEL-SERVIDOR` per la IP real del servidor):

```env
APP_ENV=production
APP_DEBUG=false
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
DB_ROOT_PASSWORD=root_pass
VITE_API_URL=http://IP-DEL-SERVIDOR:8000/api
```

Edita `backend/.env` i assegura't que les credencials de base de dades coincideixen:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=vitalis
DB_USERNAME=vitalis_user
DB_PASSWORD=vitalis_pass
```

### 3. Configurar CORS ⚠️

Cal afegir la IP del servidor a `backend/config/cors.php` **abans** d'aixecar els contenidors. Sense aquest pas, el navegador bloquejarà totes les crides a l'API.

```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://IP-DEL-SERVIDOR:5173',   // ← afegeix la teva IP aquí
],
```

### 4. Construir i aixecar els contenidors

```bash
docker compose up --build -d
```

> El contenidor de backend ja executa automàticament `key:generate`, `migrate` i `db:seed` en arrencar. No cal cap pas manual addicional.

### 5. Accedir a l'aplicació

```
http://IP-DEL-SERVIDOR:5173
```

---

## 🔐 Configuració de la Clau SSH per a GitHub Actions

Abans de configurar el CI/CD, cal crear una parella de claus SSH dedicada per permetre que GitHub Actions es connecti al servidor de forma segura.

> Tots els passos següents s'executen **al servidor**, connectat per SSH com a l'usuari de deploy (ex: `proj5`).

### 1. Generar la parella de claus

```bash
ssh-keygen -t ed25519 -C "github-actions-vitalis" -f ~/.ssh/github_actions
```

Quan demani contrasenya (`passphrase`), prem **Enter** dues vegades per deixar-la buida — és necessari perquè GitHub Actions pugui connectar-se sense interacció manual.

Això genera dos fitxers:

| Fitxer | Contingut |
|--------|-----------|
| `~/.ssh/github_actions` | Clau **privada** → anirà al secret de GitHub |
| `~/.ssh/github_actions.pub` | Clau **pública** → s'afegeix al servidor |

### 2. Autoritzar la clau pública al servidor

```bash
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Copiar la clau privada

Mostra el contingut de la clau privada per copiar-lo:

```bash
cat ~/.ssh/github_actions
```

Copia **tot** el contingut, incloent les línies `-----BEGIN OPENSSH PRIVATE KEY-----` i `-----END OPENSSH PRIVATE KEY-----`.

### 4. Afegir la clau privada com a secret a GitHub

1. Ves al repositori a GitHub.
2. **Settings → Secrets and variables → Actions → New repository secret**.
3. Nom: `SERVER_SSH_KEY`.
4. Valor: enganxa el contingut complet de la clau privada.

### 5. Verificar que la connexió funciona (opcional però recomanat)

Des de la teva màquina local, comprova que la clau permet connectar-se:

```bash
ssh -i ~/.ssh/github_actions usuari@IP-DEL-SERVIDOR
```

Si entres sense demanar contrasenya, la configuració és correcta.

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

### Configurar el Self-hosted Runner

El workflow utilitza `runs-on: self-hosted`, de manera que cal tenir un runner de GitHub Actions instal·lat al servidor. Per configurar-lo:

1. Ves a **Settings → Actions → Runners → New self-hosted runner** al repositori de GitHub.
2. Segueix les instruccions per al sistema operatiu del servidor (Linux).
3. Assegura't que el runner s'executa com a servei per sobreviure reinicis:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```