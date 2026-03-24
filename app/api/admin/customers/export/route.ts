import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import { errorResponse, handleError } from "@/lib/utils/response";

function escapeCsv(value: string | number | boolean | null | undefined) {
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

    const customers = await User.find().sort({ createdAt: -1 }).lean();
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    const statsMap = new Map(orderStats.map((stat) => [stat._id, stat]));

    const header = [
      "Customer ID",
      "Mobile Number",
      "Verified",
      "Joined On",
      "Total Orders",
      "Total Spent",
      "Last Order Date",
    ];

    const rows = customers.map((customer) => {
      const stat = statsMap.get(String(customer._id));
      return [
        String(customer._id),
        customer.phone,
        customer.isVerified,
        new Date(customer.createdAt).toISOString(),
        stat?.totalOrders || 0,
        stat?.totalSpent || 0,
        stat?.lastOrderDate
          ? new Date(stat.lastOrderDate).toISOString()
          : "",
      ]
        .map(escapeCsv)
        .join(",");
    });

    const csv = [header.map(escapeCsv).join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="customers-export.csv"',
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
