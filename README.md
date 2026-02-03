# LODO Map - Agrotech ecosystem

**Full-Stack Project (Go + React)**

Este proyecto es un mapeo interactivo del ecosistema Agrotech, permitiendo filtrar startups por pa�s, sector, etapa y m�s. Incluye autenticaci�n (login/registro) y panel de administraci�n para usuarios con rol admin.

## Tecnolog�as

- **Backend**: Go (API REST) + MariaDB
- **Frontend**: React + Vite + TailwindCSS + Shadcn/UI
- **Infraestructura**: CI/CD con GitHub Actions

## Desarrollo Local

### Requisitos

- Go 1.22+
- Node.js 18+
- MySQL / MariaDB

### Configuraci�n

1. Clona el repositorio.
2. Configura el archivo `.env` en el backend bas�ndote en `.env.example`.
3. Configura el archivo `.env` en el frontend (`frontend/.env`) con los IDs de EmailJS.
4. Crea la base de datos y corre las migraciones SQL (ver abajo).

### Base de datos

1. Crea la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS lodo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lodo_db;
```

2. Ejecuta las migraciones en orden (en `backend/migrations/`):

- `001_init.sql` ? tablas organizations y audit_logs
- `002_add_lat_lng.sql` ? columnas lat/lng
- `003_word_fields.sql` ? campos adicionales (description, year_founded, etc.)
- `004_taxonomies.sql` ? tabla taxonomies y datos iniciales
- **`005_users.sql`** ? tabla de usuarios y login

3. **Usuarios (autenticaci�n)**  
   La migraci�n `005_users.sql` crea la tabla `users` y un usuario administrador por defecto:

   - **Email:** `admin@lodo.com`
   - **Password:** `admin123`  
   Solo los usuarios con rol `admin` pueden acceder al panel de administraci�n y agregar/editar organizaciones.

### Ejecuci�n

- **Backend**: `cd backend && go run cmd/api/main.go`
- **Frontend**: `cd frontend && npm install && npm run dev`

### Email (EmailJS)

En `frontend/.env`:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

---

_Desarrollado con ?? para el ecosistema Agrotech._
