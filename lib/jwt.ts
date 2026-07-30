// Web Crypto API HMAC-SHA256 JWT implementation
// Fast, native, and running on all Next.js runtimes (Node.js & Edge)
const JWT_SECRET = process.env.JWT_SECRET || "default-fallback-jwt-secret-key-at-least-32-chars-long"

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) {
    str += "="
  }
  return atob(str)
}

async function getSigningKey() {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    enc.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  )
}

export async function signJWT(payload: any, expiresInSeconds = 86400): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" }
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const fullPayload = { ...payload, exp }
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  
  const tokenInput = `${encodedHeader}.${encodedPayload}`
  const enc = new TextEncoder()
  const key = await getSigningKey()
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(tokenInput))
  
  const signatureArray = Array.from(new Uint8Array(signature))
  const signatureString = String.fromCharCode(...signatureArray)
  const encodedSignature = base64UrlEncode(signatureString)
  
  return `${tokenInput}.${encodedSignature}`
}

export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    
    const [header, payload, signature] = parts
    const tokenInput = `${header}.${payload}`
    
    const key = await getSigningKey()
    const enc = new TextEncoder()
    
    const sigStr = base64UrlDecode(signature)
    const sigBuf = new Uint8Array(sigStr.length)
    for (let i = 0; i < sigStr.length; i++) {
      sigBuf[i] = sigStr.charCodeAt(i)
    }
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(tokenInput))
    if (!isValid) return null
    
    const decodedPayload = JSON.parse(base64UrlDecode(payload))
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null // Expired
    }
    
    return decodedPayload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function verifyRole(requiredRole?: "admin" | "agent"): Promise<any | null> {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null
    
    const payload = await verifyJWT(token)
    if (!payload) return null
    
    if (requiredRole && payload.role !== requiredRole) {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}
