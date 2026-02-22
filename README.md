# Librería Emelyn - Frontend

Este es el frontend de la aplicación de e-commerce para Librería Emelyn. Está construido con React y Vite, y se comunica con una API REST en Python para gestionar productos, usuarios, pedidos y pagos.

## Requisitos

- Node.js 18 o superior
- npm o yarn

## Instalación

```bash
npm install
```

## Configuración

El frontend se conecta al backend que debe estar corriendo en `http://localhost:4000`. Si necesitas cambiar esta URL, puedes hacerlo en los componentes que hacen llamadas fetch.

## Desarrollo

Para levantar el servidor de desarrollo:

```bash
npm run dev
```

Esto abrirá la aplicación en `http://localhost:5173`.

## Estructura del proyecto

- `/src/pages` - Vistas principales (Home, Login, Admin, Historial, etc.)
- `/src/components` - Componentes reutilizables (Navbar, etc.)
- `/src/assets` - Recursos estáticos (imágenes, etc.)

## Funcionalidades

- Catálogo de productos con filtros por categoría
- Sistema de autenticación (cliente y admin)
- Carrito de compras y proceso de pago
- Panel de administración para gestión de productos, usuarios y pedidos
- Historial de compras para clientes
- Recuperación de contraseña por correo

## Build para producción

```bash
npm run build
```

Los archivos estáticos se generarán en la carpeta `dist/` listos para ser servidos desde cualquier hosting estático (Vercel, Netlify, etc.).

## Credenciales de prueba

**Cliente:**
- Email: axel1mejias1@gmail.com
- Contraseña: axel123

**Administrador:**
- Email: admin@emelyn.com
- Contraseña: admin123
