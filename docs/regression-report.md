# Regression report

Generated from the output of `npm run test:regression`. Every number below
comes from that run; nothing here is written by hand.

- **Date:** 2026-11-12
- **Commit:** `36b1a08`
- **Runner:** Playwright ^1.65.0, Chromium, production build served on port 3210
- **Checks run:** 36
- **Passed:** 36
- **Failed:** 0
- **Duration:** 94.5s

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
| 1 | every desktop navbar link goes to its route | — | pass | 1.7s |
| 2 | every mobile menu link goes to its route | — | pass | 1.9s |
| 3 | the Get started button goes to /core | — | pass | 1.1s |
| 4 | /about redirects to / | — | pass | 0.2s |
| 5 | /how-it-works redirects to / | — | pass | 0.5s |
| 6 | /plans redirects to /product | — | pass | 0.2s |
| 7 | /roadmap redirects to /demo | — | pass | 0.2s |
| 8 | /demo exposes every section anchor | — | pass | 2.0s |
| 9 | /dashboard exposes #testing and #saved-records, and reports honestly | — | pass | 2.6s |
| 10 | /demo's short testing step mirrors the same result | — | pass | 2.0s |
| 11 | /dashboard shows record counts and leaks no personal data | — | pass | 4.6s |
| 12 | /core generates a 5-day plan without saving anything | — | pass | 2.4s |
| 13 | /research loads its competitor table and filters it | — | pass | 3.5s |
| 14 | /pricing recalculates when a slider moves | — | pass | 3.2s |
| 15 | /marketing switches tabs | — | pass | 2.9s |
| 16 | /chat?test=1 answers an intake question and cleans up its row | — | pass | 3.5s |
| 17 | / loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.4s |
| 18 | /core loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.4s |
| 19 | /research loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.4s |
| 20 | /product loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.0s |
| 21 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.3s |
| 22 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.6s |
| 23 | /chat loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.2s |
| 24 | /docs loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.0s |
| 25 | /demo loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.0s |
| 26 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.6s |
| 27 | / loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 28 | /core loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.3s |
| 29 | /research loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.1s |
| 30 | /product loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 31 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.3s |
| 32 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.9s |
| 33 | /chat loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.8s |
| 34 | /docs loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.3s |
| 35 | /demo loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.1s |
| 36 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |

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

