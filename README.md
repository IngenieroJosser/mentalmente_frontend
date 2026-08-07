# SanaTú — Sitio web y sistema clínico

Rediseño integral de la experiencia digital de SanaTú construido con **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **Prisma** y **PostgreSQL**.

## Qué incluye esta versión

- Landing page cinematográfica guiada por scroll, con escenas sticky, parallax, morphing visual, transiciones de contenido y microinteracciones.
- Identidad visual unificada a partir de la paleta original del logo: marfil, crema, oliva y verde profundo.
- Navegación responsive con menú móvil animado.
- Rediseño completo de inicio de sesión y registro.
- Transiciones entre rutas y barra de progreso de scroll.
- Renovación visual transversal de los paneles de administración, psicología y recepción.
- Nuevas pantallas de configuración y plantillas.
- Pantalla 404 coherente con la nueva experiencia.
- Soporte para `prefers-reduced-motion` y estilos de impresión para documentos clínicos.

## Ejecución local

1. Crea el archivo de variables de entorno:

```bash
cp .env.example .env
```

2. Completa las variables requeridas.

3. Instala dependencias y genera Prisma Client:

```bash
npm install
npx prisma generate
```

4. Ejecuta el proyecto:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

Consulta `.env.example`. No se incluye ningún secreto real en el paquete entregado.

## Rutas principales

- `/` — experiencia pública.
- `/login` — acceso clínico.
- `/register` — registro de recepción.
- `/management-dashboard` — panel de administración.
- `/psychologist-dashboard` — panel de psicología.
- `/reception-dashboard` — panel de recepción.

## Notas de producción

- Ejecuta las migraciones de Prisma en un paso controlado del pipeline, antes del despliegue de la aplicación.
- Configura `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_BASE_URL` y `BLOB_READ_WRITE_TOKEN` mediante el gestor de secretos del entorno.
- Conserva HTTPS, cookies seguras y una política de respaldo para la base de datos debido a la naturaleza clínica de la información.
