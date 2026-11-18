# Pre-publication Test Report — True Housing Property Search Demo

**Status: pre-publication code package passed the checks below.** This report applies to the audited ZIP, **not automatically to files on another computer or a future GitHub deployment**.

## 1. Automated unit tests — PASS (20/20)

Command run with Node.js v22.16.0:

```bash
node --test tests/logic.test.js
```

Covered: case-insensitive search by title/location; query trimming; no-match result; combined filters; bedroom selection; inclusive maximum rent; ascending/descending sorting; unchanged source order; favorites-only behavior; validation of valid inputs, invalid rents, fractional rents, title/location length, bedroom bounds, unsupported furnishing; INR formatting.

Both JavaScript files also passed Node syntax checks (`node --check`).

## 2. Browser interaction smoke checks — PASS (22/22)

Executed with headless Chromium against the project's exact HTML, CSS and JavaScript **in an isolated inlined document**. The sandbox blocks direct navigation to `file://` and localhost addresses, so styles, scripts, and logo were loaded inline. An in-memory mock of `localStorage` was used to inspect save operations; this is **not a substitute for verifying persistence across actual browser reloads on Windows**.

Successful checks:

1. Three initial demo cards render.
2. Branded TH logo loads.
3. Case-insensitive location search works.
4. 2 BHK filter works.
5. Maximum rent filter includes exact boundary.
6. Price sorting works in both directions.
7. No-results message appears.
8. Favorites and saved-only filtering work.
9. Favorite change is written to storage adapter.
10. New demo property can be created.
11. Existing demo property can be edited.
12. Enquiry creation, status update, and storage write work.
13. Demo enquiry can be removed.
14. Demo property can be deleted.
15. HTML-like input is rendered as inert text (basic DOM injection check).
16. Reset restores the original three demo records.
17. No uncaught JavaScript error on the desktop test path.
18. No desktop horizontal overflow at 1440px viewport.
19. Three property cards render at mobile viewport.
20. No mobile horizontal overflow at 375px viewport.
21. Mobile search works.
22. No uncaught JavaScript error on the mobile test path.

Screenshots of the clean sample state are included in `screenshots/` for documentation. The browser smoke harness is a testing-only adapter and is not required to run the app.

## 3. Static review — PASS with known limitations

- Required relative asset paths resolve: CSS, both JS files, and logo PNG.
- No duplicated HTML IDs; HTML document declares `lang=en`.
- Property and enquiry form elements are labeled.
- The script load order is `logic.js` before `script.js`.
- No external scripts, runtime API calls, or third-party packages are required.
- No apparent hardcoded credentials or sample customer personal information.
- User strings are added to the DOM through `textContent`, not `innerHTML`.
- Bright green heading text and focus outline were changed to darker green on light backgrounds to improve contrast; the brand's bright green remains on filled controls.

These checks do not amount to a formal WCAG audit, penetration test, or production security certification.

## 4. Still requiring confirmation on your laptop

- Real `localStorage` persistence across a page refresh in Chrome/Edge on your chosen origin.
- Browser console has no errors when opening your extracted project.
- Dialog keyboard operation and keyboard focus in the browser you use.
- Layout on any physical devices you plan to show.
- Public GitHub repo contains the intended files with no private customer data or secrets.

## 5. Accurate project scope

This is a **client-side student portfolio demo** using fictional listing data. It is **not** a live True Housing brokerage service, and it has **no backend, database, authentication, server validation or multi-user sync**. Do not input real client names, phone numbers, property-owner details, or actual enquiries.
