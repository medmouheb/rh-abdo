/**
 * API client utility that automatically includes authentication token
 */

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("auth_token") 
    : null;

  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  headers.set("Content-Type", "application/json");

  return fetch(url, {
    ...options,
    headers,
  });
}
