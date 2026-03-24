import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import {
  getTokenFromRequest,
  verifyAdminFromRequest,
  verifyToken,
} from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const admin = await verifyAdminFromRequest(request);

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    if (!admin) {
      const token = getTokenFromRequest(request);
      if (!token) {
        return errorResponse("Unauthorized", 401);
      }

      const decoded = verifyToken(token);
      if (!decoded || decoded.userId !== order.userId) {
        return errorResponse("Unauthorized", 401);
      }
    }

    return successResponse({ order });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }
    const { id } = await params;

    const body = await request.json();
    const { status, shipperName } = body;

    if (
      !status ||
      !["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED"].includes(
        status,
      )
    ) {
      return errorResponse("Invalid status", 400);
    }

    if (status === "SHIPPED" && !shipperName?.trim()) {
      return errorResponse("Shipper name is required", 400);
    }

    const updateData: {
      status: string;
      shipperName?: string;
      shippedAt?: Date;
    } = {
      status,
    };

    if (status === "SHIPPED") {
      updateData.shipperName = shipperName.trim();
      updateData.shippedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!order) {
      return errorResponse("Order not found", 404);
    }

    return successResponse({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    return handleError(error);
  }
}
