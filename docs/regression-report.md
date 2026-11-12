# Regression report

Generated from the output of `npm run test:regression`. Every number below
comes from that run; nothing here is written by hand.

- **Date:** 2026-11-12
- **Commit:** `078db22`
- **Runner:** Playwright ^1.65.0, Chromium, production build served on port 3210
- **Checks run:** 35
- **Passed:** 35
- **Failed:** 0
- **Duration:** 105.8s

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

## What each check covers

| # | Check | Viewport | Result | Time |
| --- | --- | --- | --- | --- |
| 1 | every desktop navbar link goes to its route | — | pass | 1.5s |
| 2 | every mobile menu link goes to its route | — | pass | 1.9s |
| 3 | the Get started button goes to /core | — | pass | 0.8s |
| 4 | /about redirects to / | — | pass | 0.2s |
| 5 | /how-it-works redirects to / | — | pass | 0.1s |
| 6 | /plans redirects to /product | — | pass | 0.2s |
| 7 | /roadmap redirects to /demo | — | pass | 0.1s |
| 8 | /demo exposes every section anchor | — | pass | 1.9s |
| 9 | /dashboard exposes #testing and #saved-records | — | pass | 2.6s |
| 10 | /dashboard shows record counts and leaks no personal data | — | pass | 4.5s |
| 11 | /core generates a 5-day plan without saving anything | — | pass | 2.8s |
| 12 | /research loads its competitor table and filters it | — | pass | 3.7s |
| 13 | /pricing recalculates when a slider moves | — | pass | 5.2s |
| 14 | /marketing switches tabs | — | pass | 3.8s |
| 15 | /chat?test=1 answers an intake question and cleans up its row | — | pass | 4.7s |
| 16 | / loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.3s |
| 17 | /core loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.5s |
| 18 | /research loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.5s |
| 19 | /product loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.1s |
| 20 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.3s |
| 21 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.8s |
| 22 | /chat loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 3.9s |
| 23 | /docs loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 3.2s |
| 24 | /demo loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.4s |
| 25 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 1280px | pass | 2.5s |
| 26 | / loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.0s |
| 27 | /core loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |
| 28 | /research loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 3.1s |
| 29 | /product loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 3.2s |
| 30 | /pricing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.5s |
| 31 | /marketing loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.2s |
| 32 | /chat loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 33 | /docs loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 34 | /demo loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 1.9s |
| 35 | /dashboard loads, renders its heading, no console errors, no horizontal scroll | 390px | pass | 2.4s |

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

