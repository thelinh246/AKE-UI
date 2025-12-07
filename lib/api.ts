const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ake-be.onrender.com"

const TOKEN_KEY = "ausvisa_token"
const USER_KEY = "ausvisa_user"

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

type FetchOptions = RequestInit & {
  tokenOverride?: string | null
  skipAuth?: boolean
}

const getStoredToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

const buildHeaders = (options?: FetchOptions) => {
  const headers = new Headers(options?.headers)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (!options?.skipAuth) {
    const token = options?.tokenOverride ?? getStoredToken()
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  return headers
}

async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  })

  let data: any = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      (data as any)?.detail || (data as any)?.message || response.statusText || "Đã có lỗi xảy ra. Vui lòng thử lại."
    throw new ApiError(message, response.status, data)
  }

  return data as T
}

export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  role: string
  created_at?: string
  updated_at?: string
  is_active?: boolean
  is_activate?: boolean
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export const storeAuth = (token: string, user?: User) => {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export const clearStoredAuth = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getStoredAuth = (): { token: string; user: User | null } | null => {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  if (!token) return null
  return { token, user: userRaw ? (JSON.parse(userRaw) as User) : null }
}

// User APIs
export const registerUser = (payload: {
  email: string
  username: string
  full_name?: string
  password: string
  role?: string
}) => apiFetch<User>("/api/users/register", { method: "POST", body: JSON.stringify(payload), skipAuth: true })

export const loginUser = (payload: { email: string; password: string }) =>
  apiFetch<LoginResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  })

export const fetchCurrentUser = () => apiFetch<User>("/api/users/me")
export const listUsers = (skip = 0, limit = 50, token?: string | null) =>
  apiFetch<User[]>(`/api/users?skip=${skip}&limit=${limit}`, { tokenOverride: token ?? undefined })
export const activateUser = (id: number, token?: string | null) =>
  apiFetch<User>(`/api/users/${id}/activate`, {
    method: "POST",
    body: JSON.stringify({}),
    tokenOverride: token ?? undefined,
  })
export const updateUser = (id: number, payload: Partial<User>, token?: string | null) =>
  apiFetch<User>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    tokenOverride: token ?? undefined,
  })
export const deactivateUser = (id: number, token?: string | null) =>
  apiFetch<User>(`/api/users/${id}/deactivate`, {
    method: "POST",
    tokenOverride: token ?? undefined,
  })

// Chatbot APIs
export interface ChatMessagePayload {
  message: string
  conversation_id?: number | null
  title?: string
}

export interface ChatbotResponse {
  analysis?: {
    intent?: string
    entities?: Record<string, unknown>
    query_type?: string
  }
  results?: unknown
  answer: string
  query_type?: string
  conversation_id: number
}

export const sendChatMessage = (payload: ChatMessagePayload, token?: string | null) =>
  apiFetch<ChatbotResponse>("/api/chatbot/message", {
    method: "POST",
    body: JSON.stringify(payload),
    tokenOverride: token ?? undefined,
  })

export interface ConversationSummary {
  id: number
  title: string
  user_id?: number
  last_update?: string
}

export interface ConversationMessage {
  id: number
  conversation_id: number
  role: "user" | "assistant"
  message: string
  created_at?: string
}

export const listConversations = (token?: string | null) =>
  apiFetch<ConversationSummary[]>("/api/chatbot/conservations", { tokenOverride: token ?? undefined })

export const fetchConversationMessages = (conversationId: number, token?: string | null) =>
  apiFetch<ConversationMessage[]>(`/api/chatbot/conservations/${conversationId}/details`, {
    tokenOverride: token ?? undefined,
  })

// System APIs
export const healthCheck = () => apiFetch<{ status: string }>("/health", { skipAuth: true })

export { API_BASE_URL }
