import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  handleError,
  successResponse,
} from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.max(Number(searchParams.get("limit") || "10"), 1);

    const total = await User.countDocuments();
    const customers = await User.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const orderStats = await Order.aggregate([
      {
        $match: {
          userId: { $in: customers.map((customer) => String(customer._id)) },
        },
      },
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

    return successResponse({
      customers: customers.map((customer) => {
        const stat = statsMap.get(String(customer._id));
        return {
          _id: String(customer._id),
          phone: customer.phone,
          isVerified: customer.isVerified,
          createdAt: customer.createdAt,
          totalOrders: stat?.totalOrders || 0,
          totalSpent: stat?.totalSpent || 0,
          lastOrderDate: stat?.lastOrderDate || null,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    return handleError(error);
  }
}
