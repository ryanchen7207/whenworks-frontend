export const BASE_URL = "http://localhost:4000";
// After deploying your backend, change the line above to your live URL,
// e.g. export const BASE_URL = "https://whenworks-backend.onrender.com";

function getToken() {
  return localStorage.getItem("whenworks_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// --- Sessions ---
export function createSession(data) {
  return request("/sessions", { method: "POST", body: JSON.stringify(data) });
}
export function getSession(id) {
  return request(`/sessions/${id}`);
}
export function joinSession(id, name, availability) {
  return request(`/sessions/${id}/join`, {
    method: "POST",
    body: JSON.stringify({ name, availability }),
  });
}
export function getResults(id) {
  return request(`/sessions/${id}/results`);
}
export function getMySessions() {
  return request("/sessions/mine");
}
export function importIcs(id, icsText) {
  return request(`/sessions/${id}/import-ics`, { method: "POST", body: JSON.stringify({ icsText }) });
}
export function getGoogleBusy(id) {
  return request(`/sessions/${id}/google-busy`);
}
export function getTemplateBusy(id, templateId) {
  return request(`/sessions/${id}/template-busy/${templateId}`);
}
export function confirmSlot(id, slotId) {
  return request(`/sessions/${id}/confirm`, { method: "POST", body: JSON.stringify({ slotId }) });
}

// --- Auth ---
export function signup(name, email, password) {
  return request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
}
export function login(email, password) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export function getMe() {
  return request("/auth/me");
}
export function googleSignInUrl() {
  return `${BASE_URL}/auth/google/start`;
}

// --- Templates ---
export function getTemplates() {
  return request("/templates");
}
export function createTemplate(name, blocks) {
  return request("/templates", { method: "POST", body: JSON.stringify({ name, blocks }) });
}
export function deleteTemplate(id) {
  return request(`/templates/${id}`, { method: "DELETE" });
}
