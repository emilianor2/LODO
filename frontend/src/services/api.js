const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Get auth token from localStorage (set by AuthContext)
const getAuthToken = () => localStorage.getItem('auth_token');

// Fallback to env token for backward compatibility
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

/**
 * Generic fetch wrapper with AbortController support
 */
async function fetchWithSignal(url, options = {}) {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    if (!response.ok) {
        const message = text || `HTTP error! status: ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.body = text;
        throw error;
    }
    if (response.status === 204) return null;
    if (!text) return null;
    if (contentType.includes('application/json')) {
        return JSON.parse(text);
    }
    return text;
}

/**
 * Helper to clean empty parameters
 */
function cleanParams(params) {
    const cleaned = {};
    Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
            cleaned[key] = params[key];
        }
    });
    return new URLSearchParams(cleaned).toString();
}

// Public Endpoints
export const fetchOrganizations = async (params = {}, signal) => {
    const query = cleanParams(params);
    return fetchWithSignal(`${API_URL}/public/organizations?${query}`, { signal });
};

export const fetchOrganizationById = async (id, signal) => {
    return fetchWithSignal(`${API_URL}/public/organizations/${id}`, { signal });
};

export const fetchAggregates = async (params = {}, signal) => {
    const query = cleanParams(params);
    return fetchWithSignal(`${API_URL}/public/organizations/aggregates?${query}`, { signal });
};

export const fetchTaxonomies = async (signal) => {
    return fetchWithSignal(`${API_URL}/public/taxonomies`, { signal });
};

// Helper to get authorization header (prefers user token, falls back to env token)
const getAuthHeader = () => {
    const userToken = getAuthToken();
    const token = userToken || ADMIN_TOKEN;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin Endpoints
export const adminFetchOrganizations = async () => {
    return fetchWithSignal(`${API_URL}/organizations`, {
        headers: getAuthHeader()
    });
};

export const adminCreateOrganization = async (data) => {
    return fetchWithSignal(`${API_URL}/organizations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });
};

export const adminUpdateOrganization = async (id, data) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });
};

export const adminDeleteOrganization = async (id, force = false) => {
    return fetch(`${API_URL}/organizations/${id}${force ? '?force=true' : ''}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
};

export const adminGeocodeOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/geocode`, {
        method: 'POST',
        headers: getAuthHeader()
    });
};

export const adminSubmitForReview = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/review`, {
        method: 'POST',
        headers: getAuthHeader()
    });
};

export const adminPublishOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/publish`, {
        method: 'POST',
        headers: getAuthHeader()
    });
};

export const adminArchiveOrganization = async (id) => {
    return fetchWithSignal(`${API_URL}/organizations/${id}/archive`, {
        method: 'POST',
        headers: getAuthHeader()
    });
};
