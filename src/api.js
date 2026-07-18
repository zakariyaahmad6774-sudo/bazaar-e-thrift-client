// Fetch helpers connecting the React app to the Express/MongoDB backend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('baza_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ---- Public (shop-facing) ----

export function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category?.length) params.set('category', filters.category.join(','));
  if (filters.size?.length) params.set('size', filters.size.join(','));
  if (filters.condition?.length) params.set('condition', filters.condition.join(','));
  if (filters.minPrice != null) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice != null) params.set('maxPrice', filters.maxPrice);
  if (filters.sort) params.set('sort', filters.sort);
  return fetch(`${API_BASE}/products?${params}`).then(handle);
}

export function getProduct(id) {
  return fetch(`${API_BASE}/products/${id}`).then(handle);
}

// ---- Admin auth ----

export async function login(password) {
  const data = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  }).then(handle);
  localStorage.setItem('baza_admin_token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('baza_admin_token');
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('baza_admin_token'));
}

// ---- Admin (protected) ----

export function getStats() {
  return fetch(`${API_BASE}/products/stats/summary`, { headers: authHeaders() }).then(handle);
}

export function createProduct(product) {
  return fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  }).then(handle);
}

export function updateProduct(id, product) {
  return fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  }).then(handle);
}

export function toggleSold(id) {
  return fetch(`${API_BASE}/products/${id}/sold`, { method: 'PATCH', headers: authHeaders() }).then(handle);
}

export function deleteProduct(id) {
  return fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle);
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  // Don't set Content-Type manually — the browser adds the multipart boundary itself.
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', headers: authHeaders(), body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.urls;
}
