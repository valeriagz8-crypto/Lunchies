# Regression report

Generated from the output of `npm run test:regression`. Every number below
comes from that run; nothing here is written by hand.

- **Date:** 2026-11-16
- **Commit:** `609433c`
- **Runner:** Playwright ^1.65.0, Chromium, production build served on port 3210
- **Checks run:** 38
- **Passed:** 38
- **Failed:** 0
- **Duration:** 105.1s

No check failed in this run.

## Routes covered

Each route is checked at **1280px** and at **390px** for: HTTP 200, a
visible `h1` matching the expected heading, zero console errors and no
horizontal scroll.

| Route | 1280px | 390px |
| --- | --- | --- |
| `/` | pass | pass |
| `/core` | pass | pass |
| `/research` | pass | pass |
| `/product` | pass | pass |
| `/pricing` | pass | pass |
| `/marketing` | pass | pass |
| `/chat` | pass | pass |
| `/docs` | pass | pass |
| `/demo` | pass | pass |
| `/dashboard` | pass | pass |

## Redirects checked

All four were placeholder pages that nothing linked to. Each now returns a
permanent redirect.

| From | Lands on |
| --- | --- |
| `/about` | `/` |
| `/how-it-works` | `/#how-it-works` |
| `/plans` | `/product` |
| `/roadmap` | `/demo#version-2` |

## Reporting honesty

Two checks guard the rule that nothing may claim a result it does not have:

- `/dashboard#testing` must show the regression result in the one phrasing
  `lib/week6Data.ts` defines, and the external users and main findings rows
  must still read **Pending**.
- `/demo`'s short testing step must mirror the same result and keep its
  external users row **Pending**.

## What each check covers

| # | Check | Viewport | Result | Time |
| --- | --- | --- | --- | --- |
| 1 | every desktop navbar link goes to its route | — | pass | 1.4s |
| 2 | every mobile menu link goes to its route | — | pass | 1.4s |
| 3 | the Get started button goes to /core | — | pass | 0.2s |
| 4 | /about redirects to / | — | pass | 0.1s |
| 5 | /how-it-works redirects to / | — | pass | 0.1s |
| 6 | /plans redirects to /product | — | pass | 0.1s |
| 7 | /roadmap redirects to /demo | — | pass | 0.1s |
| 8 | /demo exposes every section anchor | — | pass | 2.0s |
| 9 | /demo's product tour only shows features that exist | — | pass | 2.1s |
| 10 | /demo cites the source for its impact evidence | — | pass | 2.0s |
| 11 | /dashboard exposes #testing and #saved-records, and reports honestly | — | pass | 2.6s |
| 12 | /demo's short testing step mirrors the same result | — | pass | 2.0s |
| 13 | /dashboard shows record counts and leaks no personal data | — | pass | 5.1s |
| 14 | /core generates a 5-day plan without saving anything | — | pass | 3.3s |
| 15 | /research loads its competitor table and filters it | — | pass | 3.7s |
| 16 | /pricing recalculates when a slider moves | — | pass | 3.9s |
| 17 | /marketing switches tabs | — | pass | 4.2s |
| 18 | /chat?test=1 answers an intake question and cleans up its row | — | pass | 4.5s |
| 19 | / loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.8s |
| 20 | /core loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 3.0s |
| 21 | /research loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 3.2s |
| 22 | /product loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.3s |
| 23 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.6s |
| 24 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.7s |
| 25 | /chat loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 3.4s |
| 26 | /docs loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.9s |
| 27 | /demo loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.3s |
| 28 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.8s |
| 29 | / loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.1s |
| 30 | /core loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |
| 31 | /research loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |
| 32 | /product loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 33 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.5s |
| 34 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |
| 35 | /chat loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 36 | /docs loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.0s |
| 37 | /demo loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.0s |
| 38 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.6s |

## Data safety

The suite never edits or deletes data that was already in Supabase.

- `/core` generates a plan but never presses **Save plan**.
- `/research` filters and resets, `/pricing` moves a slider and resets and
  `/marketing` switches a tab. None of these write a row.
- `/chat` is opened with `?test=1`, so the row it creates is marked
  `is_test`, and the suite deletes those rows afterwards, exactly as
  `tests/chat.test.ts` does.
- `/dashboard` is scanned for leaks: no email address, no phone number, no
  allergen name and no "allergies" wording may appear, and the
  `review_requests` table must never be queried.

## Relationship to `npm test`

`npm test` is unchanged and still runs only the 48 Vitest unit tests.
Vitest is configured to exclude `tests/e2e`, so the two suites never
collect each other.

