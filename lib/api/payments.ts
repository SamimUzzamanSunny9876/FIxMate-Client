import { Payment } from "@/types/fixmate";
import { toast } from "sonner";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getCustomerPayments = async (email: string): Promise<Payment[]> => {
  const res = await fetch(
    `${BASE_URL}/payments?customerEmail=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load payment history.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const createCheckoutSession = async (
  bookingId: string
): Promise<{ url: string }> => {
  const res = await fetch(`${BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bookingId }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok || !result?.url) {
    throw new Error(result?.message || "Could not start Stripe checkout.");
  }
  return result;
};

export const verifyStripeSession = async (
  sessionId: string
): Promise<Payment> => {
  const res = await fetch(`${BASE_URL}/payments/verify-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sessionId }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to verify payment.");
  }
  return result;
};


export const handlePayNow = async (bookingId?: string) => {
  if (!bookingId) return;
  try {
    const { url } = await createCheckoutSession(bookingId);
    window.location.href = url;
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Could not start Stripe checkout."
    );
  }
};