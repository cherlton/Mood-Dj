const backendHost = import.meta.env.VITE_BACKEND_HOST || 'http://localhost';
const backendPort = import.meta.env.VITE_BACKEND_PORT || '5000';
const defaultApiBaseUrl = `https://mood-dj-backend-nhc0.onrender.com`;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

export const config = {
  backendHost,
  backendPort,
  apiBaseUrl,
};

export default config;
