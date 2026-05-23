export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '';

export const API_BASE_URL_ERROR =
  'Backend URL not configured. Set NEXT_PUBLIC_API_BASE_URL to your backend service URL.';

export function getApiBaseUrl() {
  return API_BASE_URL;
}
