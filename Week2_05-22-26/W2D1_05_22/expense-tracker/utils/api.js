const API_BASE_URL = "http://localhost:4000";

export async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    let data = null;
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || `Request failed with status ${response.status}`,
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
