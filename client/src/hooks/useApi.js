import { useCallback } from "react";

export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) return apiUrl.replace(/\/$/, '');
  return import.meta.env.DEV ? "" : window.location.origin;
};

export const useAuthenticatedFetch = (token, onUnauthorized) => {
  return useCallback(async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error("Session expired. Silakan login kembali.");
    }
    return response;
  }, [token, onUnauthorized]);
};

export const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};
