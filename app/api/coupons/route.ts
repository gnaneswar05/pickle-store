import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = await verifyAdminFromRequest(request);

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (!coupon) {
        return errorResponse("Invalid or expired coupon", 404);
      }

      // Check usage limit
      if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
        return errorResponse("Coupon usage limit exceeded", 400);
      }

      return successResponse({ coupon });
    }

    const coupons = await Coupon.find(admin ? {} : { isActive: true }).sort({
      createdAt: -1,
    });
    return successResponse({ coupons });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      isActive,
    } = body;

    // Validation
    if (!code || !discountType || discountValue === undefined) {
      return errorResponse("Missing required fields", 400);
    }

    if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
      return errorResponse("Invalid discount type", 400);
    }

    if (discountValue < 0) {
      return errorResponse("Invalid discount value", 400);
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit || 0,
      isActive: isActive ?? true,
    });

    await coupon.save();

    return successResponse(
      {
        message: "Coupon created successfully",
        coupon,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
