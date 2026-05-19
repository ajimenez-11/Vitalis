# 📋 Documentació del Projecte — Vitalis

**Projecte — 2n DAW**
**Curs:** 2025–2026
**Autors:** Antonio Jiménez i David Moya

---

## 1. Descripció del projecte

**Vitalis** és una aplicació web de gestió d'albarans, estoc, traçabilitat i receptes per a cuines centrals i empreses de càtering. L'objectiu és substituir els fulls de càlcul i els papers físics per un sistema centralitzat accessible des de qualsevol dispositiu.

El sistema permet:
- Registrar albarans digitals en el moment de recepció de mercaderia.
- Controlar l'estoc en temps real amb alertes visuals per sota del mínim.
- Fer traçabilitat completa per número de lot (d'on ve, quan va entrar, quin proveïdor).
- Gestionar receptes i descomptar automàticament els ingredients de l'estoc en registrar un consum.

El projecte va nàixer d'un problema real: moltes cuines professionals segueixen gestionant l'estoc "a ull" o amb fulls de càlcul desactualitzats. Vitalis vol solucionar-ho amb una interfície senzilla i pràctica per al personal de cuina.

---

## 2. Tecnologies i entorn de treball

### Stack principal

| Capa | Tecnologia |
|------|------------|
| Frontend | React |
| Estils | Tailwind CSS |
| Build tool | Vite |
| Backend | Laravel (PHP) |
| Autenticació | Laravel Sanctum | 
| Base de dades | MySQL | 
| Contenidors | Docker + Docker Compose | 
| Control de versions | Git + GitHub |

### Per què hem triat aquestes tecnologies

- **React** perquè és el framework de frontend més utilitzat al sector, i ens permet construir una SPA (Single Page Application) sense recarregar la pàgina.
- **Tailwind CSS** perquè permet estilitzar ràpidament sense sortir del JSX. Molt útil per anar ràpid en el desenvolupament.
- **Laravel** perquè és un framework PHP madur, amb Eloquent ORM, sistema de migracions, seeders i un generador d'API REST molt net.
- **Laravel Sanctum** per gestionar l'autenticació via tokens (JWT-like) entre el frontend i el backend.
- **MySQL** com a base de dades relacional, perquè el model de dades del projecte és bastant relacionat (albarans → línies → lots → estoc).
- **Docker** per tenir un entorn de desenvolupament i producció idèntic sense "a mi em funciona".

## 3. Dependències del projecte

### Backend (PHP / Composer)

**Dependències de producció:**

| Paquet | Versió | Per a què serveix |
|--------|--------|-------------------|
| `laravel/framework` | ^13.0 | El framework principal |
| `laravel/sanctum` | ^4.0 | Autenticació via tokens API |
| `laravel/tinker` | ^3.0 | REPL interactiu per explorar l'app |

**Dependències de desenvolupament:**

| Paquet | Versió | Per a què serveix |
|--------|--------|-------------------|
| `fakerphp/faker` | ^1.23 | Generar dades de prova als seeders |
| `laravel/pail` | ^1.2.5 | Visor de logs en temps real |
| `laravel/pint` | ^1.27 | Formateig de codi PHP |
| `phpunit/phpunit` | ^12.5 | Tests unitaris |

### Frontend (JavaScript / npm)

**Dependències de producció:**

| Paquet | Versió | Per a què serveix |
|--------|--------|-------------------|
| `react` | ^19.2.4 | Biblioteca UI principal |
| `react-dom` | ^19.2.4 | Renderitzat al DOM |
| `react-router-dom` | ^7.14.1 | Enrutament de pàgines (SPA) |
| `react-hook-form` | ^7.73.1 | Gestió de formularis sense re-renders innecessaris |
| `react-icons` | ^5.6.0 | Icones SVG (Font Awesome, Material, etc.) |
| `axios` | ^1.15.2 | Peticions HTTP a l'API |

**Dependències de desenvolupament:**

| Paquet | Versió | Per a què serveix |
|--------|--------|-------------------|
| `vite` | ^8.0.4 | Build tool i servidor de dev |
| `@vitejs/plugin-react` | ^6.0.1 | Suport JSX i Fast Refresh |
| `tailwindcss` | ^4.2.2 | Framework CSS utilitari |
| `@tailwindcss/vite` | ^4.2.4 | Integració de Tailwind amb Vite |
| `eslint` | ^9.39.4 | Linter per detectar errors i mal codi |

---

## 4. Estructura del projecte

```
Vitalis/
├── backend/                  # Aplicació Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/      # Tots els controladors de l'API
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php   # Middleware de control de rols
│   │   └── Models/           # Models Eloquent (Producte, Albaran, Lot...)
│   ├── database/
│   │   ├── migrations/       # Creació de les taules
│   │   └── seeders/          # Dades de prova inicials
│   ├── routes/
│   │   └── api.php           # Totes les rutes de l'API REST
│   └── Dockerfile
│
├── frontend/                 # Aplicació React
│   └── src/
│       ├── api/              # Funcions per cridar l'API (una per mòdul)
│       ├── components/       # Components reutilitzables (UI)
│       ├── context/          # Context d'autenticació (AuthContext)
│       ├── hooks/            # Hooks personalitzats (useApi, useSortable)
│       ├── pages/            # Pàgines de l'aplicació
│       └── routes/           # Configuració de les rutes (AppRouter)
│
├── info_diagrames/           # Diagrames i documentació visual
│   ├── model-dades.png
│   ├── casos-d-us.png
│   └── wireframe-vitalis.jpeg
│
├── docker-compose.yml        # Orquestració dels contenidors
├── .env.example              # Variables d'entorn d'exemple
└── estudi-previ.md           # Document de disseny inicial del projecte
```
