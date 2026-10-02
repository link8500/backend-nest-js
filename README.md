# Backend NestJS

Backend REST construido con NestJS, Prisma y PostgreSQL. La aplicación administra tenants y usuarios mediante una API documentada con Swagger.

## Funcionamiento

El flujo de una petición es:

```text
Cliente HTTP
  -> Controller
  -> DTO y ValidationPipe
  -> Service
  -> PrismaService
  -> PostgreSQL en Docker
```

- Los controllers reciben las peticiones HTTP.
- Los DTOs describen y validan los datos de entrada.
- Los services contienen la lógica de la aplicación.
- `PrismaService` reutiliza la conexión con Prisma.
- PostgreSQL almacena los tenants y usuarios.
- Las contraseñas se guardan cifradas con `bcryptjs`.

## Estructura

```text
src/
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── users/
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── app.module.ts
├── app.controller.ts
└── main.ts

prisma/
├── migrations/
├── schema.prisma
└── seed.ts

docker-compose.yml
```

## Requisitos

- Node.js 22 o superior
- npm
- Docker Desktop con el motor activo

## Instalación y ejecución

Desde la carpeta `backend/nestjs`:

```powershell
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run db:up
npm run prisma:migrate:deploy
npm run prisma:seed
npm run start:dev
```

La API queda disponible en:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api
- Prisma Studio: `npm run prisma:studio`

## Base de datos

PostgreSQL se ejecuta dentro de Docker. Prisma utiliza la variable `DATABASE_URL` del archivo `.env` para conectarse a la base de datos.

El esquema contiene:

- `Tenant`: organización propietaria de los usuarios.
- `User`: usuario asociado a un tenant mediante `tenantId`.

La relación es uno a muchos: un tenant puede tener varios usuarios y cada usuario pertenece a un tenant.

## Datos iniciales

El comando `npm run prisma:seed` crea un tenant de desarrollo y dos usuarios locales:

- `admin@backend-nestjs.local` / `Admin123!`
- `user@backend-nestjs.local` / `Admin123!`

Estas credenciales son únicamente para desarrollo local.

## Endpoints

- `POST /users`: crear un usuario.
- `GET /users`: listar usuarios.
- `GET /users/:id`: obtener un usuario.
- `PATCH /users/:id`: actualizar un usuario.
- `DELETE /users/:id`: eliminar un usuario.

El campo `password` se recibe al crear o actualizar un usuario, pero no se devuelve en las respuestas.

## Comandos útiles

```powershell
npm run db:up
npm run db:down
npm run db:logs
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:studio
npm run start:dev
npm run build
```
