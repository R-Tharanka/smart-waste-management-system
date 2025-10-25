/**
 * Report Service
 * 
 * Handles all API communication for analytics reports.
 * Follows the Single Responsibility Principle by separating
 * data fetching logic from component logic.
 */

/**
 * API endpoints configuration
 */
const API_ENDPOINTS = {
  CONFIG: '/api/analytics/config',
  REPORT: '/api/analytics/report',
};

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  CONFIG_LOAD_FAILED: 'Unable to load analytics configuration',
  REPORT_GENERATION_FAILED: 'Failed to generate report',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Fetches analytics configuration from the server
 * 
 * @returns {Promise<Object>} Configuration object with filter options
 * @throws {ApiError} If the request fails
 */
export async function fetchAnalyticsConfig() {
  try {
    const response = await fetch(API_ENDPOINTS.CONFIG);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || ERROR_MESSAGES.CONFIG_LOAD_FAILED,
        response.status,
        data
      );
    }

    // The backend returns a standard envelope: { ok, data: { filters }, message }
    // Be resilient to minor shape differences and unwrap accordingly.
    const payload = data?.data ?? data;
    const config = payload?.filters ?? payload;

    if (!config || typeof config !== 'object') {
      throw new ApiError(ERROR_MESSAGES.CONFIG_LOAD_FAILED, response.status, data);
    }

    return config;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0, error);
  }
}

/**
 * Generates a waste analytics report
 * 
 * @param {String} userId - ID of the requesting user
 * @param {Object} criteria - Report criteria
 * @returns {Promise<Object|null>} Report data or null if no records
 * @throws {ApiError} If the request fails
 */
export async function generateWasteReport(userId, criteria) {
  try {
    const payload = {
      userId,
      criteria,
    };

    const response = await fetch(API_ENDPOINTS.REPORT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || ERROR_MESSAGES.REPORT_GENERATION_FAILED,
        response.status,
        data
      );
    }

    return {
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0, error);
  }
}
