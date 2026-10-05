import { CartItem } from './cart';

/** Payload for POST /api/orders — matches the backend contract in project-overview.md. */
export interface CreateOrderPayload {
  userId: string; // Google sub or demo-filmmaker-001 (profiles.id)
  customerEmail: string;
  items: CartItem[]; // JSONB snapshot of purchased products
  paymentMethod: string;
}

/**
 * Backend response shape is unconfirmed; parsed tolerantly —
 * only success/failure gates the checkout flow.
 */
export interface OrderSubmissionResponse {
  orderId?: string;
  order?: { id?: string };
  [key: string]: unknown;
}
