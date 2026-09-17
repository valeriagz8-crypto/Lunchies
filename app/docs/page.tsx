export default function DocsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-leaf-700 sm:text-4xl">
          Documentación
        </h1>
        <p className="mt-4 text-lg text-leaf-800">
          Cómo funciona /core y /research por dentro.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">
          Cómo genera el menú el Generative Core Agent
        </h2>
        <p className="mt-3 text-leaf-800">
          El agente en <code>/core</code> arma un plan de 5 días (lunes a
          viernes) combinando una proteína, un acompañante (verdura o
          carbohidrato) y una fruta por día. No usa ninguna IA externa: todo
          sale de listas fijas escritas en el código, en{" "}
          <code>lib/lunchMenu.ts</code>.
        </p>

        <h3 className="mt-6 font-semibold text-leaf-700">Las listas</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-leaf-800">
          <li>
            <strong>Proteínas:</strong> pollo, pavo, res, huevo, queso,
            frijoles negros, tofu y camarón.
          </li>
          <li>
            <strong>Acompañantes:</strong> una mezcla de verduras (brócoli,
            zanahoria, ejotes, elote, hummus con pepino) y carbohidratos
            (arroz integral, quinoa, puré de camote, pasta integral, pan
            integral).
          </li>
          <li>
            <strong>Frutas:</strong> manzana, plátano, naranja, uvas, fresas,
            mango, piña y sandía.
          </li>
        </ul>

        <h3 className="mt-6 font-semibold text-leaf-700">
          Cómo se excluyen las alergias
        </h3>
        <p className="mt-2 text-leaf-800">
          Cada ingrediente tiene etiquetadas las alergias que contiene (por
          ejemplo, el queso está etiquetado como &quot;Dairy&quot; y la pasta
          integral como &quot;Gluten&quot;). Antes de armar el plan, el
          agente filtra las tres listas y elimina cualquier ingrediente cuya
          etiqueta coincida con una alergia seleccionada en el formulario, así
          que ese ingrediente nunca puede aparecer en el resultado.
        </p>

        <h3 className="mt-6 font-semibold text-leaf-700">
          Cómo se evita repetir proteína
        </h3>
        <p className="mt-2 text-leaf-800">
          El agente arma el plan día por día y recuerda qué proteína usó el
          día anterior. Al elegir la proteína del día siguiente, excluye esa
          última proteína de las opciones disponibles (si hay más de una
          opción posible), para que nunca se repita la misma proteína en dos
          días consecutivos.
        </p>

        <p className="mt-6 text-sm text-leaf-600">
          Las preferencias de comida (&quot;Vegetarian&quot;, &quot;No red
          meat&quot;, &quot;Loves veggies&quot;) también filtran estas listas
          antes de elegir al azar: por ejemplo, &quot;Vegetarian&quot; deja
          solo proteínas vegetarianas, y &quot;No red meat&quot; quita la
          res.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">
          Week 1 — Generative Core Agent Prompts
        </h2>
        <p className="mt-3 text-leaf-800">
          Los 5 prompts que usamos con Claude Code esta semana para construir
          el Generative Core Agent en <code>/core</code>, en orden:
        </p>

        <ol className="mt-4 list-decimal space-y-5 pl-5 text-leaf-800">
          <li>
            <strong>Generador de menú (/core):</strong> crear la tabla{" "}
            <code>core_outputs</code> en Supabase con insert y select reales,
            y construir la página <code>/core</code> completa: formulario de
            edad, alergias y preferencias del niño, generación de un plan de
            5 días a partir de listas fijas en el código (sin IA), guardado
            del plan en Supabase y una tabla con los planes guardados.
          </li>
          <li>
            <strong>Botón de borrar:</strong> habilitar el botón 🗑️ de la
            tabla &quot;Your saved lunch plans&quot; para que borre el
            registro real en Supabase (incluyendo la política RLS de{" "}
            <code>DELETE</code>) y lo quite de la lista visualmente.
          </li>
          <li>
            <strong>Link del navbar:</strong> cambiar el link
            &quot;Plans&quot; del navbar para que apunte a <code>/core</code>{" "}
            en vez de a la página anterior.
          </li>
          <li>
            <strong>Corrección — no repetir guarnición ni fruta:</strong>{" "}
            aplicar la misma regla de &quot;no repetir el día
            anterior&quot; que ya existía para la proteína también a la
            guarnición y a la fruta del menú generado.
          </li>
          <li>
            <strong>Corrección — emoji de tofu y combinaciones naturales:</strong>{" "}
            arreglar el emoji de &quot;Tofu bites&quot; (se veía como un
            cuadro vacío) y agrupar proteínas, guarniciones y frutas por tema
            (clásico, desayuno, mediterráneo, asiático, plant-based) para que
            las combinaciones generadas se sientan más armónicas.
          </li>
        </ol>
      </div>
    </section>
  );
}
