/* UI controller: DOM events, browser storage, and rendering. */
const STORAGE_KEY = "true-housing-portfolio-demo-v1";
const LEGACY_STORAGE_KEY = "stayscope-portfolio-demo-v1"; // Read old demo data once after rebranding.
const SAMPLE_PROPERTIES = [
  { id: 1, title: "2BHK Apartment", location: "Sector 80, Mohali", rent: 32000, bedrooms: 2, furnishing: "Fully Furnished" },
  { id: 2, title: "1BHK Apartment", location: "Sector 79, Mohali", rent: 20000, bedrooms: 1, furnishing: "Semi Furnished" },
  { id: 3, title: "3BHK Apartment", location: "Sector 91, Mohali", rent: 35000, bedrooms: 3, furnishing: "Fully Furnished" }
];

function freshState() {
  return { properties: SAMPLE_PROPERTIES.map((p) => ({ ...p })), favorites: [], leads: [] };
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const old = current === null ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
    const saved = JSON.parse(current ?? old);
    if (old !== null && saved) {
      localStorage.setItem(STORAGE_KEY, old); // Preserve previous demo work.
    }
    if (saved && Array.isArray(saved.properties) && Array.isArray(saved.favorites) && Array.isArray(saved.leads)) return saved;
  } catch (error) {
    console.warn("Stored data was unavailable; sample data loaded.", error);
  }
  return freshState();
}

let state = loadState();
let editingPropertyId = null;
let enquiryPropertyId = null;

const propertyList = document.getElementById("property-list");
const leadList = document.getElementById("lead-list");
const propertyDialog = document.getElementById("property-dialog");
const leadDialog = document.getElementById("lead-dialog");
const propertyForm = document.getElementById("property-form");
const leadForm = document.getElementById("lead-form");
const searchField = document.getElementById("search");
const bedroomField = document.getElementById("bedrooms");
const maxRentField = document.getElementById("max-rent");
const sortField = document.getElementById("sort");
const favoritesOnlyField = document.getElementById("favorites-only");

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Unable to save in this browser.", error);
    showToast("Changes are temporary: browser storage is unavailable.");
  }
}

function showToast(message) {
  document.getElementById("toast").textContent = message;
}

function element(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = String(text); // Safe: no user content injected as HTML
  return node;
}

function makeButton(label, className, clickHandler) {
  const button = element("button", className, label);
  button.type = "button";
  button.addEventListener("click", clickHandler);
  return button;
}

function currentFilters() {
  return {
    query: searchField.value,
    bedrooms: bedroomField.value,
    maxRent: maxRentField.value,
    sort: sortField.value,
    favoritesOnly: favoritesOnlyField.checked
  };
}

function renderCard(property) {
  const card = element("article", "property-card");
  const top = element("div", "card-top");
  const icon = element("div", "house-icon", "⌂");
  icon.setAttribute("aria-hidden", "true");
  const favorite = state.favorites.includes(property.id);
  const saveButton = makeButton(favorite ? "♥ Saved" : "♡ Save", "save-button", () => toggleFavorite(property.id));
  saveButton.setAttribute("aria-pressed", String(favorite));
  saveButton.setAttribute("aria-label", `${favorite ? "Remove" : "Add"} ${property.title} ${favorite ? "from" : "to"} saved properties`);
  top.append(icon, saveButton);

  const body = element("div", "card-body");
  const tag = element("span", "card-tag", `${property.bedrooms} BHK · ${property.furnishing}`);
  const title = element("h3", "card-title", property.title);
  const address = element("p", "card-address", `⌖  ${property.location}`);
  const footer = element("div", "card-footer");
  const price = element("div", "card-price", PropertyLogic.formatINR(property.rent));
  price.append(element("span", "per-month", " / month"));
  footer.append(price);
  body.append(tag, title, address, footer);

  const actions = element("div", "card-actions");
  actions.append(
    makeButton("+ Enquiry", "btn btn-primary btn-small", () => openLeadDialog(property.id)),
    makeButton("Edit", "btn btn-quiet btn-small", () => openPropertyDialog(property)),
    makeButton("Delete", "btn btn-danger-text btn-small", () => deleteProperty(property.id))
  );
  card.append(top, body, actions);
  return card;
}

function renderProperties() {
  const visible = PropertyLogic.filterAndSort(state.properties, currentFilters(), state.favorites);
  propertyList.replaceChildren(...visible.map(renderCard));
  document.getElementById("empty-state").hidden = visible.length !== 0;
  document.getElementById("result-count").textContent = `${visible.length} of ${state.properties.length} properties`;
  document.getElementById("stat-properties").textContent = String(state.properties.length);
  document.getElementById("stat-favorites").textContent = String(state.favorites.length);
  document.getElementById("stat-leads").textContent = String(state.leads.filter((lead) => lead.status !== "Closed").length);
}

function renderLeads() {
  leadList.replaceChildren();
  if (state.leads.length === 0) {
    const empty = element("div", "leads-empty");
    empty.append(element("strong", "", "No enquiries yet"), element("p", "", "Click “+ Enquiry” on a property to create a demo follow-up."));
    leadList.append(empty);
    return;
  }
  for (const lead of [...state.leads].reverse()) {
    const row = element("div", "lead-row");
    const details = element("div", "lead-details");
    details.append(element("strong", "", lead.name), element("span", "", lead.propertyTitle));
    if (lead.note) details.append(element("p", "lead-note", lead.note));
    const controls = element("div", "lead-controls");
    const status = element("select", "status-select");
    status.setAttribute("aria-label", `Status for ${lead.name}`);
    for (const value of ["New", "Contacted", "Closed"]) {
      const option = element("option", "", value);
      option.value = value;
      status.append(option);
    }
    status.value = lead.status;
    status.addEventListener("change", () => { lead.status = status.value; persist(); render(); });
    controls.append(status, makeButton("Remove", "btn btn-quiet btn-small", () => {
      if (!confirm("Remove this demo enquiry?")) return;
      state.leads = state.leads.filter((item) => item.id !== lead.id);
      persist(); render(); showToast("Enquiry removed.");
    }));
    row.append(details, controls);
    leadList.append(row);
  }
}

function render() { renderProperties(); renderLeads(); }

function toggleFavorite(propertyId) {
  const index = state.favorites.indexOf(propertyId);
  if (index >= 0) state.favorites.splice(index, 1);
  else state.favorites.push(propertyId);
  persist(); renderProperties();
}

function openPropertyDialog(property = null) {
  propertyForm.reset();
  editingPropertyId = property ? property.id : null;
  document.getElementById("property-dialog-title").textContent = property ? "Edit property" : "Add property";
  document.getElementById("property-error").textContent = "";
  if (property) {
    for (const key of ["title", "location", "rent", "bedrooms", "furnishing"]) propertyForm.elements.namedItem(key).value = property[key];
  }
  propertyDialog.showModal();
}

function deleteProperty(propertyId) {
  const property = state.properties.find((p) => p.id === propertyId);
  if (!property || !confirm(`Delete “${property.title}” from this browser?`)) return;
  state.properties = state.properties.filter((p) => p.id !== propertyId);
  state.favorites = state.favorites.filter((id) => id !== propertyId);
  // Existing enquiry records retain a title for historical reference.
  persist(); render(); showToast("Property deleted.");
}

function openLeadDialog(propertyId) {
  const property = state.properties.find((p) => p.id === propertyId);
  if (!property) return;
  enquiryPropertyId = propertyId;
  leadForm.reset();
  document.getElementById("lead-error").textContent = "";
  document.getElementById("lead-property-label").textContent = `${property.title} · ${property.location}`;
  leadDialog.showModal();
}

propertyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(propertyForm).entries());
  const result = PropertyLogic.validateProperty(input);
  if (!result.valid) {
    document.getElementById("property-error").textContent = result.errors.join(" ");
    return;
  }
  if (editingPropertyId !== null) {
    state.properties = state.properties.map((p) => p.id === editingPropertyId ? { ...p, ...result.property } : p);
  } else {
    state.properties.unshift({ id: Date.now(), ...result.property });
  }
  persist(); render(); propertyDialog.close(); showToast("Property saved.");
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const property = state.properties.find((p) => p.id === enquiryPropertyId);
  const name = String(leadForm.elements.namedItem("name").value).trim();
  const note = String(leadForm.elements.namedItem("note").value).trim();
  if (!property || !name || name.length > 60 || note.length > 140) {
    document.getElementById("lead-error").textContent = "Enter a valid demo prospect name (and a short note if needed).";
    return;
  }
  state.leads.push({ id: Date.now(), propertyId: property.id, propertyTitle: property.title, name, note, status: "New" });
  persist(); render(); leadDialog.close(); showToast("Demo enquiry added.");
});

for (const input of [searchField, maxRentField]) input.addEventListener("input", renderProperties);
for (const input of [bedroomField, sortField, favoritesOnlyField]) input.addEventListener("change", renderProperties);

document.getElementById("clear-filters").addEventListener("click", () => {
  searchField.value = ""; bedroomField.value = ""; maxRentField.value = "";
  sortField.value = "featured"; favoritesOnlyField.checked = false;
  renderProperties();
});
document.getElementById("add-property").addEventListener("click", () => openPropertyDialog());
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.close).close()));
document.getElementById("reset-demo").addEventListener("click", () => {
  if (!confirm("Reset all demo properties, favorites, and enquiries in this browser?")) return;
  state = freshState(); persist(); render(); showToast("Demo data restored.");
});

render();
