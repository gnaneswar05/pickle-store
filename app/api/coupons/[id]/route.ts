import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
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

    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const { id } = await params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    return successResponse({ coupon });
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
    const {
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      isActive,
    } = body;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        code: code?.toUpperCase(),
        discountType,
        discountValue,
        expiryDate,
        usageLimit,
        isActive,
      },
      { new: true },
    );

    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    return successResponse({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
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

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return errorResponse("Coupon not found", 404);
    }

    return successResponse({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
