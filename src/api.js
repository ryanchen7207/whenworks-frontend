const BASE_URL = "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

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
