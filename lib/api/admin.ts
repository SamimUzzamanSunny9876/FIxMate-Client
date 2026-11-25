import { Booking, BookingStatus, Payment, UserRole } from "@/types/fixmate";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export const updateUserRole = async (email: string, role: UserRole) => {
  const res = await fetch(
    `${BASE_URL}/admin/user/${encodeURIComponent(email)}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    }
  );

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update user role.");
  }
  return result;
};

export const deleteUser = async (email: string) => {
  const res = await fetch(
    `${BASE_URL}/admin/users/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete user.");
  }
  return result;
};

// --- Bookings ---
export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${BASE_URL}/admin/bookings`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load all bookings.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const adminUpdateBookingStatus = async (
  id: string,
  status: BookingStatus
) => {
  const res = await fetch(`${BASE_URL}/admin/bookings/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update booking status.");
  }
  return result;
};

export const adminDeleteBooking = async (id: string) => {
  const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete booking.");
  }
  return result;
};

// --- Transactions ---
export const getAllTransactions = async (): Promise<Payment[]> => {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load transactions.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};