import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import { errorResponse, handleError } from "@/lib/utils/response";

function escapeCsv(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = await verifyAdminFromRequest(request);

    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const header = [
      "Invoice Number",
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Shipping Address",
      "Items",
      "Subtotal",
      "Discount",
      "Tax",
      "Delivery Charge",
      "Grand Total",
      "Payment Type",
      "Status",
    ];

    const rows = orders.map((order) =>
      [
        order.invoiceNumber,
        order._id,
        new Date(order.createdAt).toISOString(),
        order.address?.name,
        order.address?.phone,
        `${order.address?.address || ""} ${order.address?.pincode || ""}`.trim(),
        order.items
          ?.map(
            (item: { name: string; quantity: number; price: number }) =>
              `${item.name} x${item.quantity} @ ${item.price}`,
          )
          .join(" | "),
        order.subtotalAmount,
        order.discountAmount,
        order.totalTaxAmount,
        order.deliveryCharge,
        order.totalAmount,
        order.paymentType,
        order.status,
      ]
        .map(escapeCsv)
        .join(","),
    );

    const csv = [header.map(escapeCsv).join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export.csv"`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
