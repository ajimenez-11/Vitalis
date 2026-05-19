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

---

## 🔑 Credencials de Prova

| Rol | Email | Contrasenya |
|-----|-------|-------------|
| Administrador | admin@vitalis.com | password |
| Responsable de Cuina | capcuina@vitalis.com | password |
| Cuiner | cuiner@vitalis.com | password |

---

## 📖 Documentació

- [Guia de desenvolupament](docs/DEVELOPMENT.md) — Entorn local, estructura del projecte i model de dades.
- [Guia de desplegament](docs/DEPLOY.md) — Docker, variables d'entorn, CORS i CI/CD.