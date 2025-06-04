const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

/**
 * Helper function to make API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/items/').
 * @param {object} options - Optional fetch options (method, headers, body).
 * @returns {Promise<any>} - A promise that resolves with the JSON response.
 * @throws {Error} - Throws error if the API call fails or returns a non-OK status.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail =
          errorData.detail || JSON.stringify(errorData) || errorDetail;
      } catch (e) {
        errorDetail = response.statusText || errorDetail;
      }
      throw new Error(errorDetail);
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", endpoint, error.message);
    throw error;
  }
}

/**
 * Fetches a list of all items.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of items.>}
 */
export const getItems = () => {
  return request("/items/");
};

/**
 * Fetches a single item by its ID.
 * @param {number|string} itemId - The ID of the item to fetch.
 * @returns {Promise<object>} - A promise that resolves to the item object.
 */
export const getItemById = (itemId) => {
  return request(`/items/${itemId}/`);
};

export const getInventory = () => {
  return request("/inventory/");
};

export const getInventoryByItemId = (itemId) => {
  return request(`/inventory/items=${itemId}/`);
};

export const getLocations = () => {
  return request("/locations/");
};

export const getLocationByID = (locationID) => {
  return request(`/locations/${locationID}/`);
};
