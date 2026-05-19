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

---

## 6. Model de dades

El sistema treballa amb les entitats següents:

### Entitats principals

| Entitat | Descripció |
|---------|------------|
| `User` | Usuaris del sistema |
| `Proveidor` | Proveïdors de mercaderia |
| `Producte` | Catàleg de productes amb estoc actual i estoc mínim |
| `Albaran` | Albarà d'entrada de mercaderia |
| `LiniaAlbaran` | Cada línia d'un albarà: producte, quantitat i preu |
| `Lot` | Lots associats a una línia d'albarà |
| `Recepta` | Recepta amb nom, descripció i porcions base |
| `LiniaRecepta` | Ingredients d'una recepta amb quantitat per porció |
| `ReceptaConsum` | Registre de cada vegada que s'ha produït una recepta |
| `MovimentStock` | Registre de tots els moviments d'estoc |

### Detall de camps i relacions

#### `User`
- **Camps:** `id`, `nom`, `email`, `password`, `rol` (`admin` \| `responsable_cuina` \| `cuiner`), `actiu`
- **Relacions:** hasMany `Albaran`, `Recepta`, `ReceptaConsum`, `MovimentStock`

#### `Proveidor`
- **Camps:** `id`, `nom`, `nif`, `telefon`, `email`, `adreca`
- **Relacions:** hasMany `Albaran`

#### `Producte`
- **Camps:** `id`, `nom`, `unitat_mesura`, `estoc_actual` decimal(10,3), `estoc_minim` decimal(10,3)
- **Relacions:** hasMany `LiniaAlbaran`, `LiniaRecepta`, `MovimentStock`

#### `Albaran`
- **Camps:** `id`, `proveidor_id`, `usuari_id`, `data`, `estat` (`esborrany` \| `confirmat`), `observacions`
- **Relacions:** belongsTo `Proveidor`, `User` — hasMany `LiniaAlbaran`

#### `LiniaAlbaran`
- **Camps:** `id`, `albaran_id`, `producte_id`, `quantitat` decimal(10,3), `preu_unitari` decimal(10,4)
- **Relacions:** belongsTo `Albaran`, `Producte` — hasMany `Lot`

#### `Lot`
- **Camps:** `id`, `linia_albaran_id`, `numero_lot`, `quantitat` decimal(10,3), `data_caducitat`
- **Relacions:** belongsTo `LiniaAlbaran` — hasMany `MovimentStock`

#### `Recepta`
- **Camps:** `id`, `usuari_id`, `nom`, `descripcio`, `porcions_base`, `imatge`
- **Relacions:** belongsTo `User` — hasMany `LiniaRecepta`, `ReceptaConsum`

#### `LiniaRecepta`
- **Camps:** `id`, `recepta_id`, `producte_id`, `quantitat_per_porcio` decimal(10,4), `temperatura_coccio` decimal(5,2)
- **Relacions:** belongsTo `Recepta`, `Producte`

#### `ReceptaConsum`
- **Camps:** `id`, `recepta_id`, `usuari_id`, `porcions`, `data`, `observacions`
- **Relacions:** belongsTo `Recepta`, `User` — hasMany `MovimentStock`
- **Automàtica:** Genera automàticament un `MovimentStock` de sortida per a cada ingredient en crear-se

#### `MovimentStock`
- **Camps:** `id`, `producte_id`, `lot_id` (nullable), `usuari_id`, `recepta_consum_id` (nullable), `tipus` (`entrada` \| `sortida` \| `ajust`), `quantitat` decimal(10,3), `data`, `observacions`
- **Relacions:** belongsTo `Producte`, `Lot`, `User`, `ReceptaConsum`

### Relacions clau

```
Proveidor (1) ──── (N) Albaran (1) ──── (N) LiniaAlbaran
                                                 │
                                        (1) Producte ◄──── (N) LiniaRecepta
                                                 │                   │
                                        (N) Lot  │           (1) Recepta
                                                 │                   │
                                    (N) MovimentStock ◄── (1) ReceptaConsum
```

La traçabilitat funciona amb la cadena: `Lot → LiniaAlbaran → Albaran → Proveïdor`.

Quan es confirma un albarà, el sistema genera automàticament moviments d'entrada (`MovimentStock`) i actualitza l'`estoc_actual` de cada producte.

Quan es registra el consum d'una recepta, el sistema genera moviments de sortida per cada ingredient proporcionalment a les porcions indicades.

---

## 7. API REST — Endpoints principals

L'API utilitza autenticació via token Sanctum. Totes les rutes (excepte `/login`) requereixen el header:
```
Authorization: Bearer {token}
```

### Autenticació

| Mètode | Ruta | Descripció |
|--------|------|-----------|
| POST | `/api/login` | Iniciar sessió. Retorna token |
| POST | `/api/logout` | Tancar sessió |
| GET | `/api/me` | Obtenir usuari autenticat |

### Productes

| Mètode | Ruta | Rols |
|--------|------|------|
| GET | `/api/productes` | admin, responsable_cuina, cuiner |
| GET | `/api/productes/{id}` | admin, responsable_cuina, cuiner |
| POST | `/api/productes` | admin, responsable_cuina |
| PUT | `/api/productes/{id}` | admin, responsable_cuina |
| DELETE | `/api/productes/{id}` | admin, responsable_cuina |

### Albarans

| Mètode | Ruta | Descripció |
|--------|------|-----------|
| GET | `/api/albarans` | Llistat d'albarans |
| POST | `/api/albarans` | Crear albarà (estat: esborrany) |
| POST | `/api/albarans/{id}/confirmar` | Confirmar albarà i actualitzar estoc |
| POST | `/api/albarans/{id}/esborrany` | Tornar a esborrany |
| POST | `/api/albarans/{id}/linies` | Afegir línia a un albarà |
| POST | `/api/linies-albaran/{id}/lots` | Afegir lot a una línia |

### Estoc i traçabilitat

| Mètode | Ruta | Descripció |
|--------|------|-----------|
| GET | `/api/stock` | Estoc actual de tots els productes |
| POST | `/api/stock/sortida` | Registrar sortida manual |
| POST | `/api/stock/ajust` | Ajustar estoc (admin/responsable) |
| GET | `/api/tracabilitat/lot/{numero}` | Traçabilitat d'un lot concret |
| GET | `/api/lots/proxims-caducitat` | Lots a punt de caducar |

### Receptes i consums

| Mètode | Ruta | Descripció |
|--------|------|-----------|
| GET | `/api/receptes` | Llistat de receptes |
| POST | `/api/receptes` | Crear recepta |
| POST | `/api/receptes/{id}/consum` | Registrar consum (descompta estoc) |
| GET | `/api/receptes/{id}/consums` | Historial de produccions |

