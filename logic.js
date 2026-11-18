/* Pure application logic. Can be tested in Node.js without a browser. */
const PropertyLogic = (() => {
  const FURNISHING_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

  function filterAndSort(properties, filters, favoriteIds = []) {
    const query = String(filters.query || "").trim().toLowerCase();
    const bedrooms = String(filters.bedrooms || "");
    const maxRent = filters.maxRent === "" || filters.maxRent == null ? null : Number(filters.maxRent);

    const filtered = properties.filter((property) => {
      const textMatch = `${property.title} ${property.location}`.toLowerCase().includes(query);
      const bedroomMatch = !bedrooms || String(property.bedrooms) === bedrooms;
      const rentMatch = maxRent === null || !Number.isFinite(maxRent) || property.rent <= maxRent;
      const favoriteMatch = !filters.favoritesOnly || favoriteIds.includes(property.id);
      return textMatch && bedroomMatch && rentMatch && favoriteMatch;
    });

    if (filters.sort === "rent-asc") filtered.sort((a, b) => a.rent - b.rent);
    if (filters.sort === "rent-desc") filtered.sort((a, b) => b.rent - a.rent);
    return filtered;
  }

  function validateProperty(input) {
    const property = {
      title: String(input.title || "").trim(),
      location: String(input.location || "").trim(),
      rent: Number(input.rent),
      bedrooms: Number(input.bedrooms),
      furnishing: String(input.furnishing || "")
    };
    const errors = [];
    if (!property.title || property.title.length > 70) errors.push("Enter a title of 1–70 characters.");
    if (!property.location || property.location.length > 90) errors.push("Enter a location of 1–90 characters.");
    if (!Number.isSafeInteger(property.rent) || property.rent <= 0 || property.rent > 100000000) errors.push("Enter a valid positive whole-number rent.");
    if (!Number.isInteger(property.bedrooms) || property.bedrooms < 1 || property.bedrooms > 4) errors.push("Choose 1–4 bedrooms.");
    if (!FURNISHING_OPTIONS.includes(property.furnishing)) errors.push("Choose a furnishing type.");
    return { valid: errors.length === 0, errors, property };
  }

  function formatINR(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  }

  return { filterAndSort, validateProperty, formatINR };
})();

if (typeof module !== "undefined" && module.exports) module.exports = PropertyLogic;
