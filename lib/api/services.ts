import { Booking, BookingStatus, RepairService } from "@/types/fixmate";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getBrowseServices = async ({
  query = "",
} = {}): Promise<RepairService[]> => {
  const url = query
    ? `${BASE_URL}/browse-services?${query}`
    : `${BASE_URL}/browse-services`;

  console.log("Fetching URL:", url); // Check your Next.js terminal!

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
};


export const getServiceDetails = async ({id} :{id: string}) =>{
  const res = await fetch(`${BASE_URL}/browse-services/${id}`)
  return res.json()

}

//customer booking api 

export const customerBookings = async (
  email: string
): Promise<Booking[]> => {
  const res = await fetch(
    `${BASE_URL}/bookings?customerEmail=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load your bookings.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};



export const technicianBookings = async (email: string): Promise<Booking[]> => {
  const res = await fetch(
    `${BASE_URL}/bookings?technicianEmail=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load incoming job requests.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};

export const updateBookingStatus = async (
  id: string,
  payload: { status: BookingStatus; finalAmount?: number }
) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update booking status.");
  }
  return result;
};