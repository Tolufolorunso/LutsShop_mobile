import { Platform } from 'react-native';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Product, ProductFilterParams } from '../types/product';
import { RawCartEnvelope, RawCartRow } from '../types/cart';
import { CreateOrderPayload, OrderSubmissionResponse, PurchaseOrder, PurchaseOrderItem } from '../types/order';

// Determine default base URL based on runtime environment
const getDefaultBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL.replace(/\/+$/, '');
  }
  // Android emulator loopback alias
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // iOS simulator and web default
  return 'http://localhost:3000';
};

export const API_BASE_URL = getDefaultBaseUrl();

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

// Timeout-guarded fetch wrapper
const fetchWithTimeout = async (
  url: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { timeoutMs = 8000, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Build URL query string from parameters
const buildQueryString = (
  params?: Record<string, string | number | boolean | undefined>
): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const apiClient = {
  get: async <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<T> => {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}${buildQueryString(params)}`;

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        errorBody?.error || errorBody?.message || `Request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json() as Promise<T>;
  },

  post: async <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> => {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}`;

    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        errorBody?.error || errorBody?.message || `Request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json() as Promise<T>;
  },

  delete: async <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<T> => {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${normalizedEndpoint}${buildQueryString(params)}`;

    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new ApiError(
        errorBody?.error || errorBody?.message || `Request failed with status ${response.status}`,
        response.status,
        errorBody
      );
    }

    return response.json() as Promise<T>;
  },
};

// Filter mock products in-memory for offline fallback
const filterMockProducts = (params?: ProductFilterParams): Product[] => {
  let list = [...MOCK_PRODUCTS];

  if (params?.featured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (params?.category && params.category !== 'All') {
    list = list.filter(
      (p) => p.category.toLowerCase() === params.category?.toLowerCase()
    );
  }

  if (params?.camera && params.camera !== 'All') {
    const camLower = params.camera.toLowerCase();
    list = list.filter((p) =>
      p.supportedCameras.some(
        (c) => c.toLowerCase().includes(camLower) || c.toLowerCase() === 'all'
      )
    );
  }

  if (params?.search && params.search.trim() !== '') {
    const query = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.supportedCameras.some((c) => c.toLowerCase().includes(query))
    );
  }

  return list;
};

// Typed Product fetchers with transparent offline fallback
export const fetchProducts = async (
  params?: ProductFilterParams
): Promise<Product[]> => {
  try {
    const queryParams: Record<string, string | boolean | undefined> = {
      search: params?.search,
      category: params?.category && params.category !== 'All' ? params.category : undefined,
      camera: params?.camera && params.camera !== 'All' ? params.camera : undefined,
      featured: params?.featured ? true : undefined,
    };

    const data = await apiClient.get<Product[] | { products: Product[] }>(
      '/api/products',
      queryParams,
      { timeoutMs: 5000 }
    );

    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.products)) {
      return data.products;
    }
    return filterMockProducts(params);
  } catch {
    // Network error, backend server offline, or timeout: return curated local fallback
    return filterMockProducts(params);
  }
};

export const fetchProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  try {
    const data = await apiClient.get<Product | { product: Product }>(
      `/api/products/${slug}`,
      undefined,
      { timeoutMs: 5000 }
    );

    if ('product' in data && data.product) {
      return data.product;
    }
    return (data as Product) || null;
  } catch {
    // Return matching mock item from curated dataset
    const found = MOCK_PRODUCTS.find(
      (p) => p.slug === slug || p.id === slug
    );
    return found || null;
  }
};

// ---------------------------------------------------------------------------
// Backend cart sync (GET/POST/DELETE /api/cart)
// ---------------------------------------------------------------------------

// The GET /api/cart response shape is not documented; tolerate the common
// shapes: bare id strings, { product_id | productId | id } rows, an
// { items | cart_items } wrapper around either, or enriched products with id.
const extractCartProductIds = (data: unknown): string[] => {
  const toId = (entry: unknown): string | null => {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry === 'object') {
      const row = entry as RawCartRow;
      if (typeof row.product_id === 'string') return row.product_id;
      if (typeof row.productId === 'string') return row.productId;
      if (typeof row.id === 'string') return row.id;
    }
    return null;
  };

  let list: unknown = data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const envelope = data as RawCartEnvelope;
    list = envelope.items ?? envelope.cart_items ?? [];
  }
  if (!Array.isArray(list)) return [];

  return list.map(toId).filter((id): id is string => id !== null);
};

export const fetchCartProductIds = async (userId: string): Promise<string[]> => {
  const data = await apiClient.get<unknown>(
    '/api/cart',
    { userId },
    { timeoutMs: 5000 }
  );
  return extractCartProductIds(data);
};

export const addRemoteCartItem = async (
  userId: string,
  productId: string
): Promise<void> => {
  await apiClient.post('/api/cart', { userId, productId }, { timeoutMs: 5000 });
};

export const removeRemoteCartItem = async (
  userId: string,
  productId: string
): Promise<void> => {
  await apiClient.delete('/api/cart', { userId, productId }, { timeoutMs: 5000 });
};

export const clearRemoteCart = async (userId: string): Promise<void> => {
  await apiClient.delete('/api/cart', { userId, clearAll: true }, { timeoutMs: 5000 });
};

export const placeOrder = async (
  payload: CreateOrderPayload
): Promise<OrderSubmissionResponse> => {
  // The backend expects items as [{ productId, price }] wire rows, not the
  // full CartItem snapshot — map before posting (lutshop api/orders POST).
  const items = payload.items.map((item) => ({
    productId: item.id,
    price: item.price,
  }));
  return apiClient.post<OrderSubmissionResponse>('/api/orders', {
    ...payload,
    items,
  });
};

// ---------------------------------------------------------------------------
// Order history (GET /api/orders) — My Library
// ---------------------------------------------------------------------------

// The GET /api/orders response shape is unconfirmed; tolerate a bare array or
// an { orders | items } envelope, and snake_case or camelCase fields.
const pickString = (row: Record<string, unknown>, keys: string[]): string | null => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
};

const pickNumber = (row: Record<string, unknown>, keys: string[]): number | null => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return null;
};

const normalizeOrderItems = (rawItems: unknown): PurchaseOrderItem[] => {
  if (!Array.isArray(rawItems)) return [];

  const items: PurchaseOrderItem[] = [];
  for (const entry of rawItems) {
    if (!entry || typeof entry !== 'object') continue;
    const row = entry as Record<string, unknown>;
    const title = pickString(row, ['title']);
    if (!title) {
      console.warn('Order history: skipping item without a title');
      continue;
    }
    items.push({
      id: pickString(row, ['id', 'product_id', 'productId']) ?? title,
      title,
      price: pickNumber(row, ['price']) ?? 0,
      thumbnailUrl: pickString(row, ['thumbnailUrl', 'thumbnail_url']),
      category: pickString(row, ['category']),
      lutCount: pickNumber(row, ['lutCount', 'lut_count']),
      downloadUrl: pickString(row, ['downloadUrl', 'download_url']),
    });
  }
  return items;
};

export const fetchOrderHistory = async (userId: string): Promise<PurchaseOrder[]> => {
  const data = await apiClient.get<unknown>(
    '/api/orders',
    { userId },
    { timeoutMs: 8000 }
  );

  let list: unknown = data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const envelope = data as { orders?: unknown; items?: unknown };
    list = envelope.orders ?? envelope.items ?? [];
  }
  if (!Array.isArray(list)) return [];

  const orders: PurchaseOrder[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') continue;
    const row = entry as Record<string, unknown>;
    const items = normalizeOrderItems(row.items);
    if (items.length === 0) {
      console.warn('Order history: skipping order with no renderable items');
      continue;
    }
    orders.push({
      id: pickString(row, ['id', 'order_id', 'orderId']) ?? `order-${orders.length}`,
      createdAt: pickString(row, ['created_at', 'createdAt']),
      paymentMethod: pickString(row, ['payment_method', 'paymentMethod']),
      items,
    });
  }
  return orders;
};
