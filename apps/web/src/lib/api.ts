import type { Order, Product, User } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

type ApiError = { message: string };

async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (opts.token) headers.set("Authorization", `Bearer ${opts.token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(err?.message || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function buildUploadUrl(relative: string) {
  if (!relative) return relative;
  if (relative.startsWith("http")) return relative;
  return `${API_URL}${relative}`;
}

export const api = {
  async health() {
    return apiFetch<{ ok: boolean }>("/api/health");
  },

  async register(payload: { name: string; email: string; password: string }) {
    return apiFetch<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }) {
    return apiFetch<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async me(token: string) {
    return apiFetch<{ user: any }>("/api/users/me", { token });
  },

  async products(params: {
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    phoneModel?: string;
    color?: string;
    featured?: boolean;
    sort?: "price_asc" | "price_desc" | "newest";
  }) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.minPrice !== undefined) sp.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined) sp.set("maxPrice", String(params.maxPrice));
    if (params.phoneModel) sp.set("phoneModel", params.phoneModel);
    if (params.color) sp.set("color", params.color);
    if (params.featured !== undefined) sp.set("featured", String(params.featured));
    if (params.sort) sp.set("sort", params.sort);
    return apiFetch<{ products: Product[] }>(`/api/products?${sp.toString()}`);
  },

  async product(id: string) {
    return apiFetch<{ product: Product }>(`/api/products/${id}`);
  },

  async wishlist(token: string) {
    return apiFetch<{ wishlist: Product[] }>("/api/users/wishlist", { token });
  },

  async wishlistAdd(token: string, productId: string) {
    return apiFetch<{ ok: true }>("/api/users/wishlist", {
      method: "POST",
      token,
      body: JSON.stringify({ productId }),
    });
  },

  async wishlistRemove(token: string, productId: string) {
    return apiFetch<{ ok: true }>(`/api/users/wishlist/${productId}`, {
      method: "DELETE",
      token,
    });
  },

  async createOrder(
    token: string,
    products: Array<{ productId: string; quantity: number }>
  ) {
    return apiFetch<{ message: string; order: Order }>("/api/orders", {
      method: "POST",
      token,
      body: JSON.stringify({ products }),
    });
  },

  async myOrders(token: string) {
    return apiFetch<{ orders: Order[] }>("/api/orders/mine", { token });
  },

  async adminOrders(token: string) {
    return apiFetch<{ orders: Order[] }>("/api/orders/all", { token });
  },

  async adminOrder(token: string, id: string) {
    return apiFetch<{ order: Order }>(`/api/orders/${id}`, { token });
  },

  async adminUpdateOrderStatus(
    token: string,
    id: string,
    status: "pending" | "accepted" | "declined"
  ) {
    return apiFetch<{ order: Order }>(`/api/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    });
  },

  async adminCreateProduct(token: string, form: FormData) {
    return apiFetch<{ product: Product }>("/api/products", {
      method: "POST",
      token,
      body: form,
    });
  },

  async adminUpdateProduct(token: string, id: string, form: FormData) {
    return apiFetch<{ product: Product }>(`/api/products/${id}`, {
      method: "PUT",
      token,
      body: form,
    });
  },

  async adminDeleteProduct(token: string, id: string) {
    return apiFetch<{ ok: true }>(`/api/products/${id}`, { method: "DELETE", token });
  },
};
