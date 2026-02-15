# App de gestión de clases (Node.js + MariaDB)

Aplicación web sencilla para gestionar clases de un curso:

- Panel izquierdo con listado de clases.
- Botón **"+ Nueva clase"** para preparar una nueva entrada.
- Panel derecho para indicar **fecha**, **nombre** y **contenido**.
- Botón **Guardar**:
  - Si el nombre no existe, crea la clase.
  - Si el nombre ya existe, actualiza fecha y contenido.
- El listado se ordena por **fecha descendente** (más reciente arriba).

## Requisitos

- Node.js 18+ (idealmente Node.js 20 en Plesk).
- Base de datos MariaDB creada en Plesk.
- Usuario de base de datos con permisos sobre dicha base.

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

Variables:

- `PORT`: puerto del servidor Node.js (en Plesk lo gestiona el propio entorno).
- `DB_HOST`: host de MariaDB (en Plesk suele ser `localhost`).
- `DB_PORT`: puerto MariaDB (normalmente `3306`).
- `DB_USER`: usuario de la base de datos.
- `DB_PASSWORD`: contraseña del usuario.
- `DB_NAME`: nombre de la base de datos.

## Ejecución en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Publicación en dominio Plesk (dominio nuevo con Node.js activo)

### 1) Preparar dominio y Node.js

1. En Plesk entra al dominio recién creado.
2. Abre **Node.js** y verifica:
   - **Document Root**: puede ser `httpdocs`.
   - **Application Root**: por ejemplo `httpdocs` (o una carpeta como `app`).
   - **Application Startup File**: `src/server.js`.
3. Selecciona una versión Node.js compatible (recomendado 20.x).

### 2) Subir archivos

Puedes hacerlo por Git, FTP o Administrador de Archivos.

Estructura mínima en el `Application Root`:

- `package.json`
- `src/`
- `public/`
- `.env` (con tus credenciales)

### 3) Configurar la base de datos MariaDB

1. En Plesk crea (si no existe):
   - Base de datos MariaDB.
   - Usuario con contraseña.
2. Toma nota de:
   - host (`localhost` en la mayoría de casos),
   - nombre de BD,
   - usuario y contraseña.
3. Rellena `.env` con esos datos.

> La tabla `clases` se crea automáticamente al iniciar la app.

### 4) Instalar dependencias y arrancar

Desde la sección Node.js en Plesk:

1. Pulsa **NPM Install** (o ejecuta `npm install` por terminal SSH).
2. Pulsa **Restart App**.

### 5) Verificación

- Abre tu dominio en navegador.
- Comprueba que puedes:
  - crear una clase,
  - editar una clase existente (mismo nombre),
  - ver el listado ordenado por fecha descendente.

Endpoint de salud:

- `https://tu-dominio.com/health`

Debe responder:

```json
{"status":"ok"}
```

## API incluida

- `GET /api/clases` → listado ordenado por fecha descendente.
- `GET /api/clases/:id` → detalle de una clase.
- `POST /api/clases` → crea o actualiza por `nombre`.

Payload de `POST /api/clases`:

```json
{
  "nombre": "Clase 1",
  "fecha": "2026-02-15",
  "contenido": "Contenido de la sesión"
}
```

## Notas

- La clave de actualización es `nombre` (único en BD).
- Si en el futuro prefieres permitir nombres duplicados, se puede cambiar a edición por `id`.
