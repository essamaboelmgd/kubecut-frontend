
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Types ---

// Auth
export type UserRole = "admin" | "user";

export interface User {
  user_id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  subscription: {
    max_units_per_month: number;
    max_devices: number;
    validity_days?: number;
    is_unlimited_units: boolean;
    is_unlimited_devices: boolean;
    unlimited_expiry_date?: string;
  };
  wallet_balance: number;
  created_at: string;
}

export interface UserWithStats extends User {
  units_used_all_time: number;
  units_used_this_month: number;
}

export interface UserListResponse {
  users: UserWithStats[];
  total: number;
  page: number;
  limit: number;
  total_consumed_tokens: number;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  role: UserRole;
}

export interface LoginRequest {
  phone: string;
  password: string;
  device_id: string;
  device_name?: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

// Projects
export interface Project {
  project_id: string;
  name: string;
  description: string;
  client_name: string;
  units: Unit[];
  status?: 'active' | 'completed' | 'pending';
  created_at: string;
  updated_at?: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  client_name?: string;
}

// Units
export type UnitType =
  | "ground" | "ground_side_panel" | "ground_fixed" | "ground_fixed_side_panel"
  | "sink" | "sink_side_panel" | "sink_fixed" | "sink_fixed_side_panel"
  | "drawers" | "drawers_side_panel" | "drawers_bottom_rail" | "drawers_bottom_rail_side_panel"
  | "corner_90_ground" | "corner_45_ground"
  | "wall" | "wall_side_panel" | "wall_fixed" | "wall_fixed_side_panel" | "wall_flip_top_doors_bottom"
  | "dish_rack" | "dish_rack_side_panel"
  | "corner_l_wall" | "corner_45_wall"
  | "tall_doors" | "tall_doors_side_panel" | "tall_doors_appliances" | "tall_doors_appliances_side_panel"
  | "tall_drawers_side_doors_top" | "tall_drawers_side_doors_top_side_panel"
  | "tall_drawers_bottom_doors_top" | "tall_drawers_bottom_doors_top_side_panel"
  | "tall_drawers_side_appliances_doors" | "tall_drawers_side_appliances_doors_side_panel"
  | "tall_drawers_bottom_appliances_doors_top" | "tall_drawers_bottom_appliances_doors_top_side_panel"
  | "two_small_20_one_large_side" | "two_small_20_one_large_bottom"
  | "one_small_16_two_large_side" | "one_small_16_two_large_bottom"
  | "side_flush" | "wall_microwave" | "wall_microwave_side_panel" | "wardrobe_wooden_base"
  | "tall_wooden_base" | "tall_drawers_bottom_rail_top_doors"
  | "three_turbo" | "drawer_built_in_oven" | "drawer_bottom_rail_built_in_oven";

export type DoorType = "hinged" | "flip";

export interface Part {
  name: string;
  width_cm: number;
  height_cm: number;
  depth_cm?: number;
  qty: number;
  edge_distribution?: {
    top: boolean;
    left: boolean;
    right: boolean;
    bottom: boolean;
  };
  area_m2?: number;
  edge_band_m?: number;
}

export interface UnitCalculateRequest {
  type: UnitType;
  width_cm: number;
  width_2_cm?: number;
  height_cm: number;
  depth_cm: number;
  depth_2_cm?: number;
  shelf_count?: number;
  door_count?: number;
  door_type?: DoorType;
  flip_door_height?: number;
  bottom_door_height?: number;
  oven_height?: number;
  microwave_height?: number;
  vent_height?: number;
  drawer_count?: number;
  drawer_height_cm?: number;
  fixed_part_cm?: number;
  options?: Record<string, any>;
  door_code_type?: 'basic' | 'additional' | 'additional_1' | 'additional_2';
  chassis_code_type?: 'basic' | 'additional_1' | 'additional_2';
  is_glass_doors?: boolean;
  is_glass_shelves?: boolean;
  settings_override?: Partial<SettingsModel>;
}

export interface UnitCalculateResponse {
  unit_id?: string;
  type: UnitType;
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  shelf_count: number;
  parts: Part[];
  total_edge_band_m: number;
  total_area_m2: number;
  material_usage: Record<string, number>;
  cost_breakdown: Record<string, number>;
  total_cost: number;
  settings_override?: Partial<SettingsModel>;
}

export interface UnitEstimateRequest {
  type: UnitType;
  width_cm: number;
  width_2_cm?: number;
  height_cm: number;
  depth_cm: number;
  depth_2_cm?: number;
  shelf_count?: number;
  door_count?: number;
  door_type?: DoorType;
  flip_door_height?: number;
  bottom_door_height?: number;
  oven_height?: number;
  microwave_height?: number;
  vent_height?: number;
  drawer_count?: number;
  drawer_height_cm?: number;
  fixed_part_cm?: number;
  options?: Record<string, any>;
  door_code_type?: 'basic' | 'additional' | 'additional_1' | 'additional_2';
  chassis_code_type?: 'basic' | 'additional_1' | 'additional_2';
  is_glass_doors?: boolean;
  is_glass_shelves?: boolean;
  settings_override?: Partial<SettingsModel>;
}

export interface UnitEstimateResponse {
  unit_id?: string;
  type: UnitType;
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  shelf_count: number;
  parts: Part[];
  total_edge_band_m: number;
  total_area_m2: number;
  material_usage: Record<string, number>;
  cost_breakdown: Record<string, number>;
  total_cost: number;
  settings_override?: Partial<SettingsModel>;
}

// Internal Counter
export interface InternalCounterPart {
  name: string;
  type: string;
  width_cm: number;
  height_cm: number;
  depth_cm?: number;
  qty: number;
  cutting_dimensions?: Record<string, number>;
  area_m2?: number;
  edge_band_m?: number;
}

export interface InternalCounterOptions {
  add_mirror?: boolean;
  add_base?: boolean;
  add_internal_shelf?: boolean;
  drawer_count?: number;
  back_clearance_cm?: number;
  expansion_gap_cm?: number;
}

export interface InternalCounterRequest {
  options?: InternalCounterOptions;
}

export interface InternalCounterResponse {
  unit_id: string;
  unit_type: UnitType;
  parts: InternalCounterPart[];
  total_edge_band_m: number;
  total_area_m2: number;
  material_usage: Record<string, number>;
}

// Edge Breakdown
export type EdgeType = "wood" | "pvc";

export interface EdgeDetail {
  edge: string;
  length_mm: number;
  length_m: number;
  edge_type: EdgeType;
  has_edge: boolean;
}

export interface EdgeBandPart {
  part_name: string;
  qty: number;
  edges: EdgeDetail[];
  total_edge_m: number;
  edge_type: EdgeType;
}

export interface EdgeBreakdownResponse {
  unit_id: string;
  parts: EdgeBandPart[];
  total_edge_m: number;
  total_cost?: number;
  cost_breakdown?: Record<string, number>;
}

export type CostEstimate = UnitEstimateResponse;
export type InternalCounter = InternalCounterResponse;
export type EdgeBreakdown = EdgeBreakdownResponse;
export type UnitPart = Part;

export interface Unit extends UnitCalculateResponse {
  id?: string; // MongoDB use _id but mapped to id in frontend usually
  project_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  door_code_type?: 'basic' | 'additional' | 'additional_1' | 'additional_2';
  chassis_code_type?: 'basic' | 'additional_1' | 'additional_2';
  is_glass_doors?: boolean;
  is_glass_shelves?: boolean;
}


export interface PartEdgeSettings {
  base_lower: string;
  base_upper: string;
  front_mirror: string;
  back_mirror: string;
  sides_ground: string;
  sides_upper: string;
  doors: string;
  exposed_panel: string;
  shelf: string;
  drawer_width: string;
  drawer_depth: string;
}

// Settings
export interface SettingsModel {
  assembly_method: string;
  handle_type: string;
  edge_banding_type: string;
  part_edge_settings: PartEdgeSettings;
  handle_profile_height: number;
  chassis_handle_drop: number;
  counter_thickness: number;
  mirror_width: number;
  back_deduction: number;
  router_depth: number;
  router_distance: number;
  router_thickness: number;
  door_width_deduction_no_edge: number;
  shelf_depth_deduction: number;
  ground_door_height_deduction_no_edge: number;
  edge_banding_waste_per_size: number;
  materials?: Record<string, MaterialInfo>;
  code_basic?: string;
  code_add_1?: string;
  code_add_2?: string;
  glass_price_m2: number;
}

export interface MaterialInfo {
  price_per_sheet?: number;
  sheet_size_m2?: number;
  price_per_meter?: number;
  description?: string;
}

// Marketplace
export enum ItemStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  SOLD = 'sold',
  RESERVED = 'reserved'
}

export interface MarketplaceItem {
  item_id: string;
  seller_id?: string;
  seller_name?: string;
  seller_phone?: string;
  buyer_id?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  images: string[];
  status: ItemStatus;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface MarketplaceListResponse {
  items: MarketplaceItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface MarketplaceItemCreate {
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit?: string;
  images?: string[];
  location?: string;
}

// Dashboard
export interface DashboardStats {
  projects: number;
  units: number;
  cutting_calculations: number;
  savings_percentage: number;
}

export interface RecentProject {
  id: string;
  name: string;
  units: number;
  date: string;
}

export interface TipOfTheDay {
  title: string;
  content: string;
}

// Auth Helpers
export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

// --- API Client ---

export const getHeaders = () => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || "Request failed");
  }
  if (response.status === 204) {
    return null as unknown as T;
  }
  return response.json();
};

// API Objects
export const authApi = {
  login: async (data: LoginRequest): Promise<Token> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },



  me: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  listUsers: async (page: number = 1, limit: number = 10, search?: string): Promise<UserListResponse> => {
    let url = `${API_URL}/auth/users?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  bulkAddTokens: async (userIds: string[], tokens: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/auth/users/bulk-tokens`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ user_ids: userIds, tokens }),
    });
    return handleResponse(response);
  },

  bulkUpdateSubscription: async (userIds: string[], subscription: any): Promise<boolean> => {
    const response = await fetch(`${API_URL}/auth/users/bulk-subscription`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ user_ids: userIds, subscription }),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/users/${userId}/role?role=${role}`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateSubscription: async (userId: string, subscription: any): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/users/${userId}/subscription`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(subscription),
    });
    return handleResponse(response);
  },
};

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await fetch(`${API_URL}/projects/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  create: async (data: ProjectCreateRequest): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  update: async (id: string, data: Partial<ProjectCreateRequest>): Promise<Project> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  addUnitToProject: async (projectId: string, unitId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/projects/${projectId}/units/${unitId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  removeUnitFromProject: async (projectId: string, unitId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/projects/${projectId}/units/${unitId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  exportProjectToExcel: async (projectId: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}/projects/${projectId}/export-excel`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export project');
    }
    return response.blob();
  }
};

export const unitsApi = {
  calculate: async (data: UnitCalculateRequest): Promise<UnitCalculateResponse> => {
    const response = await fetch(`${API_URL}/units/calculate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  estimate: async (data: UnitEstimateRequest): Promise<UnitEstimateResponse> => {
    const response = await fetch(`${API_URL}/units/estimate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getById: async (id: string): Promise<UnitCalculateResponse> => {
    const response = await fetch(`${API_URL}/units/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  save: async (data: UnitCalculateRequest): Promise<UnitCalculateResponse> => {
    const response = await fetch(`${API_URL}/units`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  create: async (data: UnitCalculateRequest): Promise<UnitCalculateResponse> => {
    return unitsApi.save(data);
  },
  calculateInternalCounter: async (unitId: string, options?: InternalCounterOptions): Promise<InternalCounterResponse> => {
    const response = await fetch(`${API_URL}/units/${unitId}/internal-counter/calculate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ options }),
    });
    return handleResponse(response);
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/units/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  update: async (id: string, data: UnitCalculateRequest): Promise<UnitCalculateResponse> => {
    const response = await fetch(`${API_URL}/units/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  getEdgeBreakdown: async (unitId: string, edgeType?: string): Promise<EdgeBreakdownResponse> => {
    const url = new URL(`${API_URL}/units/${unitId}/edge-breakdown`);
    if (edgeType) url.searchParams.append('edge_type', edgeType);

    const response = await fetch(url.toString(), {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  exportToExcel: async (unitId: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}/units/${unitId}/export-excel`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export excel');
    }
    return response.blob();
  }
};

export const settingsApi = {
  get: async (): Promise<SettingsModel> => {
    const response = await fetch(`${API_URL}/settings/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  update: async (data: Partial<SettingsModel>): Promise<SettingsModel> => {
    const response = await fetch(`${API_URL}/settings/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
};

export interface Ad {
  ad_id: string;
  title: string;
  image_url: string;
  link_url?: string;
  locations: ('dashboard_banner' | 'store_grid' | 'landing_page')[];
  is_active: boolean;
  priority: number;
  created_at: string;
}

export const adsApi = {
  getAds: async (location?: string): Promise<Ad[]> => {
    const query = location ? `?location=${location}` : '';
    const response = await fetch(`${API_URL}/ads/${query}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return handleResponse(response);
  },

  getAllAdsAdmin: async (): Promise<Ad[]> => {
    const response = await fetch(`${API_URL}/ads/admin`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createAd: async (data: any): Promise<Ad> => {
    const response = await fetch(`${API_URL}/ads/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateAd: async (id: string, data: any): Promise<Ad> => {
    const response = await fetch(`${API_URL}/ads/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteAd: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/ads/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  toggleAd: async (id: string): Promise<Ad> => {
    const response = await fetch(`${API_URL}/ads/${id}/toggle`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const marketplaceApi = {
  getAll: async (search?: string, status?: string, page: number = 1, limit: number = 30): Promise<MarketplaceListResponse> => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('q', search);
    if (status && status !== 'all') queryParams.append('status', status);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const response = await fetch(`${API_URL}/marketplace/items?${queryParams.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getMyOrders: async (): Promise<MarketplaceItem[]> => {
    const response = await fetch(`${API_URL}/marketplace/my-orders`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  async getSales(): Promise<MarketplaceItem[]> {
    const response = await fetch(`${API_URL}/marketplace/sales`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getItem: async (id: string): Promise<MarketplaceItem> => {
    const response = await fetch(`${API_URL}/marketplace/items/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getToken();
    // Do NOT set Content-Type header, let browser set it with boundary
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/marketplace/upload`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    return handleResponse(response);
  },
  create: async (data: MarketplaceItemCreate): Promise<MarketplaceItem> => {
    const response = await fetch(`${API_URL}/marketplace/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  update: async (id: string, data: Partial<MarketplaceItemCreate>): Promise<MarketplaceItem> => {
    const response = await fetch(`${API_URL}/marketplace/items/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  async acceptOrder(itemId: string): Promise<MarketplaceItem> {
    const response = await fetch(`${API_URL}/marketplace/items/${itemId}/accept`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  async denyOrder(itemId: string): Promise<MarketplaceItem> {
    const response = await fetch(`${API_URL}/marketplace/items/${itemId}/deny`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  async getBuyerDetails(itemId: string): Promise<{ name: string; phone: string; email: string }> {
    const response = await fetch(`${API_URL}/marketplace/items/${itemId}/buyer-contact`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getMyListings: async (): Promise<MarketplaceItem[]> => {
    const response = await fetch(`${API_URL}/marketplace/my-listings`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  buy: async (itemId: string, quantity: number = 1): Promise<MarketplaceItem> => {
    const response = await fetch(`${API_URL}/marketplace/items/${itemId}/buy`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },
  deleteItem: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/marketplace/items/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getRecentProjects: async (): Promise<RecentProject[]> => {
    const response = await fetch(`${API_URL}/dashboard/recent-projects`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getTipOfTheDay: async (): Promise<TipOfTheDay> => {
    const response = await fetch(`${API_URL}/dashboard/tip-of-the-day`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export const cartApi = {
  get: async (): Promise<{ items: any[], total: number, count: number }> => {
    const response = await fetch(`${API_URL}/cart/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  addItem: async (itemId: string, quantity: number = 1): Promise<any> => {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ item_id: itemId, quantity }),
    });
    return handleResponse(response);
  },
  removeItem: async (itemId: string): Promise<any> => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  updateQuantity: async (itemId: string, quantity: number): Promise<any> => {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },
  clear: async (): Promise<any> => {
    const response = await fetch(`${API_URL}/cart/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export interface Transaction {
  transaction_id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  balance_after: number;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface WalletStats {
  total_added: number;
  month_consumption: number;
}

export const walletApi = {
  getHistory: async (page: number = 1, limit: number = 10): Promise<TransactionHistoryResponse> => {
    const response = await fetch(`${API_URL}/wallet/history?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getStats: async (): Promise<WalletStats> => {
    const response = await fetch(`${API_URL}/wallet/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  topUp: async (amount: number, description: string): Promise<{ message: string, new_balance: number }> => {
    const response = await fetch(`${API_URL}/wallet/topup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, description }),
    });
    return handleResponse(response);
  },

  requestTopup: async (amount: number, notes?: string): Promise<{ message: string, request_id: string }> => {
    const response = await fetch(`${API_URL}/wallet/request-topup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount, notes }),
    });
    return handleResponse(response);
  },

  // Admin methods
  getRequests: async (status?: string, page = 1, limit = 10): Promise<{ requests: TokenRequest[], total: number, page: number, limit: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    if (status) params.append('status', status);

    const response = await fetch(`${API_URL}/wallet/requests?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  approveRequest: async (requestId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/wallet/requests/${requestId}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  rejectRequest: async (requestId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/wallet/requests/${requestId}/reject`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

export interface TokenRequest {
  id: string;
  user_id: string;
  amount: number;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user_name?: string;
  user_phone?: string;
  notes?: string;
}
