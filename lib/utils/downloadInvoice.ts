import { jsPDF } from "jspdf";
import { Payment } from "@/types/fixmate";

export const downloadPaymentInvoice = (payment: Payment) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const paidDate = payment.paidAt
    ? new Date(payment.paidAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  // Top Indigo Header Bar
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageWidth, 95, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FixMate", 45, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Smart Device & Home Appliance Repair Platform", 45, 68);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", pageWidth - 45, 48, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Status: PAID`, pageWidth - 45, 68, { align: "right" });

  // Metadata Row
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Paid Date:", 45, 130);
  doc.text("Transaction ID:", 45, 148);
  doc.text("Booking ID:", 45, 166);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(paidDate, 140, 130);
  doc.text(payment.transactionId || "—", 140, 148);
  doc.text(payment.bookingId || "—", 140, 166);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(45, 185, pageWidth - 45, 185);

  // Customer & Technician Details
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILLED TO (CUSTOMER)", 45, 210);
  doc.text("SERVICE PROVIDER (TECHNICIAN)", pageWidth / 2 + 10, 210);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(payment.customerName || "Customer", 45, 228);
  doc.text(payment.technicianName || "Technician", pageWidth / 2 + 10, 228);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(payment.customerEmail || "—", 45, 244);
  doc.text(payment.technicianEmail || "—", pageWidth / 2 + 10, 244);

  // Service Line Item Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(45, 275, pageWidth - 90, 32, 6, 6, "F");

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Repair Service", 60, 295);
  doc.text("Amount", pageWidth - 60, 295, { align: "right" });

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(payment.serviceTitle || "Repair Service", 60, 332);
  doc.text(
    `$${Number(payment.amount || 0).toFixed(2)} ${(payment.currency || "usd").toUpperCase()}`,
    pageWidth - 60,
    332,
    { align: "right" }
  );

  doc.line(45, 352, pageWidth - 45, 352);

  // Total Paid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Total Paid", pageWidth - 200, 382);

  doc.setTextColor(5, 150, 105);
  doc.text(
    `$${Number(payment.amount || 0).toFixed(2)} ${(payment.currency || "usd").toUpperCase()}`,
    pageWidth - 60,
    382,
    { align: "right" }
  );

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Thank you for choosing FixMate. This is a system-generated Stripe payment invoice.",
    pageWidth / 2,
    780,
    { align: "center" }
  );

  const safeId = (payment.bookingId || payment.transactionId || "receipt").slice(
    -8
  );
  doc.save(`FixMate-Invoice-${safeId}.pdf`);
};