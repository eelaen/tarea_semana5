# Task Manager API

API RESTful segura para gestionar usuarios y tareas, con autenticación JWT.

**Stack:** Node.js · Express · Sequelize · MySQL · bcrypt · JSON Web Tokens

## Instalación

1. Clonar e instalar dependencias:
   ```bash
   git clone https://github.com/eelaen/tarea_semana5.git
   cd proyecto-task-manager-api
   npm install
   ```
2. Crear la base de datos (elige una opción):
   - **Opción A:** ejecutar el script `database/schema.sql` en MySQL.
   - **Opción B:** crear solo la base (`CREATE DATABASE task_manager;`) y dejar que Sequelize cree las tablas al iniciar (`sequelize.sync()`).
3. Copiar `.env.example` a `.env` y completar los valores.
4. Iniciar:
   ```bash
   npm run dev     # con nodemon
   npm start       # normal
   ```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_NAME` | Nombre de la base | `task_manager` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `tu_password` |
| `JWT_SECRET` | Secreto para firmar tokens | cadena larga aleatoria |
| `JWT_EXPIRES_IN` | Duración del token | `1h` |

## Autenticación

Las rutas `/api/tasks` requieren el header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth (públicos)

| Método | Endpoint | Body | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | `name`, `email`, `password` | 201 usuario creado |
| POST | `/api/auth/login` | `email`, `password` | 200 `{ token }` |

### Tasks (protegidos con JWT)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tasks` | Tareas del usuario autenticado |
| POST | `/api/tasks` | Crear tarea (`title`, `description`, `status`) |
| PUT | `/api/tasks/:id` | Actualizar tarea propia |
| DELETE | `/api/tasks/:id` | Eliminar tarea propia |

`status` acepta: `pending`, `in-progress`, `completed`.

### Códigos de respuesta

`200` OK · `201` creado · `400` datos inválidos · `401` sin token / token inválido / credenciales incorrectas · `404` tarea no encontrada (o ajena) · `409` email duplicado · `500` error interno

## Seguridad aplicada

- Contraseñas con **bcrypt** (10 salt rounds), nunca se devuelven en las respuestas.
- Middleware que verifica el JWT y guarda `req.user`.
- **Autorización:** el `userId` se toma del token y toda consulta de tareas filtra por `userId`, así un usuario no puede ver ni modificar tareas ajenas.
- Secretos y credenciales en `.env` (excluido de Git con `.gitignore`).

## Colección Postman

Importar `postman/TaskManager.postman_collection.json`. El request **Login** guarda el token automáticamente en la variable `{{token}}`, que usan los requests de Tasks.

## Capturas de pruebas

Agregar aquí las capturas (carpeta `screenshots/`):

1. Registro exitoso → `![register](screenshots/01-register.png)`
2. Login con token → `![login](screenshots/02-login.png)`
3. Crear tarea → `![create](screenshots/03-create.png)`
4. Listar tareas → `![list](screenshots/04-list.png)`
5. Actualizar tarea → `![update](screenshots/05-update.png)`
6. Eliminar tarea → `![delete](screenshots/06-delete.png)`
7. Acceso sin token (401) → `![401](screenshots/07-unauthorized.png)`
8. Intento de acceder a tarea de otro usuario (404) → `![404](screenshots/08-other-user.png)`
