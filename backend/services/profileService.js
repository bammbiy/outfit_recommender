const defaultProfile = {
  style: "casual",
  preferredFit: null,
  preferredColors: [],
  budget: null,
  avoid: []
};

export function buildStyleProfile(query = {}) {
  return {
    style: normalizeValue(query.style) || defaultProfile.style,
    preferredFit: normalizeValue(query.fit) || defaultProfile.preferredFit,
    preferredColors: normalizeList(query.colors),
    budget: normalizeValue(query.budget) || defaultProfile.budget,
    avoid: normalizeList(query.avoid)
  };
}

function normalizeValue(value) {
  if (!value) return null;
  return value.toString().trim().toLowerCase();
}

function normalizeList(value) {
  if (!value) return [];

  return value
    .toString()
    .split(",")
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);
}
