const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Custom fetch wrapper for API calls
 * @param {string} endpoint API endpoint path (e.g. '/api/lukisan')
 * @param {object} options fetch options
 */
export async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...options.headers,
  };
  
  // Set Content-Type to JSON only if it is not FormData (which sets its own boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Required to send/receive cookies (JWT token)
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Attempt to parse JSON response
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Throw error containing backend custom error message
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export default request;
