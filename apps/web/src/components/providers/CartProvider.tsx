"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "../../lib/types";
import { safeJsonParse } from "../../lib/storage";

type CartState = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (
    product: Product,
    quantity?: number,
    opts?: { phoneModel?: string; color?: string }
  ) => void;
  remove: (cartItemId: string) => void;
  setQty: (cartItemId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
const LS_KEY = "specific_cart";

function makeCartItemId(productId: string, phoneModel?: string, color?: string) {
  return [productId, phoneModel ?? "", color ?? ""].join("::");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = safeJsonParse<CartItem[]>(
      typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
    );
    if (saved?.length) {
      setItems(
        saved
          .map((i: any) => {
            const id =
              typeof i?.id === "string" && i.id
                ? i.id
                : makeCartItemId(i.product?._id, i.phoneModel, i.color);
            return { ...i, id } as CartItem;
          })
          .filter((i) => i?.product?._id)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((
    product: Product,
    quantity = 1,
    opts?: { phoneModel?: string; color?: string }
  ) => {
    const phoneModel = opts?.phoneModel?.trim() || undefined;
    const color = opts?.color?.trim() || undefined;
    const id = makeCartItemId(product._id, phoneModel, color);
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { id, product, quantity, phoneModel, color }];
    });
  }, []);

  const remove = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }, []);

  const setQty = useCallback((cartItemId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === cartItemId
            ? { ...i, quantity: Math.max(1, Math.floor(quantity)) }
            : i
        )
        .filter(Boolean)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.product.price, 0);

  const value = useMemo(
    () => ({ items, count, subtotal, add, remove, setQty, clear }),
    [items, count, subtotal, add, remove, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
