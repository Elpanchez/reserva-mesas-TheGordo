# Reserva Mesas The Gordo

Sistema web de reservas de mesas para el restaurante de comidas rápidas **The Gordo**. Desarrollado como Proyecto Práctico de la asignatura Configuración y Mantenimiento de Software, con React, Vite y Supabase como tecnologías principales.

---

## Descripción general

**Reserva Mesas The Gordo** es una aplicación web de página única (SPA) que digitaliza el proceso de reservas de mesas para un restaurante de comidas rápidas. El sistema permite a los clientes consultar la disponibilidad de mesas en tiempo real, seleccionar la de su preferencia y registrar una reserva indicando fecha, hora y número de personas, con validación automática de la capacidad máxima de cada mesa y de los horarios de atención vigentes.

El personal administrativo cuenta con un panel protegido por autenticación desde donde puede gestionar las mesas del restaurante, configurar los horarios de atención por día de la semana y administrar todas las reservas registradas, con opciones para marcarlas como completadas, cancelarlas o eliminarlas definitivamente.

---

## Alcance del sistema

### El sistema incluye

- Visualización de mesas con estado en tiempo real: disponible, ocupada o bloqueada.
- Reserva de mesas desde la vista cliente con formulario completo y validado.
- Validación de capacidad de personas según la mesa seleccionada.
- Validación de disponibilidad contra los horarios activos configurados por el administrador.
- Administración de mesas: crear, editar, bloquear, desbloquear y eliminar.
- Administración de horarios de atención por día de la semana.
- Administración de reservas: consultar, filtrar por fecha, estado o cliente; completar, cancelar y eliminar.
- Autenticación de administrador mediante Supabase Auth.
- Rutas protegidas para el módulo administrador.
- Diseño responsive adaptado a dispositivos móviles y de escritorio.
- Despliegue continuo en Vercel.

### El sistema no incluye

- Pasarela de pagos o cobro en línea.
- Aplicación móvil nativa.
- Integración con servicios de domicilios o delivery.
- Registro de clientes con perfil persistente o historial de reservas.
- Notificaciones automáticas por correo o SMS.
- Sistema de punto de venta (POS).
- Soporte para múltiples sucursales.

---

## Roles del sistema

| Rol | Acciones disponibles |
|---|---|
| **Cliente** | Consulta mesas disponibles, selecciona una mesa, ingresa datos personales y confirma la reserva. |
| **Administrador** | Inicia sesión, gestiona mesas y horarios, administra reservas y cierra sesión. |

---

## Funcionalidades principales

### Módulo cliente

- Visualización del listado de mesas con estado actualizado.
- Selección de mesa disponible desde la vista de salón.
- Formulario de reserva con los siguientes campos:
  - Número de personas (limitado por la capacidad máxima de la mesa seleccionada).
  - Fecha de reserva (solo fechas desde el día actual).
  - Hora de reserva (basada en horarios activos configurados por el administrador).
  - Nombre completo del cliente.
  - Número de teléfono (10 dígitos).
  - Correo electrónico.
- Validación de disponibilidad antes de confirmar la reserva.
- Página de confirmación con resumen completo de la reserva registrada.

### Módulo administrador

- Inicio de sesión con correo y contraseña mediante Supabase Auth.
- Dashboard con acceso rápido a los módulos principales y listado de reservas activas del día en curso.
- **Gestión de mesas:** crear nuevas mesas, editar datos, cambiar estado (bloquear/desbloquear) y eliminar.
- **Gestión de reservas:** filtrar por fecha, estado o datos del cliente; marcar como completada, cancelar o eliminar definitivamente.
- **Gestión de horarios:** crear rangos de atención por día de la semana, editar, activar, desactivar y eliminar horarios.
- Cierre de sesión con redirección a login.

---

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| **React 19** | Construcción de la interfaz de usuario basada en componentes. |
| **Vite 8** | Entorno de desarrollo rápido y generación del build de producción. |
| **JavaScript (ES Modules)** | Lógica de la aplicación, hooks, servicios y utilidades. |
| **CSS** | Estilos, diseño responsive y sistema visual del proyecto. |
| **React Router DOM 7** | Enrutamiento del lado del cliente y rutas protegidas. |
| **Lucide React** | Librería de íconos SVG para la interfaz de usuario. |
| **Supabase** | Backend como servicio: autenticación, API REST y base de datos. |
| **PostgreSQL** | Base de datos relacional gestionada por Supabase. |
| **Vercel** | Plataforma de despliegue y hosting de la aplicación. |
| **Git / GitHub** | Control de versiones y repositorio remoto del proyecto. |

---

## Arquitectura del sistema

El sistema sigue una arquitectura cliente-servidor desacoplada donde el frontend React consume directamente la API de Supabase, sin un servidor backend propio intermedio.

```
Usuario (Cliente o Administrador)
              |
     Navegador web
              |
  Aplicación React + Vite
  ┌───────────────────────────┐
  │  Páginas / Vistas         │
  │  Componentes de UI        │
  │  Context de autenticación │
  │  Hooks personalizados     │
  │  Capa de servicios        │
  └─────────────┬─────────────┘
                |
       Supabase Client SDK
                |
          Supabase API
         (Auth + REST)
                |
      Base de datos PostgreSQL
```

- El **frontend** gestiona rutas, estado local, validaciones y presentación visual.
- Los **hooks personalizados** (`useMesas`, `useReservas`, `useHorarios`) encapsulan la lógica de acceso a datos y el manejo de estado.
- Los **servicios** centralizan todas las llamadas a la API de Supabase para operaciones sobre mesas, reservas, horarios, autenticación y disponibilidad.
- **Supabase** provee autenticación, acceso a datos y seguridad mediante Row Level Security (RLS).

---

## Modelo de datos

### Tabla `mesas`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador único de la mesa. Clave primaria. |
| `numero` | int4 | Número identificador visible de la mesa en el salón. |
| `capacidad` | int4 | Cantidad máxima de personas admitidas en la mesa. |
| `ubicacion` | text | Zona o sector donde se encuentra la mesa. |
| `estado` | text | Estado actual: `disponible`, `ocupada` o `bloqueada`. |
| `activo` | bool | Indica si la mesa está activa en el sistema. |
| `created_at` | timestamptz | Fecha y hora de creación del registro. |
| `updated_at` | timestamptz | Fecha y hora de la última modificación. |
| `deleted_at` | timestamptz | Fecha de eliminación lógica (soft delete). |

### Tabla `reservas`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador único de la reserva. Clave primaria. |
| `mesa_id` | uuid | Referencia a la mesa reservada (`mesas.id`). Clave foránea. |
| `cliente_nombre` | text | Nombre completo del cliente que realizó la reserva. |
| `cliente_tel` | text | Número de teléfono de contacto del cliente. |
| `cliente_email` | text | Correo electrónico del cliente. |
| `fecha` | date | Fecha de la reserva. |
| `hora` | time | Hora de inicio de la reserva. |
| `num_personas` | int4 | Número de personas para las que se reserva la mesa. |
| `estado` | text | Estado actual: `activa`, `completada` o `cancelada`. |
| `duracion_minutos` | int4 | Duración estimada de la reserva expresada en minutos. |
| `created_at` | timestamptz | Fecha y hora de creación del registro. |
| `updated_at` | timestamptz | Fecha y hora de la última modificación. |

### Tabla `horarios`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador único del horario. Clave primaria. |
| `dia_semana` | int2 | Día de la semana representado numéricamente (ver convención). |
| `hora_inicio` | time | Hora de apertura del turno de atención. |
| `hora_fin` | time | Hora de cierre del turno de atención. |
| `activo` | bool | Indica si el horario está habilitado para recibir reservas. |
| `created_at` | timestamptz | Fecha y hora de creación del registro. |
| `updated_at` | timestamptz | Fecha y hora de la última modificación. |

**Convención para `dia_semana`:** 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado, 7 = Domingo.

### Relaciones entre tablas

- Una **mesa** puede tener muchas **reservas** (relación uno a muchos).
- Una **reserva** pertenece a una única **mesa**, vinculada mediante el campo `mesa_id`.
- Los **horarios** aplican de forma general al restaurante y no están vinculados a mesas ni reservas específicas.

---

## Estructura del proyecto

```
reserva-mesas-TheGordo/
├── public/
├── src/
│   ├── assets/                     # Recursos estáticos (logo del restaurante)
│   ├── components/
│   │   ├── client/                 # Componentes específicos de la vista cliente
│   │   │   └── TableCard.jsx           # Tarjeta de presentación de cada mesa
│   │   └── layout/                 # Componentes de estructura de página
│   │       ├── AdminLayout.jsx         # Layout del panel admin: sidebar + área de contenido
│   │       ├── ClientLayout.jsx        # Layout de la vista cliente: header + área de contenido
│   │       └── ProtectedRoute.jsx      # Guard de ruta para el módulo administrador
│   ├── context/
│   │   └── AuthContext.jsx         # Contexto global de autenticación y sesión
│   ├── hooks/                      # Hooks personalizados para lógica de datos
│   │   ├── useMesas.js                 # Operaciones sobre mesas
│   │   ├── useReservas.js              # Operaciones sobre reservas
│   │   └── useHorarios.js              # Operaciones sobre horarios
│   ├── lib/
│   │   └── supabaseClient.js       # Inicialización del cliente Supabase
│   ├── pages/
│   │   ├── admin/                  # Vistas del módulo administrador
│   │   │   ├── Dashboard.jsx           # Panel principal con resumen del día
│   │   │   ├── Login.jsx               # Formulario de inicio de sesión
│   │   │   ├── Mesas.jsx               # Gestión completa de mesas
│   │   │   ├── Reservas.jsx            # Gestión completa de reservas
│   │   │   └── Horarios.jsx            # Gestión completa de horarios
│   │   └── client/                 # Vistas de la vista cliente
│   │       ├── Home.jsx                # Salón con listado y selección de mesas
│   │       ├── Reserva.jsx             # Formulario de reserva
│   │       └── ReservaExistosa.jsx     # Confirmación de reserva exitosa
│   ├── services/                   # Capa de acceso a datos mediante Supabase
│   │   ├── authService.js              # Inicio y cierre de sesión
│   │   ├── disponibilidadService.js    # Validación de disponibilidad de mesas y horarios
│   │   ├── horariosService.js          # CRUD de horarios
│   │   ├── mesasService.js             # CRUD de mesas
│   │   └── reservasService.js          # CRUD de reservas
│   ├── styles/
│   │   └── admin.css               # Estilos específicos del módulo administrador
│   ├── utils/                      # Utilidades y constantes compartidas
│   │   ├── constants.js                # Constantes globales: estados, rutas, zonas
│   │   └── horarios.js                 # Lógica auxiliar de manejo de horarios
│   ├── App.jsx                     # Definición del árbol de rutas de la aplicación
│   ├── App.css                     # Estilos de la vista cliente
│   ├── index.css                   # Estilos globales y variables CSS personalizadas
│   └── main.jsx                    # Punto de entrada de la aplicación
├── .env                            # Variables de entorno locales (excluir del repositorio)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_del_proyecto_en_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

Estos valores se obtienen desde el panel de Supabase en **Configuración del proyecto > API**.

> **Importante:** El archivo `.env` no debe subirse al repositorio. Debe estar incluido en `.gitignore`.  
> En Vercel, configurar estas mismas variables desde el panel **Settings > Environment Variables** antes del despliegue.

---

## Instalación y ejecución local

### Requisitos previos

- Node.js 18 o superior.
- npm 9 o superior.
- Cuenta en Supabase con el proyecto y las tablas configuradas.

### Pasos

```bash
# Clonar el repositorio
git clone URL_DEL_REPOSITORIO
cd reserva-mesas-TheGordo

# Instalar dependencias
npm install

# Crear y configurar el archivo de variables de entorno
# (ver sección "Variables de entorno")

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación queda disponible por defecto en `http://localhost:5173`.

### Build de producción

```bash
npm run build
```

Genera los archivos optimizados en la carpeta `dist/`, listos para despliegue.

---

## Despliegue en Vercel

1. Conectar el repositorio de GitHub en el panel de [Vercel](https://vercel.com).
2. Vercel detecta automáticamente que el proyecto usa Vite.
3. Configurar las variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) en **Settings > Environment Variables**.
4. Vercel ejecuta `npm run build` y publica el contenido de `dist/` automáticamente.
5. Cada nuevo push a la rama principal genera un nuevo despliegue.

---

## Rutas de la aplicación

| Ruta | Módulo | Descripción |
|---|---|---|
| `/` | Cliente | Vista del salón con listado de mesas disponibles. |
| `/reservar` | Cliente | Formulario de reserva para la mesa seleccionada. |
| `/reserva-exitosa` | Cliente | Confirmación de reserva registrada exitosamente. |
| `/admin/login` | Admin | Formulario de inicio de sesión del administrador. |
| `/admin` | Admin (protegida) | Dashboard principal del panel administrador. |
| `/admin/mesas` | Admin (protegida) | Gestión de mesas del restaurante. |
| `/admin/reservas` | Admin (protegida) | Gestión de reservas de clientes. |
| `/admin/horarios` | Admin (protegida) | Gestión de horarios de atención. |

Las rutas del módulo administrador están protegidas mediante el componente `ProtectedRoute`, que redirige al login si el usuario no tiene sesión activa.

---

## Flujo de uso

### Reserva desde la vista cliente

1. El cliente accede a la vista del salón (`/`).
2. Visualiza el listado de mesas con su estado actual.
3. Selecciona una mesa con estado **disponible**.
4. Es redirigido al formulario de reserva (`/reservar`).
5. Selecciona el número de personas (hasta la capacidad máxima de la mesa), la fecha y la hora.
6. Ingresa sus datos personales: nombre, teléfono y correo.
7. El sistema valida disponibilidad en la fecha y hora indicadas.
8. Al confirmar, la reserva queda registrada y el cliente ve un resumen en la página de confirmación.

### Gestión desde el panel administrador

1. El administrador accede a `/admin/login`.
2. Ingresa con sus credenciales de Supabase Auth.
3. Es redirigido al dashboard del panel.
4. Desde el dashboard accede a mesas, reservas u horarios según la necesidad.
5. Realiza las operaciones requeridas (crear, editar, bloquear, completar, cancelar, etc.).
6. Cierra sesión al finalizar.

---

## Estado actual del proyecto

El proyecto se encuentra funcional y completo para su entrega académica final:

- Vista cliente funcional con flujo completo de reserva validado.
- Panel administrador funcional con autenticación y rutas protegidas.
- Integración completa con Supabase: base de datos, autenticación y API REST.
- Gestión de mesas con manejo de estados: disponible, ocupada, bloqueada.
- Gestión de horarios de atención por día de la semana.
- Gestión de reservas con filtros por fecha, estado y datos del cliente.
- Validación de capacidad de personas y disponibilidad de horarios en el proceso de reserva.
- Diseño visual responsive adaptado a dispositivos móviles y escritorio.
- Build de producción operativo y preparado para despliegue en Vercel.

---

## Mejoras futuras

Las siguientes funcionalidades están fuera del alcance del proyecto actual y representan posibles extensiones:

- Envío de notificaciones por correo al confirmar una reserva.
- Recordatorios automáticos antes de la hora de la reserva.
- Mapa interactivo del salón para visualizar la distribución física de las mesas.
- Perfil persistente de clientes con historial de reservas.
- Reportes y estadísticas de ocupación para el administrador.
- Integración con pasarela de pagos para reservas con anticipo.
- Soporte para múltiples sucursales o salones.
- Aplicación móvil nativa.
- Soporte multidioma.

---

## Equipo de desarrollo

| Nombre | Código estudiantil |
|---|---|
| Santiago Sanchez Ribero | 01220371063 |
| Juan Pablo Santoyo Diaz | 01220371042 |

- **Universidad de Santander — UDES**
- Facultad de Ingeniería
- Programa: Ingeniería de Software
- Asignatura: Configuración y Mantenimiento de Software

---

## Accesos admin pruebas
| Usuario | Contrasaeña |
|---|---|
| admin@thegordo.com | admin123 |
