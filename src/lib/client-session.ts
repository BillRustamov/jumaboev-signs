"use client";

import { useSyncExternalStore } from "react";
import type { SignOrder } from "@/lib/order";

const USER_KEY = "jumaboev-username";
const ORDERS_KEY = "jumaboev-orders";
const USER_EVENT = "jumaboev-username-change";

function subscribeUsername(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  window.addEventListener(USER_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(USER_EVENT, onChange);
  };
}

export function readUsername(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(USER_KEY) ?? "";
}

export function writeUsername(username: string): void {
  window.localStorage.setItem(USER_KEY, username);
  window.dispatchEvent(new Event(USER_EVENT));
}

export function readLocalOrders(): SignOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SignOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalOrder(order: SignOrder): void {
  const next = [order, ...readLocalOrders().filter((item) => item.id !== order.id)];
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
}

export function useUsername(): string {
  return useSyncExternalStore(subscribeUsername, readUsername, () => "");
}
