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
        <h2 className="text-xl font-bold text-leaf-700">Live routes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            <Link href="/" className="font-semibold underline">/</Link> — the
            landing page.
          </li>
          <li>
            <Link href="/core" className="font-semibold underline">/core</Link>{" "}
            — Week 1, the 5-day lunch plan generator.
          </li>
          <li>
            <Link href="/research" className="font-semibold underline">
              /research
            </Link>{" "}
            — Week 2, research and benchmarking.
          </li>
          <li>
            <Link href="/product" className="font-semibold underline">
              /product
            </Link>{" "}
            and{" "}
            <Link href="/pricing" className="font-semibold underline">
              /pricing
            </Link>{" "}
            — Week 3, plans and the revenue calculator.
          </li>
          <li>
            <Link href="/marketing" className="font-semibold underline">
              /marketing
            </Link>{" "}
            — Week 4, the marketing engine.
          </li>
          <li>
            <Link href="/chat" className="font-semibold underline">/chat</Link>{" "}
            — Week 5, the guided assistant.
          </li>
          <li>
            <Link href="/docs" className="font-semibold underline">/docs</Link>{" "}
            — this page.
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
          <li>
            <strong>ab_events</strong> — Week 4 — one row per view or click
            in the A/B tests on /marketing (test_name, variant, event_type).
          </li>
          <li>
            <strong>marketing_assets</strong> — Week 4 — the saved assets
            library on /marketing (title, asset_type, content).
          </li>
          <li>
            <strong>chat_sessions</strong> — Week 5 — one row per
            conversation on /chat: age_group, allergy_status, allergies,
            preferences, intent, messages (jsonb, which also carries the
            language of each message), flagged_for_review, review_reason,
            rating and is_test. It holds no names and no contact details.
          </li>
          <li>
            <strong>review_requests</strong> — Week 5 — a parent&apos;s
            request for a person to get in touch: session_id, contact, note
            and is_test. This is the only personal data in the project.
          </li>
        </ul>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          Row level security
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            <strong>chat_sessions:</strong> the anonymous role can insert,
            read and update, so a conversation can be saved, rated and
            corrected from the browser. It can delete only rows marked{" "}
            <code>is_test</code>, which is how the automated tests clean up
            after themselves.
          </li>
          <li>
            <strong>review_requests:</strong> the anonymous role can only
            insert. There is no anonymous read policy, so a contact left by
            one parent can never be read back by anyone in the browser, not
            even by the page that wrote it. Deletes are again limited to{" "}
            <code>is_test</code> rows.
          </li>
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">
          Week 5 — the /chat assistant
        </h2>
        <p className="mt-3 text-leaf-800">
          A public guided assistant for parents of school-age children, live
          at <Link href="/chat" className="font-semibold underline">/chat</Link>.
          It runs on fixed rules and the data in this repository: there is no
          external AI API, so the same question always produces the same
          answer.
        </p>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          What it does
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            Asks three intake questions, one at a time, with quick-reply
            buttons: the child&apos;s age group (5-6, 7-9 or 10-12),
            whether there are allergies or food preferences, and what the
            parent needs today.
          </li>
          <li>
            Answers with a lunchbox idea, an answer about the service, or a
            handover to a person, depending on that third answer.
          </li>
          <li>
            Swaps the idea when a parent says their child does not like an
            ingredient, in either language, and remembers it for the rest of
            the conversation.
          </li>
          <li>
            Offers a <strong>Change</strong> link on each intake answer,
            which rewinds the conversation to that question and clears
            whatever depended on it.
          </li>
          <li>
            Has an ES and EN toggle. It always opens in English, and the
            choice is not remembered between visits. Messages already sent
            keep the language they were written in.
          </li>
          <li>
            Takes a thumbs up or down on each answer, and saves the
            conversation to Supabase.
          </li>
          <li>
            When it cannot answer, it says so and offers quick replies for
            things it can answer, alongside the option to talk to a person.
          </li>
        </ul>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          Guardrail and human checkpoint
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            Medical and dietary-treatment questions, in English or Spanish,
            are refused with a pointer to a pediatrician or a registered
            nutritionist. The chat gives no medical advice of its own.
          </li>
          <li>
            A conversation is marked for review when the parent reports
            allergies, writes an allergy or reaction word, asks to talk to a
            person, or asks something the chat cannot answer. The banner
            offers a short form where an email or phone number can be left,
            which is validated before it is stored.
          </li>
        </ul>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          Honesty rules
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            Service answers only repeat facts that already exist on this
            site: the plans and their prices, what each plan includes, the
            ages covered, what the /core planner produces, how allergens are
            filtered, and ingredient quality. Nothing about the business is
            invented.
          </li>
          <li>
            A lunchbox is never described as safe for an allergy. When
            allergies are present the answer says plainly that a Lunchies
            team member has to confirm it.
          </li>
          <li>
            Topics that are not defined yet get an honest answer saying so,
            plus the option to talk to a person: delivery days, times and
            zones, ordering, payment, contracts, refunds, cancellation,
            portion sizes and calorie values.
          </li>
        </ul>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          Testing
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>
            48 automated tests pass across three files, run with{" "}
            <code>npm test</code>.
          </li>
          <li>
            Three software tests cover the chat end to end: a session saved
            to Supabase, updated, rated and read back; the medical guardrail
            refusing requests in both languages; and the human checkpoint
            together with contact validation and a real insert into{" "}
            <code>review_requests</code>. Every row they write is marked{" "}
            <code>is_test</code> and deleted afterwards.
          </li>
          <li>
            External user tests were run with 4 people. Their conversations
            are stored in <code>chat_sessions</code> and were used to decide
            what to build next. No names, contact details or conversation
            text appear in these docs.
          </li>
        </ul>

        <h3 className="mt-6 text-base font-bold text-leaf-700">
          Out of scope for Week 5
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-leaf-800">
          <li>WhatsApp and any other messaging platform.</li>
          <li>Orders and payments inside the chat.</li>
          <li>User accounts and login.</li>
          <li>Medical or nutritional advice.</li>
          <li>Voice input and voice replies.</li>
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 text-left shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-leaf-700">
          How the data flows
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-leaf-800">
          <li>
            Pages are Next.js App Router routes. The ones that hold state or
            talk to Supabase from the browser are client components behind a
            thin server page.
          </li>
          <li>
            Content and rules live in <code>lib/</code> as typed data:
            menus and allergens in <code>lunchMenu.ts</code>, plans and
            features in <code>productData.ts</code>, the chat rules in{" "}
            <code>chatData.ts</code> and <code>chatLogic.ts</code>. Nothing
            is generated by an external service.
          </li>
          <li>
            Supabase is called from the browser with the anonymous key.
            Every call is wrapped in an 8 second timeout, and a failure
            shows a friendly message rather than breaking the page.
          </li>
          <li>
            Pure logic is kept separate from the pages, which is what the
            Vitest suite exercises without a browser.
          </li>
        </ol>
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
