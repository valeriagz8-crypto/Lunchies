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

## /core — Generative Core Agent

Página que genera un plan de comida de 5 días (lunes a viernes) a partir de la edad, las alergias y las preferencias del niño. La generación es 100% con listas fijas en el código (sin IA externa), evitando los ingredientes marcados como alergia y sin repetir la misma proteína, guarnición ni fruta en días consecutivos.

**Tecnologías:**

- Next.js (App Router) para la página y la lógica de generación en el cliente.
- Supabase para guardar y borrar los planes generados (tabla `core_outputs`, con insert/select/delete reales vía `@supabase/supabase-js`).

**Cómo probarlo localmente:**

1. Corre el SQL de la tabla `core_outputs` y sus políticas RLS (insert, select y delete) en el editor SQL de tu proyecto de Supabase.
2. Copia tus credenciales de Supabase a `.env.local` (ver sección [Variables de entorno](#variables-de-entorno)).
3. Levanta el proyecto con `npm run dev` y abre [http://localhost:3000/core](http://localhost:3000/core).
4. Llena el formulario, genera un menú, guárdalo y verifica que aparezca en la tabla "Your saved lunch plans".

## /research — Research + Benchmarking Dashboard

Página que reúne evidencia del problema (papás con poco tiempo que no siempre pueden preparar lonches saludables y personalizados), ejemplos globales, contexto de México, y una comparación de competidores y sustitutos, organizado en un dashboard simple.

Un widget de 4 KPIs (competidores totales, competidores directos, rango de precio y gap identificado) se calcula dinámicamente del array de competidores y se muestra debajo del hero.

**Incluye:**

- Formulario de intake (research topic, problem to validate, target user, location/market, tags de aprendizaje), con los 4 primeros campos como dropdowns con opción "Other" para texto libre.
- Botón "Start research" que genera, 100% localmente y sin ninguna llamada externa: un resumen narrativo con los valores del formulario, un análisis calculado a partir de los competidores (conteo de directos, rango de precios, gap de allergy-safety, precio promedio y el dato de México), y resalta/ordena las filas de la tabla de competidores según los tags seleccionados.
- 5 tarjetas de "Global examples" (Yumble, Little Spoon, Chefs for Kids, Foodini, Kiddos).
- Sección "Mexico" con el dato de ENSANUT sobre sobrepeso/obesidad infantil.
- Tabla de 8 competidores/sustitutos (directos, indirectos y sustitutos) con búsqueda por nombre, filtros por tipo y país, y un botón "Reset filters" para regresarla a su estado original — todo 100% client-side.
- "Risk map": cuadrante 2x2 (market saturation vs. threat level) hecho con SVG simple, sin librerías de gráficas.
- "Save your research": guarda el intake en Supabase (tabla `research_notes`) y muestra abajo la lista de research guardado previamente.

Los datos de ejemplos globales y competidores están fijos en el código (`lib/researchData.ts`), sin scraping ni APIs en vivo.

**Tecnologías:**

- Next.js (App Router) para la página, el formulario, el análisis calculado, filtros/búsqueda/reset de la tabla y el risk map en el cliente.
- Supabase para guardar y listar el research (tabla `research_notes`, con insert/select reales vía `@supabase/supabase-js`).

**Cómo probarlo localmente:**

1. Corre este SQL en el editor SQL de tu proyecto de Supabase para crear la tabla `research_notes` y sus políticas RLS (insert y select):

   ```sql
   create table research_notes (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz not null default now(),
     topic text not null,
     problem text not null,
     target_user text not null,
     location text not null,
     tags text[] not null default '{}'
   );

   alter table research_notes enable row level security;

   create policy "Allow public insert on research_notes"
     on research_notes for insert
     to anon
     with check (true);

   create policy "Allow public select on research_notes"
     on research_notes for select
     to anon
     using (true);
   ```

2. Copia tus credenciales de Supabase a `.env.local` (ver sección [Variables de entorno](#variables-de-entorno)).
3. Levanta el proyecto con `npm run dev` y abre [http://localhost:3000/research](http://localhost:3000/research).
4. Llena el formulario de intake, guarda el research y verifica que aparezca en "Previously saved research". Prueba también la búsqueda y los filtros de la tabla de competidores.

## Despliegue

Este proyecto está desplegado en Vercel.

URL de producción: [https://lunchies-valeria.vercel.app](https://lunchies-valeria.vercel.app)

El repositorio de GitHub está conectado al proyecto en Vercel: cada push a `main` dispara un deploy de producción automático.
