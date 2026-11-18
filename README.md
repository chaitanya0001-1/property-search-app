# True Housing — Property Search & Management System

A **vanilla JavaScript** portfolio demonstration branded for **True Housing**, based on a rental brokerage workflow. Browse example properties, filter/sort listings, save favorites, add/edit/delete properties, and track demo enquiries and follow-up statuses. The interface is responsive and persists data using the browser's `localStorage`.

> **Important:** This branded interface is a student portfolio demo, not the operational True Housing website. All included listings are illustrative sample data. This is a client-side demo, **not** a production real-estate platform. There is no backend, database, login, server validation, or access control. Do not store real customer information in this demo.

## Preview

Desktop screenshot:

![True Housing desktop preview](screenshots/desktop.png)

Mobile screenshot: [View mobile preview](screenshots/mobile.png)

## Features

- Search by property title or location (case-insensitive)
- Filter by bedroom count, maximum rent, and favorites
- Sort by monthly rent (ascending/descending)
- Save and unsave favorite properties
- Create, edit, and delete demo property records with validation
- Create demo enquiries, update follow-up status, and remove enquiries
- Persist properties, favorites, and enquiries in `localStorage`
- Display summary KPIs (property count, favorites, active enquiries)
- Responsive layout and basic semantic accessibility
- Automated tests of filtering, sorting, formatting, and validation

## Run locally (no setup required)

1. Download/extract the project ZIP.
2. Open `index.html` in Chrome or Edge (double-click the file).
3. Try searching for `Mohali`, selecting 2 BHK, setting max rent to `32000`, and sorting by rent.
4. Click **+ Add property** to add a demo record.
5. Click **+ Enquiry** on a card; then change the enquiry's follow-up status.
6. Refresh your browser. Your changes should remain, provided browser storage is enabled.
7. Click **Reset sample data** to restore the original three demo listings.

No npm packages, build tool, or internet access required. For more predictable browser behavior, you can also run the folder with VS Code Live Server, but that is optional.

## Replace your previous starter files safely

If you already created `C:\Users\Chaitanya Sharma\code\property-search-app`:

1. Close its open files in VS Code.
2. Make a backup copy of that folder: `property-search-app-backup`.
3. Extract this ZIP into a separate folder.
4. Copy all files and the `tests` subfolder from the extracted folder into your existing `property-search-app`, replacing `index.html`, `style.css`, and `script.js` **only after confirming the backup**. You'll also be adding `logic.js`, `README.md`, `INTERVIEW_GUIDE.md`, and `tests/logic.test.js`.
5. Open `index.html` and test the app.

Do not copy the project into your unrelated `git-setup-practice` repository.

## Project structure

```text
property-search-app/
├── assets/                # True Housing logo assets and favicon
│   ├── true-housing-mark.png
│   └── true-housing-logo-original.png
├── index.html             # Semantic page, controls, forms, and dialogs
├── style.css              # Layout, responsiveness, visual design
├── logic.js               # Pure filter/sort/validation/currency functions
├── script.js              # State, localStorage, events, and DOM rendering
├── tests/
│   └── logic.test.js      # Twenty automated logic tests (Node.js)
├── INTERVIEW_GUIDE.md     # Explanation and interview preparation
└── README.md              # This file
```

## How it works

1. The browser loads `index.html`, then `logic.js`, then `script.js`.
2. `script.js` loads saved state from `localStorage` (or three sample properties).
3. It reads search/filter UI values and calls `PropertyLogic.filterAndSort`.
4. `renderProperties` generates property cards using `document.createElement` and `textContent`.
5. Click handlers update the in-memory `state`, persist it, and rerender the relevant UI.
6. A separate enquiry area shows and updates enquiries with New / Contacted / Closed statuses.

## Run the tests (optional)

If Node.js is installed, from the project folder run:

```powershell
node --test tests/logic.test.js
```

Expected: **20 tests pass**. Node.js is used only for the test runner; the app itself uses the browser and needs no Node installation.

## Example Git workflow for the portfolio repository

After verifying the app, create a **new public repository** named `property-search-app` (do **not** reuse `git-setup-practice`). If you choose to create an empty GitHub repo with **no README**, run these commands in the project directory:

```powershell
git init
git branch -M main
git add .
git commit -m "Build rental property search and enquiry demo"
git remote add origin https://github.com/chaitanya0001-1/property-search-app.git
git push -u origin main
```

**Check first:** If the directory is already a Git repository, do not blindly run `git init` or add a duplicate `origin`; instead inspect `git status` and `git remote -v` before pushing. Also review files before committing: don't publish secrets or real customer information.

## Limitations and production upgrades

- `localStorage` is device/browser-specific and not suitable for real multi-user workflows.
- There is no authentication, authorization, database, or server-side validation.
- No external API is used; there are no real listings or images.
- User-provided content is inserted using `textContent` to avoid HTML injection in this UI, but a real app would additionally validate inputs on the server.
- Better future work: a Java/Spring Boot REST API, PostgreSQL, proper authentication, structured logging, and integration tests. These are **future upgrades**, not features of this version.

See `INTERVIEW_GUIDE.md` for the honest one-minute pitch, code walkthrough, algorithm complexity, and common interview questions.

## Branding

The interface uses the True Housing name and navy/green brand palette. The original TH logo image is included unchanged at `assets/true-housing-logo-original.png`, while a cropped emblem from that same image is used in the navigation and hero (`assets/true-housing-mark.png`). If your current official logo differs, replace those assets rather than recreating the logo.

Older browser data saved by the previous StayScope-branded version is read once and copied to the new `true-housing-portfolio-demo-v1` localStorage key, where browser storage permits.

## Pre-publication checks

See [TEST_REPORT.md](TEST_REPORT.md) for the automated tests, isolated browser interactions, security review, and limits of verification. Follow [GITHUB_PUBLISH_GUIDE.md](GITHUB_PUBLISH_GUIDE.md) to publish a verified version. Browser-based persistence on your own laptop should still be confirmed manually before publishing.

## Local test checklist before sharing the GitHub URL

- Open `index.html` on your Windows laptop and confirm the logo is visible.
- Search `Sector 79`, clear filters, select 2 BHK, and set max rent to ₹32,000.
- Save and unsave a property; test the Saved only checkbox.
- Add a **fictional** property, edit it, and delete it.
- Add a fictional enquiry; change its status, then remove it.
- Refresh the page and confirm your demo changes persist in the **same browser and origin**.
- Check DevTools Console for JavaScript errors.
- Reset sample data before recording your portfolio demo.

**Storage note:** Opening via `file://` and running under `http://localhost` use different storage origins. Browser policy can also restrict local-file storage, so use one consistent origin while testing. Avoid using real customer data.
