import Link from "next/link";

export default function DocsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-leaf-700 sm:text-4xl">
          Project Docs
        </h1>
        <p className="mt-4 text-lg text-leaf-800">
          Build logs, prompt library, and tech stack documentation for
          Lunchies.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">Tech Stack</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            <strong>Frontend:</strong> Next.js 14 (App Router).
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS.
          </li>
          <li>
            <strong>Repository:</strong> valeriagz8-crypto/Lunchies on
            GitHub.
          </li>
          <li>
            <strong>Deployment:</strong> Vercel.
          </li>
          <li>
            <strong>Data Layer:</strong> Supabase (PostgreSQL) with row level
            security.
          </li>
          <li>
            <strong>Fonts:</strong> Inter, Poppins and Caveat through
            next/font.
          </li>
          <li>
            <strong>UI libraries:</strong> lucide-react for icons,
            embla-carousel-react for the homepage carousel.
          </li>
          <li>
            <strong>Tests:</strong> Vitest, run with{" "}
            <code>npm test</code>.
          </li>
          <li>
            <strong>No external AI API:</strong> every generated output, in
            /core and in /chat, comes from fixed rules and data in the
            repository.
          </li>
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">
          Prompt Library, Week by Week
        </h2>
        <ol className="mt-4 list-decimal space-y-4 pl-5 text-leaf-800">
          <li>
            <strong>Week 0 — Project setup:</strong> Set up the Next.js 14
            App Router project with TypeScript and Tailwind CSS, add the
            navbar, footer, and homepage hero, create the Docs and Roadmap
            pages, and initialize the Supabase client and environment
            variables.
          </li>
          <li>
            <strong>Week 1 — Generative Core Agent (/core):</strong> Build
            the /core page: a form for the child&apos;s age, allergies, and
            preferences that generates a 5-day lunch plan from fixed lists
            in the code (no external AI), saves it to Supabase, and lists
            previously saved plans with a delete button.
          </li>
          <li>
            <strong>Week 2 — Research + Benchmarking Dashboard
            (/research):</strong> Build the /research page: an intake form,
            5 global example cards, a Mexico section with the ENSANUT data
            point, a searchable and filterable table of 8
            competitors/substitutes, an SVG risk map, and saving research
            notes to Supabase.
          </li>
          <li>
            <strong>Week 3 — Product &amp; Pricing (/product,
            /pricing):</strong> Build the /product page with a feature map
            grid (Basic, Plus and Premium plans) and 2 customer segment cards,
            and the /pricing page with a revenue calculator with sliders, a
            monthly/annual toggle, an assumptions table, and saving
            scenarios to the Supabase table <code>pricing_scenarios</code>.
          </li>
          <li>
            <strong>Week 4 — Marketing Engine (/marketing):</strong> Build
            the /marketing page as a tabbed dashboard: brand system, target
            persona, landing page copy, 10 social posts, 3 video scripts, a
            14-day campaign calendar, live A/B testing and a saved assets
            library, with copy and export buttons and the kit downloadable
            as Markdown.
          </li>
          <li>
            <strong>Week 5 — Public Chatbot / Guided Assistant
            (/chat):</strong> Build the /chat page: a guided assistant for
            parents that asks three intake questions, answers from fixed
            rules with no external AI API, refuses medical questions, hands
            anything it cannot answer to a person, and saves the
            conversation to Supabase.
          </li>
        </ol>
      </div>

      <div className="mt-10 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">Supabase Tables</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            <strong>core_outputs</strong> — Week 1 — stores the 5-day lunch
            plans generated and saved from /core.
          </li>
          <li>
            <strong>research_notes</strong> — Week 2 — stores the research
            intake submissions saved from /research.
          </li>
          <li>
            <strong>pricing_scenarios</strong> — Week 3 — stores the revenue
            calculator scenarios saved from /pricing.
          </li>
        </ul>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm font-semibold text-leaf-700 transition-colors hover:text-peach-500"
        >
          ← Back to homepage
        </Link>
      </div>
    </section>
  );
}
