const defaultProfile = {
  style: "casual",
  preferredFit: null,
  preferredColors: [],
  budget: null,
  avoid: []
};

export function buildStyleProfile(query = {}, options = {}) {
  const applyDefaults = options.applyDefaults ?? true;

  return {
    style: normalizeValue(query.style) || (applyDefaults ? defaultProfile.style : null),
    preferredFit: normalizeValue(query.fit) || defaultProfile.preferredFit,
    preferredColors: normalizeList(query.colors),
    budget: normalizeValue(query.budget) || defaultProfile.budget,
    avoid: normalizeList(query.avoid)
  };
}

export function buildStyleProfileFromBody(body = {}) {
  return {
    style: normalizeValue(body.style) || defaultProfile.style,
    preferredFit: normalizeValue(body.preferredFit || body.fit),
    preferredColors: normalizeArray(body.preferredColors || body.colors),
    budget: normalizeValue(body.budget),
    avoid: normalizeArray(body.avoid || body.avoidItems)
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

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => normalizeValue(item))
      .filter(Boolean);
  }

  return normalizeList(value);
}
