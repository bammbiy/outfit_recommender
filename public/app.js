const form = document.querySelector("#recommendationForm");
const resultPanel = document.querySelector(".result-panel");
const saveProfileButton = document.querySelector("#saveProfileButton");
const loadProfileButton = document.querySelector("#loadProfileButton");
const profileStatus = document.querySelector("#profileStatus");

const imageMap = {
  "compact-umbrella": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=700&q=80",
  "rain-boots": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  "waterproof-jacket": "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80",
  "waterproof-bag": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  "windbreaker": "https://images.unsplash.com/photo-1506629905607-d9edb999b1c0?auto=format&fit=crop&w=700&q=80",
  "linen-shirt": "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80",
  "sunglasses": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
  "scarf": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=700&q=80",
  "thermal-innerwear": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80",
  "breathable-tee": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
};

const colorMap = {
  black: "#141414",
  gray: "#8d8d8d",
  white: "#f7f4ec",
  blue: "#4f7fb7",
  beige: "#d6c2a2",
  "earth tone": "#8a6b4f",
  navy: "#172a46",
  olive: "#65724b",
  brown: "#75533d"
};

form.addEventListener("submit", event => {
  event.preventDefault();
  loadRecommendation();
});

saveProfileButton.addEventListener("click", saveProfile);
loadProfileButton.addEventListener("click", loadProfile);

loadRecommendation();

async function loadRecommendation() {
  setLoading(true);

  try {
    const params = buildParams(new FormData(form));
    const response = await fetch(`/api/outfit?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Recommendation failed");
    }

    const data = await response.json();
    renderRecommendation(data);
  } catch (error) {
    renderError(error);
  } finally {
    setLoading(false);
  }
}

function buildParams(formData) {
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (value) params.set(key, value);
  }

  if (formData.get("mock") === "on") {
    params.set("mock", "true");
  } else {
    params.delete("mock");
    params.delete("mockWeather");
  }

  return params;
}

function renderRecommendation(data) {
  renderWeather(data.weather);
  renderLook(data);
  renderOutfit(data.recommendation.items);
  renderNotes(data.recommendation);
  renderShopping(data.shopping);
  renderBrands(data.brands);
}

function renderWeather(weather) {
  document.querySelector("#weatherCity").textContent = weather.city;
  document.querySelector("#weatherTemp").textContent = Math.round(weather.temp);
  document.querySelector("#feelsLike").textContent = `${Math.round(weather.feelsLike)}°`;
  document.querySelector("#humidity").textContent = `${weather.humidity}%`;
  document.querySelector("#windSpeed").textContent = `${weather.windSpeed}m/s`;
  document.querySelector("#weatherDescription").textContent = weather.description;
}

function renderLook(data) {
  const { weather, recommendation, meta } = data;
  const title = `${weather.city} ${weather.condition.toLowerCase()} ${meta.occasion} fit`;
  document.querySelector("#pageTitle").textContent = title;
  document.querySelector("#lookSummary").textContent = recommendation.summary;

  const palette = document.querySelector("#palette");
  palette.innerHTML = "";

  recommendation.items.palette.forEach(color => {
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.title = color;
    swatch.style.setProperty("--swatch-color", colorMap[color] || color);
    palette.append(swatch);
  });
}

function renderOutfit(items) {
  const outfitItems = document.querySelector("#outfitItems");
  const entries = [
    ["Top", items.top],
    ["Bottom", items.bottom],
    ["Shoes", items.shoes],
    ["Layers", items.layers.join(", ") || "none"],
    ["Fit", items.fit],
    ["Detail", items.detail]
  ];

  outfitItems.innerHTML = entries
    .map(([label, value]) => `
      <div class="outfit-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `)
    .join("");
}

function renderNotes(recommendation) {
  const reasonList = document.querySelector("#reasonList");
  const notes = [
    ...recommendation.reasons,
    ...recommendation.personalization,
    ...recommendation.matchingTips
  ];

  reasonList.innerHTML = notes
    .map(note => `<li>${escapeHtml(note)}</li>`)
    .join("");
}

function renderShopping(items) {
  const shoppingGrid = document.querySelector("#shoppingGrid");

  if (!items.length) {
    shoppingGrid.innerHTML = `
      <article class="shopping-card">
        <div class="shopping-body">
          <h4>추가 구매 추천 없음</h4>
          <p>오늘은 가지고 있는 기본 아이템으로 충분한 날씨입니다.</p>
        </div>
      </article>
    `;
    return;
  }

  shoppingGrid.innerHTML = items
    .map(item => `
      <article class="shopping-card">
        <img src="${imageMap[item.id] || imageMap["linen-shirt"]}" alt="${escapeHtml(item.name)}">
        <div class="shopping-body">
          <div>
            <p class="eyebrow">${escapeHtml(item.category)}</p>
            <h4>${escapeHtml(item.name)}</h4>
          </div>
          <p>${escapeHtml(item.reason)}</p>
          <p><strong>${escapeHtml(item.searchQuery)}</strong></p>
          <div class="link-row">
            ${item.links.map(link => `
              <a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.marketplace)}</a>
            `).join("")}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderBrands(brands) {
  document.querySelector("#brandList").innerHTML = brands
    .map(brand => `<span>${escapeHtml(brand)}</span>`)
    .join("");
}

function renderError(error) {
  document.querySelector("#lookSummary").textContent = error.message;
  document.querySelector("#reasonList").innerHTML = `
    <li>Demo weather를 켜거나 유효한 OpenWeather API 키를 설정해 주세요.</li>
  `;
}

function setLoading(isLoading) {
  resultPanel.classList.toggle("loading", isLoading);
  form.querySelector("button[type='submit']").textContent = isLoading ? "불러오는 중" : "추천 받기";
}

async function saveProfile() {
  const userId = form.elements.userId.value.trim();

  if (!userId) {
    setProfileStatus("사용자 ID를 입력해 주세요.");
    return;
  }

  const response = await fetch(`/api/profile/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(getProfilePayload())
  });

  if (!response.ok) {
    setProfileStatus("프로필 저장에 실패했습니다.");
    return;
  }

  const data = await response.json();
  setProfileStatus(`${data.profile.userId} 프로필을 저장했습니다.`);
  loadRecommendation();
}

async function loadProfile() {
  const userId = form.elements.userId.value.trim();

  if (!userId) {
    setProfileStatus("사용자 ID를 입력해 주세요.");
    return;
  }

  const response = await fetch(`/api/profile/${encodeURIComponent(userId)}`);

  if (response.status === 404) {
    setProfileStatus("저장된 프로필이 아직 없습니다.");
    return;
  }

  if (!response.ok) {
    setProfileStatus("프로필을 불러오지 못했습니다.");
    return;
  }

  const data = await response.json();
  applyProfileToForm(data.profile);
  setProfileStatus(`${data.profile.userId} 프로필을 불러왔습니다.`);
  loadRecommendation();
}

function getProfilePayload() {
  return {
    style: form.elements.style.value,
    preferredFit: form.elements.fit.value,
    preferredColors: form.elements.colors.value,
    budget: form.elements.budget.value,
    avoid: form.elements.avoid.value
  };
}

function applyProfileToForm(profile) {
  form.elements.style.value = profile.style;
  form.elements.fit.value = profile.preferredFit || "regular";
  form.elements.colors.value = profile.preferredColors.join(",");
  form.elements.budget.value = profile.budget || "mid";
  form.elements.avoid.value = profile.avoid.join(",");
}

function setProfileStatus(message) {
  profileStatus.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
