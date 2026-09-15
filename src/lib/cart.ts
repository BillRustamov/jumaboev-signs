"use client";

import { useSyncExternalStore } from "react";
import type { SignFields } from "@/lib/order";

export type CartItem = {
  id: string;
  fields: SignFields;
  addedAt: string;
};

const CART_KEY = "jumaboev-cart";
const CART_EVENT = "jumaboev-cart-change";

function canUseStore(): boolean {
  return typeof window !== "undefined";
}

function emitCartChange(): void {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function readCart(): CartItem[] {
  if (!canUseStore()) return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartChange();
}

export function addToCart(fields: SignFields): CartItem {
  const item: CartItem = {
    id: `CART-${Math.floor(100000 + Math.random() * 900000)}`,
    fields: { ...fields, fleetNumber: "" },
    addedAt: new Date().toISOString(),
  };
  writeCart([item, ...readCart()]);
  return item;
}

export function removeFromCart(id: string): void {
  writeCart(readCart().filter((item) => item.id !== id));
}

export function clearCart(): void {
  writeCart([]);
}

function subscribeCart(onChange: () => void): () => void {
  if (!canUseStore()) return () => {};
  window.addEventListener("storage", onChange);
  window.addEventListener(CART_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CART_EVENT, onChange);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribeCart, readCart, () => []);
}

export function useCartCount(): number {
  return useSyncExternalStore(
    subscribeCart,
    () => readCart().length,
    () => 0,
  );
}
