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
