const API_BASE_URL = "http://localhost:5000";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Login failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("solarops_token", data.token);
    localStorage.setItem("solarops_email", email);
  }
  return data;
}

export async function register(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Registration failed with status ${response.status}`);
  }

  localStorage.setItem("solarops_email", email);
  return response.json();
}

export function logout() {
  localStorage.removeItem("solarops_token");
  localStorage.removeItem("solarops_email");
  // Clear current session farm data so Panels & Defects starts fresh on next login
  localStorage.removeItem("solarops_farms");
}

export function getToken(): string | null {
  return localStorage.getItem("solarops_token");
}

export function getEmail(): string | null {
  return localStorage.getItem("solarops_email");
}
