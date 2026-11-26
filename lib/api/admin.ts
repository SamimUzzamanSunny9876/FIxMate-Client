import { Booking, BookingStatus, Payment, UserRole } from "@/types/fixmate";
import { protectedMutation, protectedQuery } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export const updateUserRole = (email: string, role: UserRole) =>
  protectedMutation(
    `${BASE_URL}/admin/users/${encodeURIComponent(email)}/role`,
    "PATCH",
    { role }
  );

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
export const getAllBookings = () =>
  protectedQuery<Booking[]>(`${BASE_URL}/admin/bookings`);

export const adminUpdateBookingStatus = (id: string, status: BookingStatus) =>
  protectedMutation(`${BASE_URL}/admin/bookings/${id}/status`, "PATCH", { status });

export const adminDeleteBooking = (id: string) =>
  protectedMutation(`${BASE_URL}/admin/bookings/${id}`, "DELETE");

// --- Transactions ---
export const getAllTransactions = () =>
  protectedQuery<Payment[]>(`${BASE_URL}/payments`);