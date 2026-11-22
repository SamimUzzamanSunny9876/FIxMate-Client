import { Booking, CreateServicePayload, RepairService } from "@/types/fixmate";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


  export type UpdateServicePayload = Partial<
  Omit<
    RepairService,
    "_id" | "createdAt" | "technicianName" | "technicianEmail"
  >
>;

export const createService = async (data: CreateServicePayload) => {
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result?.message || "Failed to publish service.");
  }

  return result;
};




// getTechnicianServices 

export const getTechnicianServices = async (
  email: string
): Promise<RepairService[]> => {
  const res = await fetch(
    `${BASE_URL}/services?technicianEmail=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(result?.message || "Failed to load your services.");
  }
  return Array.isArray(result) ? result : (result?.data ?? []);
};

// updateTechnician Services

export const updateService = async (
  id: string,
  data: UpdateServicePayload
): Promise<RepairService> => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to update service.");
  }
  return result?.data ?? result;
};

//. deletetechnicianServices 

export const deleteService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete service.");
  }
  return result;
};


// making customer bookings 

export const customerBookingService= async (data: Booking) => {
      const booking = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await booking.json().catch(() => ({}));
      if (!booking.ok) {
        throw new Error(
          result?.message || "Failed to submit repair request."
        );
      }

}
