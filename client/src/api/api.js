const BASE_URL = "http://localhost:5000/api";

const parseError = async (response) => {
    let data = null;

    try {
        data = await response.json();
    } catch {
        // Ignore JSON parse errors and fall back to a generic message below.
    }

    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
};

const request = async (endpoint, options = {}, token) => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        await parseError(response);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const api = {
    login: (payload) => request("/users/login", { method: "POST", body: JSON.stringify(payload) }),
    register: (payload) => request("/users/register", { method: "POST", body: JSON.stringify(payload) }),
    getProfile: (token) => request("/users/profile", { method: "GET" }, token),
    logout: (token) => request("/users/logout", { method: "POST" }, token),
    getProperties: () => request("/properties", { method: "GET" }),
    getMyFavorites: (token) => request("/favorites/my", { method: "GET" }, token),
    toggleFavorite: (payload, token) =>
        request("/favorites/toggle", { method: "POST", body: JSON.stringify(payload) }, token),
};