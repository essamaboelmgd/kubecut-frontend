// API Configuration and helpers
const API_BASE_URL = '/api'; // Replace with actual API URL

// Auth token management
export const getToken = () => localStorage.getItem('auth_token');
export const setToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeToken = () => localStorage.removeItem('auth_token');

// API request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'خطأ في الاتصال' }));
    throw new Error(error.message || 'حدث خطأ غير متوقع');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: RegisterData) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Settings API
export const settingsApi = {
  get: () => request<Settings>('/settings'),
  update: (data: Partial<Settings>) =>
    request<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Projects API
export const projectsApi = {
  getAll: () => request<Project[]>('/projects/'),
  getById: (id: string) => request<Project>(`/projects/${id}`),
  create: (data: CreateProjectData) =>
    request<Project>('/projects/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateProjectData>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
};

// Units API
export const unitsApi = {
  calculate: (projectId: string, data: CreateUnitData) =>
    request<Unit>(`/units/calculate?project_id=${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getById: (id: string) => request<Unit>(`/units/${id}`),
  estimate: (data: EstimateData) =>
    request<CostEstimate>('/units/estimate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  calculateInternalCounter: (unitId: string) =>
    request<InternalCounter>(`/units/${unitId}/internal-counter/calculate`, {
      method: 'POST',
    }),
  getEdgeBreakdown: (unitId: string) =>
    request<EdgeBreakdown>(`/units/${unitId}/edge-breakdown`),
};

// Store API
export const storeApi = {
  getProducts: (params?: ProductFilters) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.search) searchParams.append('search', params.search);
    return request<Product[]>(`/store/products?${searchParams.toString()}`);
  },
  getProductById: (id: string) => request<Product>(`/store/products/${id}`),
  createProduct: (data: CreateProductData) =>
    request<Product>('/store/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface Settings {
  assembly_method: 'lamello' | 'screws' | 'dowels';
  handle_type: 'knob' | 'bar' | 'hidden';
  handle_recess_height_mm: number;
  default_board_thickness_mm: number;
  back_panel_thickness_mm: number;
  edge_overlap_mm: number;
  back_clearance_mm: number;
  top_clearance_mm: number;
  bottom_clearance_mm: number;
  side_overlap_mm: number;
  sheet_size_m2: number;
  materials: {
    plywood_sheet_price: number;
    edge_band_price: number;
  };
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  units_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  name: string;
  client: string;
  description: string;
}

export interface Unit {
  id: string;
  type: 'ground' | 'wall' | 'double_door' | 'sink_ground';
  width: number;
  height: number;
  depth: number;
  shelves_count: number;
  parts: UnitPart[];
  total_area: number;
  total_edge_length: number;
}

export interface UnitPart {
  name: string;
  width: number;
  height: number;
  quantity: number;
}

export interface CreateUnitData {
  type: 'ground' | 'wall' | 'double_door' | 'sink_ground';
  width: number;
  height: number;
  depth: number;
  shelves_count: number;
  options?: Record<string, unknown>;
}

export interface EstimateData {
  unit_id: string;
}

export interface CostEstimate {
  material_cost: number;
  edge_cost: number;
  total: number;
}

export interface InternalCounter {
  drawers: number;
  shelves: number;
}

export interface EdgeBreakdown {
  edges: { type: string; length: number }[];
  total: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  type: 'wood' | 'metal' | 'aluminum' | 'other';
  image: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  size: string;
  type: 'wood' | 'metal' | 'aluminum' | 'other';
  image: string;
}

export interface ProductFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
