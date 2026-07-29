import config from '../config';

/**
 * Centralized API Client with error handling, custom headers, and timeout support.
 */
class ApiClient {
  constructor(baseUrl = config.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  async post(endpoint, data, options = {}) {
    const { timeout = 30000, headers = {} } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Request timed out. Please try again.');
        timeoutErr.code = 'ECONNABORTED';
        throw timeoutErr;
      }
      throw err;
    }
  }

  async postFormData(endpoint, formData, options = {}) {
    const { timeout = 60000, headers = {} } = options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...headers,
          // Content-Type omitted so browser sets boundary for multipart/form-data
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Request timed out. Please try again.');
        timeoutErr.code = 'ECONNABORTED';
        throw timeoutErr;
      }
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
