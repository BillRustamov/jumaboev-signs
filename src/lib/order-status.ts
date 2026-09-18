import type { ShopService, SignOrder } from "@/lib/order";

function serviceOf(value: unknown): ShopService {
  return value === "PRINT_ONLY" ? "PRINT_ONLY" : "CUSTOM_DESIGN";
}

export const PRODUCTION_STATUSES = [
  "RECEIVED",
  "NEEDS_REVIEW",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_PRODUCTION",
  "READY_FOR_PAYMENT",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PAYMENT_PENDING",
  "PAID",
  "PAYMENT_FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const PRODUCTION_SET = new Set<string>(PRODUCTION_STATUSES);
const PAYMENT_SET = new Set<string>(PAYMENT_STATUSES);

const LEGACY_PRODUCTION: Record<string, ProductionStatus> = {
  received: "RECEIVED",
  RECEIVED: "RECEIVED",
};

export function isProductionStatus(value: unknown): value is ProductionStatus {
  return typeof value === "string" && PRODUCTION_SET.has(value);
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && PAYMENT_SET.has(value);
}

export function resolveProductionStatus(value: unknown): ProductionStatus {
  if (typeof value === "string") {
    if (isProductionStatus(value)) return value;
    const mapped = LEGACY_PRODUCTION[value];
    if (mapped) return mapped;
  }
  return "RECEIVED";
}

export function resolvePaymentStatus(value: unknown): PaymentStatus {
  return isPaymentStatus(value) ? value : "UNPAID";
}

export function initialProductionStatus(input: {
  service: ShopService;
  printExact?: boolean;
  printNotes?: string;
}): ProductionStatus {
  if (
    input.service === "PRINT_ONLY" &&
    (input.printExact === false || Boolean(input.printNotes?.trim()))
  ) {
    return "NEEDS_REVIEW";
  }
  return "RECEIVED";
}

export function compatStatus(
  production: ProductionStatus,
): SignOrder["status"] {
  return production === "RECEIVED" ? "received" : production;
}

export function productionOf(order: Pick<SignOrder, "productionStatus" | "status">): ProductionStatus {
  return resolveProductionStatus(order.productionStatus ?? order.status);
}

export function paymentOf(order: Pick<SignOrder, "paymentStatus">): PaymentStatus {
  return resolvePaymentStatus(order.paymentStatus);
}

export function hydrateOrder(raw: SignOrder): SignOrder {
  const service = serviceOf(raw.service);
  const productionStatus = resolveProductionStatus(
    raw.productionStatus ?? raw.status,
  );
  const paymentStatus = resolvePaymentStatus(raw.paymentStatus);
  const quantity =
    typeof raw.quantity === "number" && raw.quantity > 0 ? raw.quantity : 1;
  const amountMinor =
    typeof raw.amountMinor === "number" && Number.isFinite(raw.amountMinor)
      ? Math.round(raw.amountMinor)
      : null;
  return {
    ...raw,
    service,
    productionStatus,
    paymentStatus,
    status: compatStatus(productionStatus),
    quantity,
    widthIn: 20,
    heightIn: 12,
    amountMinor,
    currency: raw.currency === "usd" || !raw.currency ? "usd" : raw.currency,
    updatedAt: raw.updatedAt || raw.createdAt,
  };
}

export function stampNewOrder(order: SignOrder): SignOrder {
  const service = serviceOf(order.service);
  const productionStatus = initialProductionStatus({
    service,
    printExact: order.printExact,
    printNotes: order.printNotes,
  });
  return hydrateOrder({
    ...order,
    service,
    productionStatus,
    paymentStatus: "UNPAID",
    quantity: 1,
    widthIn: 20,
    heightIn: 12,
    amountMinor: null,
    currency: "usd",
    updatedAt: order.createdAt,
  });
}

const NEXT_PRODUCTION: Record<ProductionStatus, ProductionStatus[]> = {
  RECEIVED: ["NEEDS_REVIEW", "AWAITING_APPROVAL", "APPROVED", "CANCELLED"],
  NEEDS_REVIEW: ["AWAITING_APPROVAL", "APPROVED", "CANCELLED"],
  AWAITING_APPROVAL: ["APPROVED", "NEEDS_REVIEW", "CANCELLED"],
  APPROVED: ["IN_PRODUCTION", "READY_FOR_PAYMENT", "CANCELLED"],
  IN_PRODUCTION: ["READY_FOR_PAYMENT", "READY_FOR_PICKUP", "CANCELLED"],
  READY_FOR_PAYMENT: ["IN_PRODUCTION", "READY_FOR_PICKUP", "CANCELLED"],
  READY_FOR_PICKUP: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function nextProductionStates(
  current: ProductionStatus,
): ProductionStatus[] {
  return NEXT_PRODUCTION[current];
}

export function canMoveProduction(
  from: ProductionStatus,
  to: ProductionStatus,
): boolean {
  return from === to || NEXT_PRODUCTION[from].includes(to);
}

export function canEnterReadyForPayment(order: SignOrder): string | null {
  const amount = order.amountMinor;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "Set an approved price in cents before Ready for payment.";
  }
  if (productionOf(order) === "CANCELLED") {
    return "A cancelled ticket cannot be ready for payment.";
  }
  if (paymentOf(order) === "PAID") {
    return "This ticket is already marked paid.";
  }
  return null;
}

export function assertProductionMove(
  order: SignOrder,
  next: ProductionStatus,
): string | null {
  const current = productionOf(order);
  if (!canMoveProduction(current, next)) {
    return `Cannot move ${current} to ${next}.`;
  }
  if (next === "READY_FOR_PAYMENT") {
    return canEnterReadyForPayment({ ...order, productionStatus: current });
  }
  return null;
}

/** Admin never writes a paid state. Stripe webhooks will, later. */
export function assertPaymentMove(next: PaymentStatus): string | null {
  if (next === "PAID" || next === "REFUNDED" || next === "PARTIALLY_REFUNDED") {
    return "Payment status is not set by hand. Card pay is not open yet.";
  }
  if (next === "PAYMENT_PENDING") {
    return "Payment pending waits for a real checkout session.";
  }
  return null;
}
