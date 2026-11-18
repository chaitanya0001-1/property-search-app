# Interview guide — True Housing Property Search & Management

## Read this first: what you actually built

This project is a **responsive, client-side rental property search and simple enquiry-tracking demo**, built with HTML, CSS, and **vanilla JavaScript** (no React, Node/Express, Spring Boot, database, or AWS in this version). All entries are sample data. State is persisted in the browser with `localStorage`, so it survives refreshes in that browser, but it is not synced across devices.

You can accurately describe the features that are present: property listing CRUD, dynamic rendering using the DOM, filtering/sorting, favorites, form validation, local storage, enquiry status tracking, and automated logic tests. Distinguish what you personally implemented, modified, debugged, and reviewed. If AI helped generate parts, be prepared to explain your use of it.

Do **not** claim it is a production-ready full-stack platform, deployed app, database-backed CRM, secure PII system, or cloud application. Also don't claim you personally wrote every line unless you've reviewed and can explain it and have adapted/debugged it yourself.

## Your 45–60 second interview pitch

> I built True Housing, a rental property search and management demo using HTML, CSS, and vanilla JavaScript. It lets users search and filter sample listings by location, bedroom count, and budget, sort them by price, and save favorites. I added basic CRUD for listings and an enquiry tracker with follow-up statuses. The data is stored in localStorage so the demo works without a backend, and I separated pure filtering and validation logic from the DOM layer so those functions could be unit-tested. I chose this problem because I understand rental inventory and enquiries from business operations. The main limitations are that it is single-browser and has no authentication or server database; a next step would be a Java REST API and database.

## Explain the architecture in plain language

```text
User types or clicks in HTML
          ↓
Event listener in script.js
          ↓
Read / update application state
          ↓
Pure logic in logic.js (filter, sort, validate)
          ↓
DOM rerender (cards, KPIs, leads)
          ↓
Persist changes as JSON in localStorage
```

### File responsibilities

- **index.html**: Structure and semantics. The `<section id="property-list">` is an empty container that JavaScript fills. Controls include search, selects, a checkbox, and dialog forms.
- **style.css**: Colors, spacing, cards, CSS Grid, Flexbox, and media queries. Desktop property grid has three columns, then two, then one on narrow screens.
- **logic.js**: Pure functions `filterAndSort`, `validateProperty`, `formatINR`, which do not manipulate the browser DOM and are easy to test.
- **script.js**: Holds `state`, handles button/field events, creates DOM nodes, saves/restores localStorage, and rerenders sections.
- **tests/logic.test.js**: Twenty tests using Node's built-in test runner and `assert` module.

## Core JavaScript concepts to know

| Concept | Where used | Interview explanation |
|---|---|---|
| `const`, `let` | Across JS files | `const` prevents rebinding; `let` is used for state references that change. |
| Objects | Individual property / enquiry | Keep related values together as key-value pairs, e.g. `{id, title, rent}`. |
| Arrays | `properties`, `favorites`, `leads` | Collections of records, filtered or iterated over. |
| `.filter()` | `logic.js` | Returns a new array of records matching predicates. |
| `.sort()` | `logic.js` | Reorders records by numeric rent; sorts a filtered array rather than mutating source records. |
| `.map()` | `renderProperties` / editing | Transform records into DOM cards or replace one record immutably. |
| `.find()` | Edit, delete, new enquiry | Find a specific property by ID. |
| `.includes()` | Favorites, query matching | Membership check / substring matching. |
| Template literals | Display and search strings | Backtick strings with `${...}` placeholders. |
| Arrow functions | Event callbacks, array methods | Compact function expressions capturing lexical context. |
| `addEventListener()` | Buttons, forms, filters | React to click, submit, input, and change events. |
| DOM APIs | `createElement`, `textContent`, `replaceChildren` | Build HTML cards from JS, safely rendering text without injecting it as HTML. |
| `JSON.stringify/parse` | Persistence | Convert state to/from a string for browser storage. |
| `localStorage` | Save and load | Browser-local persistence; **not** a real database. |
| `try/catch` | Storage operations | Handle unavailable/corrupted storage without crashing the whole app. |
| `preventDefault()` | Form submit | Stop browser navigation/reload so JS can validate and save data. |

### Know these functions precisely

**`PropertyLogic.filterAndSort(properties, filters, favorites)`**

1. Convert the search query to lowercase and remove surrounding spaces.
2. `filter()` every property by title/location substring, bedrooms, maximum rent, and favorites.
3. If price sorting is requested, call `sort()` with `a.rent - b.rent` (ascending) or `b.rent - a.rent` (descending).
4. Return the filtered array. It does not mutate the original `properties` array.

**`renderProperties()`**

1. Read current filter UI values.
2. Obtain visible properties by calling `filterAndSort`.
3. Use `.map(renderCard)` to create an HTML `article` per property.
4. Use `propertyList.replaceChildren(...cards)` to put cards in the page.
5. Update the result count, empty state, and KPI numbers.

**`persist()` and `loadState()`**

- `persist()` saves `JSON.stringify(state)` using `localStorage.setItem`.
- `loadState()` loads `localStorage.getItem` and parses it, or falls back to sample properties.
- Every edit only affects this browser. This has no server, accounts, access control, or syncing.

**`validateProperty()`**

- Trims text; converts `rent` and `bedrooms` to numbers.
- Rejects missing title/location, nonpositive rent, unsupported bedroom/furnishing values.
- Returns `{ valid, errors, property }` rather than modifying the UI directly.

## Expected complexity (for N properties)

- **Search / filters:** O(N), since `filter()` checks each property once.
- **Price sorting:** O(K log K) on K matching records in typical JavaScript implementations; worst-case sort complexity is implementation-dependent.
- **Finding one by ID using `.find()`:** O(N).
- **Toggle favorite using an array:** O(F) to find the saved ID, where F is number of favorites.
- **Rendering K cards:** O(K) DOM elements, plus browser layout work.

This is completely acceptable for a small demo. For much larger datasets, the backend would handle filtering and pagination, and an indexed DB would improve lookups.

## Five practical demos to rehearse

1. **Search:** Type `mohali` in lowercase. Explain case-insensitive `.includes()` and how two matching records are returned.
2. **Combine filters:** Select 2 BHK + max rent ₹32,000. Explain how each `filter` predicate combines with AND.
3. **Sorting:** Switch low-to-high and high-to-low. Explain numeric comparator `a.rent - b.rent`.
4. **CRUD and persistence:** Add a sample property, edit it, refresh, then delete. Explain localStorage + rerender.
5. **Enquiry lifecycle:** Add a demo enquiry and change New → Contacted → Closed. Explain state change and KPI updates.

## Interview questions with accurate answers

**1. Why did you choose this project?**

I have practical experience with rental inventory and incoming enquiries. I wanted to turn that workflow into a functional software demo while learning DOM APIs, state handling, filtering, and validation.

**2. Why vanilla JavaScript instead of React?**

I wanted to understand the DOM, event handling, and state changes at a fundamental level. React could help organize a larger app later, but I haven't used it here.

**3. What's the DOM?**

The browser's object representation of HTML. I select elements with `getElementById` and generate property cards with `createElement` and `replaceChildren`.

**4. What happens when I search?**

An `input` event triggers `renderProperties`; that reads the search text, calls a pure filter function, then replaces the displayed cards with matches.

**5. What is CRUD?**

Create, Read, Update, Delete. I implemented these operations for demo property records using an in-memory array and localStorage persistence.

**6. Why use `textContent` instead of `innerHTML` for user text?**

`textContent` treats user input as text, not HTML markup, reducing the risk of DOM-based HTML injection.

**7. What if I refresh the page?**

The app restores JSON state from localStorage. If there is no saved state, it loads three example listings.

**8. Is localStorage a database?**

No. It is browser-side key-value storage and is not shared across users/devices. It is unsuitable for sensitive customer records.

**9. How did you test it?**

The project includes 20 automated unit tests for filtering, sorting, formatting, and validation using Node's built-in test runner. There were also 22 smoke checks in an isolated Chromium harness. I still need to confirm browser storage persistence on my own Windows machine before saying I tested that personally.

**10. How would you turn it into a real application?**

Use a Java Spring Boot backend for REST endpoints, a SQL database, server-side validation, authentication and authorization, pagination, and deployment. I have not implemented these components yet.

**11. How would you prevent duplicate listing IDs?**

The demo uses timestamp-based IDs for newly added data, which is convenient but not a fully collision-proof strategy. Production would generate IDs on the backend, typically using database-generated IDs or UUIDs.

**12. What is the main technical limitation?**

Data is stored in one browser with no authentication, backend, multi-device synchronization, or production-grade validation. It is a portfolio demo, not a deployed brokerage system.

## Resume bullets — use after running and understanding the project

**True Housing | Property Search & Management System** — HTML, CSS, JavaScript, Git

- Built a responsive rental listing application with multi-criteria search, rent-based sorting, favorites, and property CRUD operations.
- Implemented dynamic DOM rendering, client-side validation, and browser-based persistence using `localStorage`.
- Includes an enquiry follow-up workflow and 20 automated unit tests for core filtering, sorting, and validation logic.

Only use the bullets if they remain true for the final version that you have tested and uploaded. Link to the actual repository once published.

## What to do if asked for a live demo or architecture improvements

- **Live demo:** Run `index.html` and walk through the five demos above. An actual hosted deployment can be added later (e.g. GitHub Pages).
- **State management:** A single `state` object is a small-app pattern. For a larger product, you'd split this into modules or use a UI framework and API layer.
- **Security:** No authentication, and localStorage is not secure storage for private customer data. Current demo should contain fictional records only.
- **Testing gap:** Most existing automated tests cover pure logic; browser integration tests are a sensible future addition.

## A focused revision session

1. Read the architecture and 60-second pitch aloud.
2. Explain `filterAndSort`, `renderProperties`, and `persist` by looking at the source.
3. Run all five demos and try explaining each without reading the guide.
4. Run the 20 tests, then deliberately change a comparator and observe a failing test before reverting.
5. Explain limitations and next-step architecture without claiming features not implemented.

If you can do these five things confidently, you will be able to defend the project much more convincingly than by memorizing three resume bullets.

## If an interviewer asks about AI assistance

Answer accurately. A reasonable explanation is: "I used AI assistance to accelerate a first version, then I reviewed the architecture, ran tests, fixed validation and accessibility issues, and practiced explaining the implementation. I can walk through the key functions and change them myself." Only say you personally performed steps you actually completed. Avoid presenting AI-generated code as if you independently wrote all of it.
