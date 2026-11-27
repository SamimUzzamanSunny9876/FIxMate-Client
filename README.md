# FixMate — Smart Device & Home Appliance Repair Service Platform (Client)

FixMate is a full-stack, role-based on-demand repair service booking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Better Auth**, and **Stripe**. Verified technicians list repair services across smartphones, laptops, home appliances, and electrical work; customers browse, filter, request repairs, track job progress step by step, pay online via Stripe only after completion, and leave verified ratings and reviews; admins moderate services, manage user roles, and monitor platform bookings and Stripe revenue.

## Live URLs

- **Live Web App:** https://fix-mate-client-sepia.vercel.app
- **Backend API Server:** https://fix-mate-server-iota.vercel.app

## Demo Credentials

> Update the placeholder rows below with your active test accounts before submission.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `Admin2@gmail.com` | `Sunny1451` |
| **Technician** | `technician3@gmail.com` | `Sunny1451` |
| **Customer** | `customer1@gmail.com` | `Sunny1451` |

## Key Features

### Public Experience
- **Dynamic Home Page:** Hero banner, latest 6 approved services, 4-step *How FixMate Works* workflow, and clickable repair categories.
- **Server-Side Browse Services (`/browse-services`):** Search by title, category, or area, filter by category and service mode (`Home Visit` / `Shop Drop-off`), and sort via URL parameters (`Newest`, `Price: Low to High`, `Price: High to Low`).
- **Service Details & Ratings (`/browse-services/[id]`):** Full service details, technician profile summary, aggregated star ratings, verified customer reviews, and role-aware repair request modal.

### Role-Based Dashboards
- **Customer Dashboard (`/dashboard/customer`):**
  - Overview stats cards, recent bookings, and recent payment receipts.
  - **My Bookings:** Track repair statuses (`Requested` → `Accepted` → `In Progress` → `Completed` → `Paid`), cancel `Requested` jobs with confirmation, pay completed jobs via Stripe Checkout, and submit or update 1–5 star ratings and reviews after payment.
  - **Payment History:** View paid transactions and download PDF receipts.
- **Technician Dashboard (`/dashboard/technician`):**
  - Overview metrics for earnings, active requests, completed jobs, and live listings.
  - **Add & Manage Services (Full CRUD):** Create listings with **ImgBB** photo uploads, edit listings (resets approval to `pending`), delete with confirmation, and toggle live availability.
  - **Manage Requests:** Enforce sequential job status updates (`Accept` / `Reject` → `Start Work` → `Mark Completed` with final repair amount).
- **Admin Dashboard (`/dashboard/admin`):**
  - Platform-wide overview of revenue, registered users, booking pipeline, and transactions.
  - **Service Moderation:** Approve or reject technician listings.
  - **User Management:** Promote or demote roles (`customer`, `technician`, `admin`) or remove users.
  - **All Bookings & Transactions:** Monitor all repair jobs and Stripe payment records.
- **Shared Profile (`/dashboard/profile`):** Update name, phone, service area, bio, and profile avatar via ImgBB without logging out.

## Tech Stack & NPM Packages

- **Framework & Language:** `next` (App Router), `react`, `typescript`
- **Styling & UI:** `tailwindcss`, `shadcn/ui`, `lucide-react`, `sonner`, `next-themes`
- **Authentication:** `better-auth`, `@better-auth/mongo-adapter`, `mongodb`
- **Payments & Media:** `stripe`, `@stripe/stripe-js`, ImgBB REST API

## Environment Variables (`.env.local`)

Create a `.env.local` file in the root of `FixMate-Client`:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URI=your_mongodb_connection_uri

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
