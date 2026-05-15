# Sistema de Reservas de Mesas - Comidas Rápidas The Gordo

Proyecto web desarrollado como una SPA para la gestión de reservas de mesas del restaurante **Comidas Rápidas The Gordo**.

La aplicación está construida con **React + Vite** y utiliza **Supabase** como Backend as a Service para la gestión de base de datos, autenticación y conexión con los datos del sistema. El despliegue se realiza mediante **Vercel**.

---

## Estado actual del proyecto

Actualmente el proyecto se encuentra en el **Entregable 1: Configuración inicial**.

### Avances completados

- Proyecto creado con React + Vite.
- Repositorio configurado en GitHub.
- Proyecto conectado con Supabase.
- Variables de entorno configuradas localmente.
- Proyecto desplegado correctamente en Vercel.
- Rutas base configuradas con React Router.
- Estructura inicial organizada para separar vista cliente y vista administrador.
- Servicios base creados para interactuar con Supabase.
- Hooks compartidos creados para manejar datos desde React.

---

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- Supabase
- Vercel
- JavaScript
- CSS

---

## Arquitectura general

El proyecto utiliza una arquitectura basada en **Backend as a Service**.

Esto significa que no se implementa un backend propio con Express, Node.js u otro framework de servidor. En su lugar, Supabase se encarga de proveer los servicios de backend, incluyendo:

- Base de datos PostgreSQL.
- API automática para consultar datos.
- Autenticación de usuarios.
- Políticas de seguridad mediante Row Level Security.
- Gestión de datos para mesas, reservas y horarios.

El frontend en React consume estos servicios mediante una capa de servicios ubicada en `src/services`.

---

## Estructura del proyecto

```txt
src/
├── assets/
│
├── components/
│   ├── admin/
│   ├── client/
│   └── layout/
│
├── hooks/
│   ├── useHorarios.js
│   ├── useMesas.js
│   └── useReservas.js
│
├── lib/
│   └── supabaseClient.js
│
├── pages/
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── HorariosPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MesasPage.jsx
│   │   └── ReservasPage.jsx
│   │
│   └── client/
│       ├── HomePage.jsx
│       ├── ReservationPage.jsx
│       └── ReservationSuccessPage.jsx
│
├── services/
│   ├── authService.js
│   ├── horariosService.js
│   ├── mesasService.js
│   └── reservasService.js
│
├── styles/
│
├── utils/
│   └── constants.js
│
├── App.css
├── App.jsx
├── index.css
└── main.jsx

Proyecto realizado por:
Santiago Sanchez Ribero - 01220371063
Juan Pablo Santoyo Diaz - 01220371042