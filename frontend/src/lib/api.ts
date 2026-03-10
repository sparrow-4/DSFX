const  API_URL =  "https://dsfx.onrender.com/api"  


// const BASE_URL = '/api';

// Generic fetch helper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {

  
  const { headers, ...restOptions } = options || {};
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCustomerAuthHeaders() {
  try {
    const storageItem = localStorage.getItem('spark-auth-storage');
    if (storageItem) {
      const parsed = JSON.parse(storageItem);
      const token = parsed?.state?.token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  } catch (e) {
    console.error("Failed to parse customer token", e);
  }
  return {};
}

// ─── Customer Auth ─────────────────────────────────────────────────────────────

export function loginUser(payload: { email: string; password: string }): Promise<{ token: string; user: any }> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: { name: string; email: string; password: string }): Promise<{ token: string; user: any }> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export function fetchProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/products');
}

export function fetchProduct(id: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${id}`);
}

export function createProduct(formData: FormData): Promise<ApiProduct> {
  const token = sessionStorage.getItem('admin_token');
  return fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message);
    }
    return res.json();
  });
}

export function updateProduct(id: string, formData: FormData): Promise<ApiProduct> {
  const token = sessionStorage.getItem('admin_token');
  return fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message);
    }
    return res.json();
  });
}

export function deleteProduct(id: string): Promise<{ message: string }> {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders() as HeadersInit,
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalPrice: number;
  city?: string;
  state?: string;
  district?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  return apiFetch<ApiOrder>('/orders', {
    method: 'POST',
    headers: getCustomerAuthHeaders() as HeadersInit,
    body: JSON.stringify(payload),
  });
}

export function fetchOrders(): Promise<ApiOrder[]> {
  return apiFetch<ApiOrder[]>('/orders', {
    headers: getAuthHeaders() as HeadersInit,
  });
}

export function fetchMyOrders(): Promise<ApiOrder[]> {
  return apiFetch<ApiOrder[]>('/orders/my-orders', {
    headers: getCustomerAuthHeaders() as HeadersInit,
  });
}

export function updateOrderStatus(id: string, orderStatus: string): Promise<ApiOrder> {
  return apiFetch<ApiOrder>(`/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders() as HeadersInit,
    body: JSON.stringify({ orderStatus }),
  });
}

export function deleteOrder(id: string): Promise<{ message: string }> {
  return apiFetch(`/orders/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders() as HeadersInit,
  });
}

export function cancelOrder(id: string): Promise<ApiOrder> {
  return apiFetch<ApiOrder>(`/orders/${id}/cancel`, {
    method: 'PUT',
    headers: getCustomerAuthHeaders() as HeadersInit,
  });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function fetchCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>('/categories');
}

export function createCategory(payload: { name: string; description?: string }): Promise<ApiCategory> {
  return apiFetch<ApiCategory>('/categories', {
    method: 'POST',
    headers: getAuthHeaders() as HeadersInit,
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: string, payload: { name?: string; description?: string }): Promise<ApiCategory> {
  return apiFetch<ApiCategory>(`/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders() as HeadersInit,
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: string): Promise<{ message: string }> {
  return apiFetch(`/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders() as HeadersInit,
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function adminLogin(username: string, password: string): Promise<{ token: string; username: string }> {
  return apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function fetchSettings(): Promise<ApiSettings> {
  return apiFetch<ApiSettings>('/settings');
}

export function updateSettings(payload: Partial<ApiSettings>): Promise<ApiSettings> {
  return apiFetch<ApiSettings>('/settings', {
    method: 'PUT',
    headers: getAuthHeaders() as HeadersInit,
    body: JSON.stringify(payload),
  });
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSettings {
  _id?: string;
  storeName: string;
  logoUrl: string;
  aboutText: string;
  heroSubtitle: string;
  stats: Array<{ label: string; value: string }>;
  benefits: Array<{ title: string; description: string; icon: string }>;
  email: string;
  phone: string;
  location: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}
