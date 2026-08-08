const API_BASE = typeof window !== "undefined" && window.location.hostname !== "localhost"
  ? "http://localhost:4000"
  : "http://localhost:4000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sitecreator_token");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("sitecreator_token", token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sitecreator_token");
  }
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "Authentication failed" }));
    throw new Error(errorData.error || "Failed to log in");
  }
  const data = await res.json();
  const token = data.payload || data.token;
  if (token) {
    setToken(token);
  }
  return data;
}

export async function searchBusinesses(query: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/businesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch business leads");
  }
  const result = await res.json();
  return result.data || [];
}

export async function createSite(name: string, phone: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/site/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create site" }));
    throw new Error(err.error || "Failed to create site");
  }
  return await res.json();
}

export async function getSites() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/site`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
}

export async function getRunningSites() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/site/running`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
}

export async function getSiteById(id: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/site/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    return null;
  }
  return await res.json();
}
