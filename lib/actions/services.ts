'use server';

import { Booking, CreateServicePayload, RepairService } from "@/types/fixmate";
import { User } from "@/types/fixmate";
import {  protectedMutation, protectedQuery } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


  export type UpdateServicePayload = Partial<
  Omit<
    RepairService,
    "_id" | "createdAt" | "technicianName" | "technicianEmail"
  >
>;

export const createService = async (data: CreateServicePayload) =>
  protectedMutation(`${BASE_URL}/services`, "POST", data);




// getTechnicianServices 

export const getTechnicianServices = async (email: string) =>
  protectedQuery<RepairService[]>(
    `${BASE_URL}/services?technicianEmail=${encodeURIComponent(email)}`
  );

// updateTechnician Services

export const updateService = async (id: string, data: UpdateServicePayload) =>
  protectedMutation(`${BASE_URL}/services/${id}`, "PATCH", data);

//. deletetechnicianServices 

export const deleteService = async (id: string) =>
  protectedMutation(`${BASE_URL}/services/${id}`, "DELETE");


// making customer bookings  api 

export const customerBookingService = async(data: Booking) =>
  protectedMutation(`${BASE_URL}/bookings`, "POST", data);

//cancel booking by customer 

export const cancelCustomerBooking = async (id: string) =>
  protectedMutation(`${BASE_URL}/bookings/${id}`, "PATCH", { status: "cancelled" });



export type ProfileUpdatePayload = {
  name: string;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
};

export const getUserProfile = async (email: string) =>
  protectedQuery<User | null>(`${BASE_URL}/user/${encodeURIComponent(email)}`);

export const profileUpdate = async (email: string, data: ProfileUpdatePayload) =>
  protectedMutation(`${BASE_URL}/user/${encodeURIComponent(email)}`, "PATCH", data);
