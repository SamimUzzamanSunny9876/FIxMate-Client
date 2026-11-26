import {
  ApprovalStatus,
  Booking,
  BookingStatus,
  RepairService,
} from "@/types/fixmate";
import { protectedMutation, protectedQuery } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// --- Public Routes (plain fetch) ---
export const getBrowseServices = async ({
  query = "",
} = {}): Promise<RepairService[]> => {
  const url = query
    ? `${BASE_URL}/browse-services?${query}`
    : `${BASE_URL}/browse-services`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
};

export const getServiceDetails = async ({ id }: { id: string }) => {
  const res = await fetch(`${BASE_URL}/browse-services/${id}`, {
    cache: "no-store",
  });
  return res.json();
};

// --- Protected Routes ---
export const customerBookings = async (email: string): Promise<Booking[]> => {
  const result = await protectedQuery<Booking[] | { data?: Booking[] }>(
    `${BASE_URL}/bookings?customerEmail=${encodeURIComponent(email)}`
  );
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const technicianBookings = async (email: string): Promise<Booking[]> => {
  const result = await protectedQuery<Booking[] | { data?: Booking[] }>(
    `${BASE_URL}/bookings?technicianEmail=${encodeURIComponent(email)}`
  );
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const updateBookingStatus = async (
  id: string,
  payload: { status: BookingStatus; finalAmount?: number }
) => {
  return protectedMutation(`${BASE_URL}/bookings/${id}`, "PATCH", payload);
};

export const getAdminServices = async (): Promise<RepairService[]> => {
  const result = await protectedQuery<
    RepairService[] | { data?: RepairService[] }
  >(`${BASE_URL}/admin/services`);
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const updateServiceApproval = async (
  id: string,
  approvalStatus: ApprovalStatus
) => {
  return protectedMutation(
    `${BASE_URL}/admin/services/${id}/approval`,
    "PATCH",
    { approvalStatus }
  );
};