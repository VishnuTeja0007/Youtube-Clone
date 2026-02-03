import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from the backend.
 * Uses VITE_BACKEND_SERVER from environment variables as base URL.
 * 
 * @param {string} actionPath - The endpoint path (e.g., '/api/videos') or full URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} body - Request body
 * @param {object} headers - Request headers
 * @returns {object} - { data, loading, error, refetch }
 */
const useFetch = (actionPath, method = 'GET', body = null, headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Skip if no actionPath is provided (allows conditional fetching)
    if (!actionPath) return;

    setLoading(true);
    setError(null);
    try {
      // Access environment variable directly or via import.meta.env (Vite standard)
      const baseURL = import.meta.env.VITE_BACKEND_SERVER;
      
      // Construct full URL if actionPath is relative
      const url = actionPath.startsWith('http') 
        ? actionPath 
        : `${baseURL}${actionPath}`;

      const config = {
        method,
        url,
        headers,
        data: body,
      };

      const response = await axios(config);
      setData(response.data);
    } catch (err) {
      console.error("useFetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [actionPath, method, JSON.stringify(body), JSON.stringify(headers)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
