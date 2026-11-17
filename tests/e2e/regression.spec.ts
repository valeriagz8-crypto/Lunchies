import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";

/**
 * Full-site regression suite.
 *
 * Run with `npm run test:regression`. It builds the site, serves the
 * production build on port 3210 and checks every route a visitor can reach.
 *
 * Rules it follows:
 * - It never deletes or edits data that was already in Supabase.
 * - The only row it causes to be written is a /chat session opened with
 *   ?test=1, which marks the row is_test, and it deletes that row afterwards
 *   exactly as tests/chat.test.ts does.
 * - The /core, /pricing, /research and /marketing flows it exercises are the
 *   ones that do not write anything: generating a plan, moving a slider,
 *   loading the page, switching a tab.
 */

/** Every route reachable from the navbar, with the heading it must render. */
const ROUTES: { path: string; heading: RegExp }[] = [
  { path: "/", heading: /lunch/i },
  { path: "/core", heading: /Create a personalized/i },
  { path: "/research", heading: /Research/i },
  { path: "/product", heading: /A smarter way to plan/i },
  { path: "/pricing", heading: /Estimate your/i },
  { path: "/marketing", heading: /Lunchies/i },
  { path: "/chat", heading: /./ },
  { path: "/docs", heading: /Project Docs/i },
  { path: "/demo", heading: /Lunchies\s+in action\./i },
  { path: "/dashboard", heading: /Project overview/i },
];

/** The navbar, exactly as components/Navbar.tsx declares it. */
const NAV_LINKS = [
  { label: "Core", href: "/core" },
  { label: "Research", href: "/research" },
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Marketing", href: "/marketing" },
  { label: "Chat", href: "/chat" },
  { label: "Docs", href: "/docs" },
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
];

/** Routes that were placeholders and now redirect permanently. */
const REDIRECTS = [
  { from: "/about", to: "/" },
  { from: "/how-it-works", to: "/" },
  { from: "/plans", to: "/product" },
  { from: "/roadmap", to: "/demo" },
];

const WIDTHS = [
  { name: "1280", width: 1280, height: 900 },
  { name: "390", width: 390, height: 844 },
];

/** Collects console errors, ignoring the favicon noise Next emits in dev. */
function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    if (m.text().includes("favicon")) return;
    errors.push(`console: ${m.text()}`);
  });
  return errors;
}

async function settle(page: Page) {
  // Some pages keep a connection open, so networkidle is a best effort.
  await page
    .waitForLoadState("networkidle", { timeout: 15_000 })
    .catch(() => undefined);
  await page.waitForTimeout(1200);
  await page
    .waitForFunction(() => !document.body.innerText.includes("Loading saved"), {
      timeout: 20_000,
    })
    .catch(() => undefined);
}

async function hasHorizontalScroll(page: Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  );
}

/* ------------------------------------------------------------------ routes */

for (const size of WIDTHS) {
  test.describe(`@${size.name}px`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const route of ROUTES) {
      test(`${route.path} loads, renders its heading, no console errors, no horizontal scroll`, async ({
        page,
      }) => {
        const errors = watchConsole(page);
        const response = await page.goto(route.path);
        expect(response?.status(), `${route.path} status`).toBe(200);

        await settle(page);

        const heading = page.locator("h1").first();
        await expect(heading, `${route.path} has an h1`).toBeVisible();
        expect(
          await heading.innerText(),
          `${route.path} heading text`,
        ).toMatch(route.heading);

        expect(
          await hasHorizontalScroll(page),
          `${route.path} horizontal scroll`,
        ).toBe(false);

        expect(errors, `${route.path} console errors`).toEqual([]);
      });
    }
  });
}

/* ------------------------------------------------------------- navigation */

test("every desktop navbar link goes to its route", async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const link of NAV_LINKS) {
    // Only the header matters here, so this waits for it rather than for the
    // whole page to settle.
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const nav = page.locator("header nav a", { hasText: new RegExp(`^${link.label}$`) });
    await expect(nav.first()).toBeVisible();
    await nav.first().click();
    await page.waitForURL(`**${link.href}`);
    expect(new URL(page.url()).pathname, `${link.label} target`).toBe(link.href);
  }
});

test("every mobile menu link goes to its route", async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const link of NAV_LINKS) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Toggle menu" }).click();
    // The desktop <ul> is still in the DOM at this width, just hidden, so the
    // mobile panel is the last one.
    const item = page
      .locator("header ul")
      .last()
      .locator("a", { hasText: new RegExp(`^${link.label}$`) });
    await expect(item.first()).toBeVisible();
    await item.first().click();
    await page.waitForURL(`**${link.href}`);
    expect(new URL(page.url()).pathname, `${link.label} mobile target`).toBe(
      link.href,
    );
  }
});

test("the Get started button goes to /core", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("header a", { hasText: /^Get started$/ }).first().click();
  await page.waitForURL("**/core");
  expect(new URL(page.url()).pathname).toBe("/core");
});

/* -------------------------------------------------------------- redirects */

for (const r of REDIRECTS) {
  test(`${r.from} redirects to ${r.to}`, async ({ page }) => {
    const response = await page.goto(r.from);
    expect(response?.status(), `${r.from} final status`).toBe(200);
    expect(new URL(page.url()).pathname, `${r.from} lands on`).toBe(r.to);
  });
}

/* ---------------------------------------------------------------- anchors */

test("/demo exposes every section anchor", async ({ page }) => {
  await page.goto("/demo");
  await settle(page);
  for (const id of [
    "#product-tour",
    "#agent-map",
    "#impact",
    "#testing",
    "#version-2",
  ]) {
    await expect(page.locator(id), `${id} exists`).toHaveCount(1);
  }
});

test("/demo's product tour only shows features that exist", async ({ page }) => {
  await page.goto("/demo");
  await settle(page);

  const tour = page.locator("#product-tour");

  // Six cards, every one of them a link to a route that really serves 200.
  const cards = tour.locator("a[href^='/']");
  await expect(cards, "six tour cards").toHaveCount(6);
  const hrefs = await cards.evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  );
  expect(new Set(hrefs), "tour routes").toEqual(
    new Set(["/core", "/chat", "/research", "/pricing", "/marketing"]),
  );
  for (const href of new Set(hrefs)) {
    const res = await page.request.get(href as string);
    expect(res.status(), `${href} reachable`).toBe(200);
  }

  // Nothing in the tour may be advertised as not built.
  const tourText = await tour.innerText();
  expect(tourText, "no Planned pill in the tour").not.toContain("Planned");
  for (const gone of ["Shop", "Cook", "Track"]) {
    expect(tourText, `${gone} is not a tour feature`).not.toContain(gone);
  }

  // The unbuilt ideas live on the roadmap instead.
  const roadmap = await page.locator("#version-2").innerText();
  expect(roadmap).toContain("Shopping list from the plan");
  expect(roadmap).toContain("Favorite meals and child profiles");
  expect(roadmap).toContain("Idea, not built");
});

test("/demo cites the source for its impact evidence", async ({ page }) => {
  await page.goto("/demo");
  await settle(page);

  const link = page.locator('#impact a[href*="ensanut.insp.mx"]');
  await expect(link, "ENSANUT source link present").toHaveCount(1);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);

  const text = await page.evaluate(() => document.body.innerText);
  expect(text, "overweight figure").toContain("19.2%");
  expect(text, "obesity figure").toContain("18.1%");
  expect(text, "says plainly it is not a Lunchies result").toContain(
    "not a Lunchies result",
  );
});

test("/dashboard exposes #testing and #saved-records, and reports honestly", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await settle(page);
  await expect(page.locator("#testing")).toHaveCount(1);
  await expect(page.locator("#saved-records")).toHaveCount(1);

  const testing = page.locator("#testing");

  // The regression row must carry a real result, phrased the one way
  // lib/week6Data.ts phrases it.
  await expect(
    testing.getByText(/^\d+\/\d+ checks passed$/),
    "regression row shows its result",
  ).toHaveCount(1);

  // The external user test has now run, so its real result must be on the
  // page, phrased the one way lib/week6Data.ts phrases it.
  await expect(
    testing.getByText("6 of 6 generated a plan", { exact: true }),
    "external users row shows the real result",
  ).toHaveCount(1);
  await expect(
    testing.getByText("6 findings", { exact: true }),
    "main findings row shows how many findings there are",
  ).toHaveCount(1);

  // Every one of those findings is listed in full, in the card that now
  // holds them, and that card is reachable by its own anchor.
  await expect(page.locator("#findings")).toHaveCount(1);
  const findings = page.locator("#findings");
  for (const finding of [
    "The plan works and was rated well.",
    "The dashboard was the most confusing page",
    "although Lunchies does not sell or deliver food",
    "The chat has few answer options",
    "Liked: design and ease of use (3 mentions)",
    "Requested: characters for kids",
  ]) {
    await expect(
      findings.getByText(finding, { exact: false }),
      `findings list mentions: ${finding}`,
    ).not.toHaveCount(0);
  }
  await expect(
    findings.getByText("6 findings", { exact: true }),
    "the findings card carries the same count as the row",
  ).toHaveCount(1);

  // The sample limit travels with the numbers.
  await expect(
    testing.getByText(/tendencies rather than a representative sample/),
    "the testing note states the sample limit",
  ).toHaveCount(1);

  // Nothing on the page is pending any more.
  const pending = await page.getByText("Pending", { exact: true }).count();
  expect(pending, "no row claims to be pending once it has a result").toBe(0);

  // Basic and Plus bring in the same revenue on the default split, so the
  // page must show the tie instead of crowning one of them.
  await expect(
    page.getByText("Basic = Plus", { exact: true }),
    "the tied plans are shown as a tie",
  ).toHaveCount(1);
  await expect(
    page.getByText(/tied for top plan by revenue, \d+% each/),
    "the tie is labelled, with the share each plan holds",
  ).toHaveCount(1);

  // The tile agrees with the row, and the page says what it is.
  await expect(
    page.getByText("external users tested", { exact: true }),
    "the stat tile labels the head count",
  ).toHaveCount(1);
  await expect(
    page.getByText(/This page is the project status summary/),
    "the hero says plainly what this page is",
  ).toHaveCount(1);
});

test("/demo's short testing step mirrors the same result", async ({ page }) => {
  await page.goto("/demo");
  await settle(page);
  const testing = page.locator("#testing");
  await expect(
    testing.getByText(/^\d+\/\d+ checks passed$/),
    "regression step shows its result",
  ).toHaveCount(1);
  // The user-test step carries its real result here too.
  await expect(
    testing.getByText("6 external users", { exact: true }),
    "the user-test step names the head count",
  ).toHaveCount(1);
  await expect(
    testing.getByText(/6 of 6 generated a plan . usefulness 4\.5\/5/),
    "the user-test step shows the real result",
  ).toHaveCount(1);
  expect(
    await testing.getByText("Pending", { exact: true }).count(),
    "no testing step claims to be pending once it has a result",
  ).toBe(0);

  // The ratings and the risks now share one quiet strip under the agent
  // map and impact row, instead of sitting inside the impact card.
  const impact = page.locator("#context-limits");
  await expect(impact, "the context strip exists").toHaveCount(1);
  await expect(
    impact.getByText("What testers said (context, not proof of impact)", {
      exact: true,
    }),
    "the tester block is labelled as context, not as proof",
  ).toHaveCount(1);
  await expect(
    impact.getByText("Plan usefulness 4.5/5 (n=6).", { exact: true }),
    "plan usefulness is shown with its sample size",
  ).toHaveCount(1);
  await expect(
    impact.getByText("Chat usefulness 4.0/5 (5 people).", { exact: true }),
    "chat usefulness is shown with how many people used the chat",
  ).toHaveCount(1);
  await expect(
    impact.getByText(/These are tendencies, not a representative sample\./),
    "the tester block states the sample limit",
  ).toHaveCount(1);
  await expect(
    impact.getByText("Risks and limits", { exact: true }),
    "the risks sit in the same strip",
  ).toHaveCount(1);
  await expect(
    impact.getByText(/An allergy mistake is the most serious risk/),
    "the allergy risk is still spelled out",
  ).toHaveCount(1);

  // The hero says what Lunchies is not, after a tester read it as delivery.
  await expect(
    page.getByText(/it does not sell or deliver food/),
    "the hero rules out selling or delivering food",
  ).toHaveCount(1);
});

/* ------------------------------------------------- dashboard record counts */

test("/dashboard shows record counts and leaks no personal data", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await settle(page);

  // Counts rendered for each table the page is allowed to read.
  for (const table of [
    "core_outputs",
    "research_notes",
    "pricing_scenarios",
    "marketing_assets",
    "ab_events",
    "chat_sessions",
  ]) {
    await expect(
      page.getByText(table, { exact: false }).first(),
      `${table} named`,
    ).toBeVisible();
  }
  const counts = await page
    .locator("#saved-records")
    .getByText(/^\d[\d,]*$/)
    .count();
  expect(counts, "at least one numeric count rendered").toBeGreaterThan(0);

  const text = await page.evaluate(() => document.body.innerText);
  expect(text, "no email address").not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]{2,}/);
  expect(text, "no phone number").not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
  expect(text.toLowerCase(), "no allergies wording").not.toContain("allergies");
  for (const allergen of ["Peanuts", "Dairy", "Gluten", "Shellfish"]) {
    expect(text, `no ${allergen}`).not.toContain(allergen);
  }

  // Nothing on this page may query the contacts table.
  const requested: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/rest/v1/")) requested.push(r.url());
  });
  await page.reload();
  await settle(page);
  expect(
    requested.filter((u) => u.includes("review_requests")),
    "review_requests is never queried",
  ).toEqual([]);
});

/* ------------------------------------------------------- one flow per module */

test("/core generates a 5-day plan without saving anything", async ({ page }) => {
  await page.goto("/core");
  await settle(page);
  await page.getByRole("button", { name: "Peanuts" }).click();
  await page.getByRole("button", { name: "Generate menu" }).click();
  await expect(page.getByText("Generated", { exact: true })).toBeVisible();
  for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) {
    await expect(page.getByRole("heading", { name: day })).toBeVisible();
  }
  // Save plan is left alone on purpose: it would write a permanent row.
  await expect(page.getByRole("button", { name: "Save plan" })).toBeVisible();
});

test("/research loads its competitor table and filters it", async ({ page }) => {
  await page.goto("/research");
  await settle(page);
  const table = page.locator("table").first();
  const before = await table.locator("tbody tr").count();
  expect(before, "competitor rows").toBeGreaterThan(0);
  await page.fill('input[placeholder="Search by name..."]', "lunchies");
  await page.waitForTimeout(400);
  expect(await table.locator("tbody tr").count()).toBeLessThan(before);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.waitForTimeout(400);
  expect(await table.locator("tbody tr").count()).toBe(before);
});

test("/pricing recalculates when a slider moves", async ({ page }) => {
  await page.goto("/pricing");
  await settle(page);
  const number = page.locator('input[type="number"]').first();
  const before = await number.inputValue();
  await page.locator('input[type="range"]').first().focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  expect(await number.inputValue(), "slider moved").not.toBe(before);
  await page.getByRole("button", { name: "Reset to defaults" }).click();
  await page.waitForTimeout(400);
  expect(await number.inputValue(), "reset restored").toBe(before);
});

test("/marketing switches tabs", async ({ page }) => {
  await page.goto("/marketing");
  await settle(page);
  const tabs = page.locator('[role="tab"]');
  expect(await tabs.count(), "tab count").toBeGreaterThan(1);
  const target = tabs.nth(1);
  const label = (await target.innerText()).trim();
  await target.click();
  await page.waitForTimeout(600);
  await expect(target, `${label} selected`).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("/chat?test=1 answers an intake question and cleans up its row", async ({
  page,
  request,
}) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  await page.goto("/chat?test=1");
  await settle(page);

  // Answer the first intake question with a quick reply.
  const reply = page.getByRole("button", { name: "5-6" }).first();
  await expect(reply).toBeVisible();
  await reply.click();
  await page.waitForTimeout(1200);

  // The assistant must have said something back.
  const text = await page.evaluate(() => document.body.innerText);
  expect(text.length, "chat produced a reply").toBeGreaterThan(200);

  // Remove every is_test row this run created, the way tests/chat.test.ts does.
  if (url && key) {
    const res = await request.delete(
      `${url}/rest/v1/chat_sessions?is_test=eq.true`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    expect([200, 204].includes(res.status()), "test rows cleaned up").toBe(true);
  }
});
