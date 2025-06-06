const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

///           handles requests from the frontend that go to the backend

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
    console.log(
      `request(${endpoint}, ${options}): pre call to fetch(${url}, ${config})`,
    );
    const response = await fetch(url, config);
    console.log(
      `request(${endpoint}, ${options}): post call to fetch(${url}, ${config}) with response ${response}`,
    );
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

export const addItem = (item_name, item_description) => {
  return request("/items/", {
    method: "POST",
    body: JSON.stringify({
      item_name: item_name,
      description: item_description,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const addItemAttribute = (
  item_id,
  attribute_name,
  unit,
  unit_type,
  value,
) => {
  return request("/items/", {
    method: "POST",
    body: JSON.stringify({
      item_id: item_id,
      attribute_name: attribute_name,
      unit: unit,
      unit_type: unit_type,
      value: value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getInventory = () => {
  console.log("getInventory() called");
  return request("/inventory/");
};

export const getInventoryByID = (inventoryId) => {
  return request(`/inventory/id=${inventoryId}/`);
};

export const getLocations = () => {
  return request("/locations/");
};

export const addLocation = (location_name, location_description) => {
  return request("/locations/", {
    method: "POST",
    body: JSON.stringify({
      location_name: location_name,
      location_description: location_description,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getLocationByID = (locationID) => {
  return request(`/locations/id=${locationID}/`);
};

export const getSuppliers = () => {
  return request("/suppliers/");
};

export const getSupplierByID = (ID) => {
  return request(`/suppliers/${ID}/`);
};

export const addSupplier = (supplier_name) => {
  return request("/suppliers/", {
    method: "POST",
    body: JSON.stringify({
      supplier_name: supplier_name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getTransactions = () => {
  console.log("getTransactions() called");
  return request("/transactions/");
};

export const getTransactionsForItemLoc = (itemID, locationID) => {
  return request(`/transactions/${itemID}, ${locationID}/`);
};

export const addTransaction = (
  item_name,
  location_name,
  quantity,
  transaction_description,
  transaction_date,
  supplier_name,
) => {
  return request("/transactions/", {
    method: "POST",
    body: JSON.stringify({
      item_name: item_name,
      location_name: location_name,
      quantity: quantity,
      transaction_description: transaction_description,
      transaction_date: transaction_date,
      supplier_name: supplier_name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getRecords = () => {
  return request("/records/");
};

export const addRecord = (
  item_name,
  location_name,
  quantity,
  date_of_count,
) => {
  return request("/records/", {
    method: "POST",
    body: JSON.stringify({
      item_name: item_name,
      location_name: location_name,
      quantity: quantity,
      date_of_count: date_of_count,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
