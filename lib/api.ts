/**
 * API utility functions for making requests to the server
 */
import { env } from "@/lib/env"

// Helper to ensure we have absolute URLs for server components
function getAbsoluteUrl(url: string): string {
  // If it's already an absolute URL, return it
  if (url.startsWith("http")) {
    return url
  }

  // For server-side requests, we need to use the base URL
  const baseUrl =
    env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

  // Ensure the URL starts with a slash
  const path = url.startsWith("/") ? url : `/${url}`

  return `${baseUrl}${path}`
}

/**
 * Base fetch function with error handling
 */
export async function fetchAPI(url: string, options: RequestInit = {}) {
  try {
    const absoluteUrl = getAbsoluteUrl(url)

    const response = await fetch(absoluteUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `Error ${response.status}: ${response.statusText}`)
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

/**
 * GET request helper
 */
export async function get(url: string) {
  return fetchAPI(url)
}

/**
 * POST request helper
 */
export async function post(url: string, data: any) {
  return fetchAPI(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * PUT request helper
 */
export async function put(url: string, data: any) {
  return fetchAPI(url, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * PATCH request helper
 */
export async function patch(url: string, data: any) {
  return fetchAPI(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

/**
 * DELETE request helper
 */
export async function del(url: string) {
  return fetchAPI(url, {
    method: "DELETE",
  })
}
