"use client";

import { useSyncExternalStore } from "react";
import type { SignOrder } from "@/lib/order";

const USER_KEY = "jumaboev-username";
const ORDERS_KEY = "jumaboev-orders";

export function readUsername(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(USER_KEY) ?? "";
}

export function writeUsername(username: string): void {
  window.localStorage.setItem(USER_KEY, username);
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
  return useSyncExternalStore(
    () => () => {},
    readUsername,
    () => "",
  );
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
