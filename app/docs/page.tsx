import Link from "next/link";
import {
  BookOpen,
  Database,
  FileText,
  GitCommitHorizontal,
  Layers,
  MessageCircle,
  Megaphone,
  Presentation,
  Route,
  Workflow,
} from "lucide-react";
import {
  AnchorButton,
  Card,
  CardHead,
  HeroArt,
  HeroLabel,
  IconBadge,
  PageHero,
  PageShell,
} from "@/components/ui/pieces";
import { BUILD_LOG, BUILD_LOG_TOTAL, IMPACT_EVIDENCE } from "@/lib/week6Data";

/** Shared classes for the bulleted and numbered lists on this page. */
const LIST = "docs-list mt-4 space-y-2.5 text-leaf-800";
const LIST_ORDERED = "docs-list-ordered mt-4 space-y-4 text-leaf-800";

/**
 * A sub-heading inside one of the big cards. No text-transform here on
 * purpose: `uppercase` would change the page's rendered text.
 */
const SUBHEAD =
  "mt-7 font-poppins text-base font-extrabold tracking-tight text-leaf-700";

/** Inline <code> inside the docs prose. */
const CODE =
  "rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[0.85em] text-leaf-700 ring-1 ring-leaf-100";

/** Links in the Live routes list. */
const ROUTE_LINK =
  "font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 transition-colors hover:text-peach-600";

export default function DocsPage() {
  return (
    <PageShell width="max-w-4xl">
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="green" size="sm" icon={FileText} />}>
            Docs
          </HeroLabel>
        }
        title={
          <>
            Project <span className="text-peach-500">Docs</span>
          </>
        }
        subtitle={
          <>
            Build logs, prompt library, and tech stack documentation for
            Lunchies.
          </>
        }
        actions={
          <AnchorButton href="#tech-stack">Explore documents</AnchorButton>
        }
        art={
          <HeroArt
            src="/images/redesign/docs-notepad.webp"
            width={434}
            height={384}
            tone="leaf"
            priority
          />
        }
      />

      <div className="mt-12 space-y-6">
        <Card id="tech-stack" tint="green" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="green" icon={Layers} />}
            title="Tech Stack"
          />
          <ul className={LIST}>
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
              <code className={CODE}>npm test</code>.
            </li>
            <li>
              <strong>No external AI API:</strong> every generated output, in
              /core and in /chat, comes from fixed rules and data in the
              repository.
            </li>
          </ul>
        </Card>

        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="blue" icon={Route} />}
            title="Live routes"
          />
          <ul className={LIST}>
            <li>
              <Link href="/" className={ROUTE_LINK}>/</Link> — the
              landing page.
            </li>
            <li>
              <Link href="/core" className={ROUTE_LINK}>/core</Link>{" "}
              — Week 1, the 5-day lunch plan generator.
            </li>
            <li>
              <Link href="/research" className={ROUTE_LINK}>
                /research
              </Link>{" "}
              — Week 2, research and benchmarking.
            </li>
            <li>
              <Link href="/product" className={ROUTE_LINK}>
                /product
              </Link>{" "}
              and{" "}
              <Link href="/pricing" className={ROUTE_LINK}>
                /pricing
              </Link>{" "}
              — Week 3, plans and the revenue calculator.
            </li>
            <li>
              <Link href="/marketing" className={ROUTE_LINK}>
                /marketing
              </Link>{" "}
              — Week 4, the marketing engine.
            </li>
            <li>
              <Link href="/chat" className={ROUTE_LINK}>/chat</Link>{" "}
              — Week 5, the guided assistant.
            </li>
            <li>
              <Link href="/docs" className={ROUTE_LINK}>/docs</Link>{" "}
              — this page.
            </li>
            <li>
              <Link href="/demo" className={ROUTE_LINK}>/demo</Link>{" "}
              — Week 6, the guided walkthrough: product tour, agent map,
              practical impact, testing step and the Version 2 roadmap.
            </li>
            <li>
              <Link href="/dashboard" className={ROUTE_LINK}>
                /dashboard
              </Link>{" "}
              — Week 6, project status: module list, the full testing
              summary, the revenue model and the saved record counts.
            </li>
          </ul>

          <h3 className={SUBHEAD}>Redirects</h3>
          <ul className={LIST}>
            <li>
              <code className={CODE}>/about</code>,{" "}
              <code className={CODE}>/how-it-works</code>,{" "}
              <code className={CODE}>/plans</code> and{" "}
              <code className={CODE}>/roadmap</code> were placeholder pages
              that nothing linked to. They now redirect permanently to{" "}
              <code className={CODE}>/</code>,{" "}
              <code className={CODE}>/#how-it-works</code>,{" "}
              <code className={CODE}>/product</code> and{" "}
              <code className={CODE}>/demo#version-2</code>.
            </li>
          </ul>
        </Card>

        <Card tint="cream" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="cream" icon={BookOpen} />}
            title="Prompt Library, Week by Week"
          />
          <ol className={LIST_ORDERED}>
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
              scenarios to the Supabase table{" "}
              <code className={CODE}>pricing_scenarios</code>.
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
            <li>
              <strong>Week 6 — Redesign from the mockups:</strong> Take the
              five images in <code className={CODE}>mockups/redesign/</code> as
              the visual spec and rebuild the look of /core, /product,
              /research, /pricing and /docs to match them, changing only how
              the pages look: no text, number, label, price, plan name,
              feature name, table row, link, query, validation or test may
              change, and where a mockup disagrees with the site the site
              wins.
            </li>
            <li>
              <strong>Week 6 — Guided walkthrough (/demo):</strong> Build
              /demo from <code className={CODE}>mockups/demo.png</code> with a
              product tour whose cards are badged Live or Planned according to
              what the code really does, an agent map of only the real
              modules, a practical impact section written as intention with a
              risks and limits block, a short testing step and a Version 2
              roadmap where every item is marked as an idea.
            </li>
            <li>
              <strong>Week 6 — Project dashboard (/dashboard):</strong> Build
              /dashboard from{" "}
              <code className={CODE}>mockups/dashboard.png</code> with stat
              tiles and a module list computed from the real data rather than
              typed, the full testing summary, the revenue model computed by
              the same function /pricing uses, and live record counts that
              never read contacts, chat messages, allergies or preferences.
            </li>
            <li>
              <strong>Week 6 — Full-site regression test:</strong> Add
              Playwright and a <code className={CODE}>npm run test:regression</code>{" "}
              script that builds the site, serves it and checks every route at
              1280 and 390: status, heading, console errors, horizontal
              scroll, every navbar link, the section anchors, the privacy of
              /dashboard and one flow per module, leaving no data behind.
            </li>
            <li>
              <strong>Week 6 — Redirects:</strong> Turn the four orphan
              routes that nothing linked to into permanent redirects to the
              pages that cover the subject, and delete their placeholders.
            </li>
          </ol>
        </Card>

        <Card tint="blue" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="blue" icon={Database} />}
            title="Supabase Tables"
          />
          <ul className={LIST}>
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

          <h3 className={SUBHEAD}>
            Row level security
          </h3>
          <ul className={LIST}>
            <li>
              <strong>chat_sessions:</strong> the anonymous role can insert,
              read and update, so a conversation can be saved, rated and
              corrected from the browser. It can delete only rows marked{" "}
              <code className={CODE}>is_test</code>, which is how the automated
              tests clean up after themselves.
            </li>
            <li>
              <strong>review_requests:</strong> the anonymous role can only
              insert. There is no anonymous read policy, so a contact left by
              one parent can never be read back by anyone in the browser, not
              even by the page that wrote it. Deletes are again limited to{" "}
              <code className={CODE}>is_test</code> rows.
            </li>
            <li>
              <strong>core_outputs:</strong> the README describes running the
              table&apos;s RLS policies for insert, select and delete. The SQL
              itself is not in the repository.
            </li>
            <li>
              <strong>research_notes:</strong> the README carries the SQL,
              which enables row level security and creates a public insert
              policy and a public select policy. It contains no delete policy.
            </li>
            <li>
              <strong>pricing_scenarios:</strong> not documented in repo. The
              code only inserts and selects.
            </li>
            <li>
              <strong>ab_events:</strong> not documented in repo. The code
              only inserts and selects.
            </li>
            <li>
              <strong>marketing_assets:</strong> not documented in repo. The
              code inserts, selects and deletes.
            </li>
          </ul>
          <p className="mt-3 text-[13px] text-leaf-600">
            Where a table is marked &quot;not documented in repo&quot;, the
            policy exists only in the Supabase project and cannot be read from
            here. What the code does is listed instead, because that can.
          </p>
        </Card>

        <Card tint="pink" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="pink" icon={MessageCircle} />}
            title="Week 5 — the /chat assistant"
          />
          <p className="mt-4 text-leaf-800">
            A public guided assistant for parents of school-age children, live
            at <Link href="/chat" className={ROUTE_LINK}>/chat</Link>.
            It runs on fixed rules and the data in this repository: there is no
            external AI API, so the same question always produces the same
            answer.
          </p>

          <h3 className={SUBHEAD}>
            What it does
          </h3>
          <ul className={LIST}>
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

          <h3 className={SUBHEAD}>
            Guardrail and human checkpoint
          </h3>
          <ul className={LIST}>
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

          <h3 className={SUBHEAD}>
            Honesty rules
          </h3>
          <ul className={LIST}>
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

          <h3 className={SUBHEAD}>
            Testing
          </h3>
          <ul className={LIST}>
            <li>
              48 automated tests pass across three files, run with{" "}
              <code className={CODE}>npm test</code>.
            </li>
            <li>
              Three software tests cover the chat end to end: a session saved
              to Supabase, updated, rated and read back; the medical guardrail
              refusing requests in both languages; and the human checkpoint
              together with contact validation and a real insert into{" "}
              <code className={CODE}>review_requests</code>. Every row they
              write is marked <code className={CODE}>is_test</code> and deleted
              afterwards.
            </li>
            <li>
              External user tests were run with 4 people. Their conversations
              are stored in <code className={CODE}>chat_sessions</code> and were
              used to decide what to build next. No names, contact details or
              conversation text appear in these docs.
            </li>
          </ul>

          <h3 className={SUBHEAD}>
            Out of scope for Week 5
          </h3>
          <ul className={LIST}>
            <li>WhatsApp and any other messaging platform.</li>
            <li>Orders and payments inside the chat.</li>
            <li>User accounts and login.</li>
            <li>Medical or nutritional advice.</li>
            <li>Voice input and voice replies.</li>
          </ul>
        </Card>

        <Card tint="cream" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="cream" icon={Megaphone} />}
            title="Week 4 — the /marketing engine"
          />
          <p className="mt-4 text-leaf-800">
            A tabbed dashboard that holds the whole go-to-market kit. Like the
            rest of the project it runs on fixed data in{" "}
            <code className={CODE}>lib/marketingData.ts</code>: nothing on the
            page is generated by an external service.
          </p>

          <h3 className={SUBHEAD}>The nine tabs</h3>
          <ul className={LIST}>
            <li>
              <strong>Overview</strong> — a card per section, each linking to
              its tab.
            </li>
            <li>
              <strong>Brand System</strong> — the palette, the type choices
              and the voice rules.
            </li>
            <li>
              <strong>Target Persona</strong> — the parent the product is
              written for, with needs and objections.
            </li>
            <li>
              <strong>Landing Copy</strong> — headline, subheadline, benefits
              and the call to action.
            </li>
            <li>
              <strong>Social Posts</strong> — 10 posts, each with a copy
              button.
            </li>
            <li>
              <strong>Video Scripts</strong> — 3 scripts broken into shots.
            </li>
            <li>
              <strong>Campaign Calendar</strong> — a 14-day plan, one row per
              day.
            </li>
            <li>
              <strong>A/B Testing</strong> — two live tests, described below.
            </li>
            <li>
              <strong>Saved Assets</strong> — the library described below.
            </li>
          </ul>

          <h3 className={SUBHEAD}>A/B testing</h3>
          <ul className={LIST}>
            <li>
              Two tests run on the page. Every view and every click is written
              to <code className={CODE}>ab_events</code> as one row carrying{" "}
              <code className={CODE}>test_name</code>,{" "}
              <code className={CODE}>variant</code> and{" "}
              <code className={CODE}>event_type</code>.
            </li>
            <li>
              Results are read back and shown as vote share per variant. When
              the two variants tie, no leader is declared.
            </li>
            <li>
              The winning headline is applied to the homepage hero, so the
              test changes something real rather than only reporting.
            </li>
            <li>
              Every Supabase call on the page is wrapped in the same 8 second
              timeout the rest of the project uses.
            </li>
          </ul>

          <h3 className={SUBHEAD}>Saved assets and export</h3>
          <ul className={LIST}>
            <li>
              Any card can be saved to{" "}
              <code className={CODE}>marketing_assets</code> with a title, an
              asset type and its content. An asset with an empty title or
              empty content is rejected before it is sent.
            </li>
            <li>
              Saved assets are listed, can be copied and can be deleted again
              from the browser.
            </li>
            <li>
              The whole kit exports as one Markdown file containing all 10
              social posts, the 3 video scripts and the 14 calendar days.
            </li>
            <li>
              8 automated tests cover this page: the save, load and delete
              round trip, the empty-field rejection, the A/B event round trip,
              the export contents, the conversion maths, the fixed variant
              wording, the vote share and the tie case.
            </li>
          </ul>
        </Card>

        <Card tint="blue" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="blue" icon={Presentation} />}
            title="Week 6 — /demo, /dashboard and the regression test"
          />
          <p className="mt-4 text-leaf-800">
            Week 6 added two pages and a test suite, and rebuilt the look of
            the five project pages against the mockups in{" "}
            <code className={CODE}>mockups/</code>. The two new pages split the
            subject deliberately: /demo explains how the project works,
            /dashboard reports where it stands.
          </p>

          <h3 className={SUBHEAD}>
            <Link href="/demo" className={ROUTE_LINK}>/demo</Link> — the
            guided walkthrough
          </h3>
          <ul className={LIST}>
            <li>
              A product tour of five steps. Plan and Personalize carry a{" "}
              <strong>Live</strong> badge because the /core planner really
              generates and filters a 5-day plan today. Shop, Cook and Track
              carry a <strong>Planned</strong> badge: no shopping list, no
              recipe feature and no child profiles exist in the code. Each
              badge is shown with the evidence for it.
            </li>
            <li>
              An agent map of the five modules that are real routes: the Core
              planner, Research, Pricing, Marketing and the Chat assistant.
              For each one it gives what it receives, what it produces, the
              Supabase tables it writes to and the point where a person has to
              step in. Nutrition, Shopping, Recipe and Profile modules are not
              drawn, because they do not exist.
            </li>
            <li>
              The modules run on fixed rules and the data in this repository.
              There is no external AI API, so the same input always produces
              the same output.
            </li>
            <li>
              A practical impact section written as intention, not as
              measurement: healthier habits, time savings and more
              personalization, with a line saying plainly that nothing has
              been measured yet.
            </li>
            <li>
              A risks and limits block: allergy mistakes are the most serious
              risk, children&apos;s data deserves care, no medical advice is
              given, plans are suggestions a parent must review, and there are
              no real orders or payments.
            </li>
            <li>
              A short testing step and a Version 2 roadmap where every item is
              labelled an idea that has not been built.
            </li>
          </ul>

          <h3 className={SUBHEAD}>
            <Link href="/dashboard" className={ROUTE_LINK}>/dashboard</Link> —
            project status
          </h3>
          <ul className={LIST}>
            <li>
              Four stat tiles. The two testing tiles read the same empty
              fields the testing summary uses, so they say{" "}
              <strong>Pending</strong>; the module count and the roadmap count
              are computed from the lists themselves.
            </li>
            <li>
              The ten project modules, each with its route and a status badge.
            </li>
            <li>
              The full testing summary, at{" "}
              <code className={CODE}>#testing</code>. It is the only place the
              three testing rows appear, and all three are Pending.
            </li>
            <li>
              A revenue model computed by the same{" "}
              <code className={CODE}>calculateRevenue()</code> the /pricing
              calculator calls, labelled as assumptions rather than sales.
            </li>
            <li>
              Live record counts for the six tables the page may read, with
              the most recent entries from four of them. It shows the date and
              the child&apos;s age for a saved plan, never the allergies or
              preferences; for the chat it shows the count only.{" "}
              <code className={CODE}>review_requests</code> is never queried,
              and the queries ask only for the columns that are displayed.
            </li>
          </ul>

          <h3 className={SUBHEAD}>The full-site regression test</h3>
          <ul className={LIST}>
            <li>
              Playwright, run with{" "}
              <code className={CODE}>npm run test:regression</code>. It builds
              the site, serves the production build on its own port and runs
              the checks against it.{" "}
              <code className={CODE}>npm test</code> is unchanged and still
              runs only the Vitest unit tests.
            </li>
            <li>
              At 1280 and 390 it checks that every route in the navbar returns
              200, renders its heading, logs no console error and does not
              scroll sideways.
            </li>
            <li>
              It clicks every navbar link in the desktop bar and in the mobile
              menu, and the Get started button, and checks where each one
              lands.
            </li>
            <li>
              It checks the /demo section anchors, /dashboard#testing and
              #saved-records, that the record counts render, and that no email
              address, phone number, allergen or allergies wording appears on
              /dashboard.
            </li>
            <li>
              It exercises one flow per module, chosen so nothing is left
              behind: /core generates a plan without saving it, /research
              filters and resets, /pricing moves a slider and resets,
              /marketing switches a tab, and /chat runs with{" "}
              <code className={CODE}>?test=1</code> so its row is marked{" "}
              <code className={CODE}>is_test</code> and deleted afterwards.
            </li>
            <li>
              The results of each run are written to{" "}
              <code className={CODE}>docs/regression-report.md</code>.
            </li>
            <li>
              Practical impact evidence:{" "}
              <a
                href={IMPACT_EVIDENCE.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={ROUTE_LINK}
              >
                ENSANUT 2020-2022 (INSP)
              </a>
            </li>
          </ul>
        </Card>

        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="green" icon={GitCommitHorizontal} />}
            title="Build log"
            subtitle={`${BUILD_LOG_TOTAL} commits, generated from git log.`}
          />
          <div className="mt-5 space-y-5">
            {BUILD_LOG.map((week) => (
              <div key={week.week}>
                <h3 className="font-poppins text-[15px] font-extrabold text-leaf-800">
                  {week.week} — {week.title}{" "}
                  <span className="font-semibold text-leaf-500">
                    ({week.range} · {week.commits.length} commits)
                  </span>
                </h3>
                <ul className="mt-2 space-y-1">
                  {week.commits.map((commit) => (
                    <li
                      key={commit.hash}
                      className="flex gap-2.5 text-[13px] leading-snug text-leaf-800"
                    >
                      <code className="shrink-0 font-mono text-[12px] text-leaf-500">
                        {commit.hash}
                      </code>
                      <span>{commit.subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card tint="green" className="p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="green" icon={Workflow} />}
            title="How the data flows"
          />
          <ol className={LIST_ORDERED}>
            <li>
              Pages are Next.js App Router routes. The ones that hold state or
              talk to Supabase from the browser are client components behind a
              thin server page.
            </li>
            <li>
              Content and rules live in <code className={CODE}>lib/</code> as
              typed data: menus and allergens in{" "}
              <code className={CODE}>lunchMenu.ts</code>, plans and features in{" "}
              <code className={CODE}>productData.ts</code>, the chat rules in{" "}
              <code className={CODE}>chatData.ts</code> and{" "}
              <code className={CODE}>chatLogic.ts</code>. Nothing is generated
              by an external service.
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
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-leaf-200 bg-white px-6 py-3 text-sm font-semibold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50 hover:text-peach-500"
        >
          ← Back to homepage
        </Link>
      </div>
    </PageShell>
  );
}
