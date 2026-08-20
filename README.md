# Lunchies

Servicio de suscripción de loncheras saludables y personalizadas para niños, entregadas directo en escuelas privadas de CDMX.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app quedará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Definidas en `.env.example`, deben copiarse a `.env.local` con los valores reales:

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave pública (anon) de Supabase para el cliente. |

## Despliegue

Este proyecto está desplegado en Vercel.

URL de producción: [https://lunchies-sandy.vercel.app](https://lunchies-sandy.vercel.app)
