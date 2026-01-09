export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  phoneModels: string[];
  colors: string[];
  isFeatured: boolean;
  createdAt?: string;
};

export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type OrderStatus = "pending" | "accepted" | "declined";

export type OrderItem = {
  product: Product;
  quantity: number;
  phoneModel?: string;
  color?: string;
};

export type Order = {
  _id: string;
  user: any;
  products: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  phoneModel?: string;
  color?: string;
};

export type Review = {
  _id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  isFeatured: boolean;
  createdAt: string;
};
