# Servicio Web — Registro, Login y Dashboard (UFPS 2026)

Aplicación full-stack que **crea y consume un servicio web REST**.

## 🌐 Desplegado en producción

| Componente | URL |
|-----------|-----|
| **Frontend (Angular)** | https://frontend-five-rose-76.vercel.app |
| **Backend / servicio web (Node)** | https://ufps-backend.onrender.com |
| **Repositorio** | https://github.com/carlosalejandroqm/ufps-servicios-web |

> Frontend en **Vercel**, backend en **Render** (free tier). El backend en Render
> "duerme" tras ~15 min de inactividad: la primera petición puede tardar ~30–50 s
> en despertar; luego responde normal. `CORS_ORIGIN=*` (auth por token Bearer).
> Nota: en el free tier de Render el disco es efímero, así que los datos de SQLite
> se reinician en cada redeploy/despertar.

- **Backend (servicio web):** Java 21 + Spring Boot 3.4.3 + Spring Data JPA + MySQL + Spring Security & JWT + Gradle / Maven.
- **Frontend (consumidor):** Angular 18 (componentes standalone).

## Funcionalidades

1. ✅ Registro de usuarios (`POST /api/auth/register`).
2. ✅ Login de usuarios con token JWT (`POST /api/auth/login`).
3. ✅ Dashboard que muestra los usuarios que han iniciado sesión con éxito y
   permite escribir/guardar un **mensaje de bienvenida** personalizado.
4. ✅ Rutas protegidas: el dashboard exige token válido.

---

## Estructura del proyecto

```
UFPS 2026/
├── backend/                 # Servicio web REST (Node/Express)
│   ├── src/
│   │   ├── server.js        # Punto de entrada
│   │   ├── db.js            # Base de datos SQLite (un solo archivo)
│   │   ├── middleware/auth.js   # JWT: firmar y verificar
│   │   └── routes/
│   │       ├── auth.js      # register / login / me
│   │       └── dashboard.js # logged-users / welcome-message
│   └── .env.example
└── frontend/                # Cliente Angular
    └── src/app/
        ├── core/            # servicios, guard e interceptor HTTP
        └── pages/           # login, register, dashboard
```

---

## Cómo ejecutar en local

Necesitas **Node.js 18+**. Abre **dos terminales**.

### 1) Backend (servicio web)

```bash
cd backend
cp .env.example .env      # y edita JWT_SECRET
npm install
npm run dev               # http://localhost:3000
```

La base de datos se crea sola en `backend/data.sqlite` (no requiere instalar nada).

### 2) Frontend (Angular)

```bash
cd frontend
npm install
npm start                 # http://localhost:4200
```

Abre <http://localhost:4200>, regístrate, inicia sesión y entra al dashboard.

---

## API del servicio web

| Método | Ruta                              | Auth | Descripción                         |
|--------|-----------------------------------|------|-------------------------------------|
| POST   | `/api/auth/register`              | No   | Registrar usuario                   |
| POST   | `/api/auth/login`                 | No   | Iniciar sesión → devuelve JWT       |
| GET    | `/api/auth/me`                    | Sí   | Datos del usuario autenticado       |
| GET    | `/api/dashboard/logged-users`     | Sí   | Usuarios con login exitoso          |
| PUT    | `/api/dashboard/welcome-message`  | Sí   | Guardar mensaje de bienvenida       |

Autenticación por header: `Authorization: Bearer <token>`.

---

## Despliegue GRATIS (recomendaciones)

### Opción recomendada (la más sencilla)

| Parte     | Servicio                | Notas                                                        |
|-----------|-------------------------|-------------------------------------------------------------|
| Frontend  | **Vercel** o **Netlify**| Sube la carpeta `frontend`, build `ng build`, publica `dist/frontend/browser`. |
| Backend   | **Render** (Free Web Service) | Deploy directo desde GitHub. Comando: `npm start`.    |
| Base datos| **SQLite** (incluida)   | Perfecta para la demo/entrega.                              |

Pasos para el frontend en Vercel/Netlify:
1. Cambia `frontend/src/app/core/api.config.ts` → `API_URL` a la URL pública del backend (ej: `https://tu-backend.onrender.com/api`).
2. En el backend, ajusta `CORS_ORIGIN` a la URL pública del frontend.
3. Build command: `ng build` · Output directory: `dist/frontend/browser`.

> ⚠️ **Importante sobre SQLite en la nube gratis:** en Render (plan free) el disco
> es **efímero**: los datos se reinician cuando el servicio se duerme o se
> redespliega. Es aceptable para una demo/entrega. Si necesitas **persistencia
> real gratis**, tienes dos caminos fáciles:
>
> - **Fly.io** + un *volume* (persiste el archivo SQLite), o
> - Migrar a un **Postgres gratis** (Neon o Supabase). El código está separado en
>   `db.js`, así que solo cambiarías esa capa.

### Alternativas 100% gratuitas y persistentes

| Necesidad                     | Mejor opción gratis           |
|-------------------------------|-------------------------------|
| Base de datos persistente     | **Neon** o **Supabase** (Postgres) |
| Backend con disco persistente | **Fly.io** (volume)           |
| Frontend estático             | **Vercel**, **Netlify**, **GitHub Pages** |

---

## Notas de seguridad (buenas prácticas incluidas)

- Contraseñas hasheadas con **bcrypt** (nunca se guardan en texto plano).
- Autenticación con **JWT** firmado (expira en 2h).
- CORS configurable por variable de entorno.
- El hash de la contraseña nunca se envía al frontend.
