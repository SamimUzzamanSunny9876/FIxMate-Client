// ==========================================
// Core Enums & Union Types
// ==========================================

export type UserRole = "customer" | "technician" | "admin";

export type TechnicianPlan = "free" | "pro";

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

// ==========================================
// 1. Users Collection (BetterAuth + Extra Fields)
// ==========================================

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  area?: string;
  bio?: string;
  plan?: TechnicianPlan;
  createdAt?: string | Date;
}

// ==========================================
// 2. Services Collection
// ==========================================

export interface RepairService {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string | Date;
}

export type CreateServicePayload = Omit<RepairService, "_id" | "createdAt">;

// ==========================================
// 3. Bookings Collection
// ==========================================

export interface StatusHistoryEntry {
  status: BookingStatus | "paid";
  changedAt: string | Date;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string | Date;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory?: StatusHistoryEntry[];
  rating?: number;
  review?: string;
  createdAt?: string | Date;
}

// ==========================================
// 4. Payments Collection
// ==========================================

export interface Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: "usd";
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string | Date;
}

