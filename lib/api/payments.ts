import { Payment } from "@/types/fixmate";
import { toast } from "sonner";
import { protectedMutation, protectedQuery } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getCustomerPayments = async (
  email: string
): Promise<Payment[]> => {
  const result = await protectedQuery<Payment[] | { data?: Payment[] }>(
    `${BASE_URL}/payments?customerEmail=${encodeURIComponent(email)}`
  );
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const createCheckoutSession = async (
  bookingId: string
): Promise<{ url: string }> => {
  const result = (await protectedMutation(
    `${BASE_URL}/create-checkout-session`,
    "POST",
    { bookingId }
  )) as { url?: string } | null;
  if (!result?.url) {
    throw new Error("Could not start Stripe checkout.");
  }
  return { url: result.url };
};

export const verifyStripeSession = async (
  sessionId: string
): Promise<Payment> => {
  return (await protectedMutation(
    `${BASE_URL}/payments/verify-session`,
    "POST",
    { sessionId }
  )) as Payment;
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