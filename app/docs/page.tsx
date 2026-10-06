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
            <strong>Data Layer:</strong> Supabase (PostgreSQL).
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
            grid (Free, Freemium, Pro tiers) and 2 customer segment cards,
            and the /pricing page with a revenue calculator with sliders, a
            monthly/annual toggle, an assumptions table, and saving
            scenarios to the Supabase table <code>pricing_scenarios</code>.
          </li>
          <li>
            <strong>Week 4 and beyond:</strong> Upcoming.
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
            <strong>pricing_scenarios</strong> — Week 3 (in progress) —
            will store the revenue calculator scenarios saved from
            /pricing.
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
