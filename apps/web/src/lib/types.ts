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

export type Order = {
  _id: string;
  user: any;
  products: Array<{ product: Product; quantity: number }>;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
