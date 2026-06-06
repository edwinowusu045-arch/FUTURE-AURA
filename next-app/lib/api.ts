const API_BASE = "https://aura-backend.up.railway.app"; // Hardcoded for deployment

export const API_BASE_URL = API_BASE;
export const API_BASE_URL_ERROR = 'API base URL is not configured.';

export function getApiBaseUrl() {
  return API_BASE_URL;
}
