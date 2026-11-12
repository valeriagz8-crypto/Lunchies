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
  { path: "/demo", heading: /Lunchies in/i },
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

  // The two rows that have no result must still say Pending, on both pages.
  const pending = await testing.getByText("Pending", { exact: true }).count();
  expect(pending, "external users and main findings stay Pending").toBe(2);
});

test("/demo's short testing step mirrors the same result", async ({ page }) => {
  await page.goto("/demo");
  await settle(page);
  const testing = page.locator("#testing");
  await expect(
    testing.getByText(/^\d+\/\d+ checks passed$/),
    "regression step shows its result",
  ).toHaveCount(1);
  expect(
    await testing.getByText("Pending", { exact: true }).count(),
    "external users stays Pending on /demo",
  ).toBe(1);
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
