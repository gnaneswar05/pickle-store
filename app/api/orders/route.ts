import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
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
import { validatePhone, validatePincode } from "@/lib/utils/validation";
import {
  buildInvoiceNumber,
  calculatePricingBreakdown,
  getTaxSettings,
} from "@/lib/utils/pricing";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const admin = await verifyAdminFromRequest(request);
    if (admin) {
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      return successResponse({
        orders,
        total: orders.length,
      });
    }

    const token = getTokenFromRequest(request);
    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse("Invalid token", 401);
    }

    const orders = await Order.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    return successResponse({
      orders,
      total: orders.length,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(request);
    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse("Invalid token", 401);
    }

    const body = await request.json();
    const { items, address, paymentType, couponCode } = body;

    // Validation
    if (!items || items.length === 0) {
      return errorResponse("No items in order", 400);
    }

    if (
      !address ||
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.pincode
    ) {
      return errorResponse("Invalid address", 400);
    }

    if (!validatePhone(address.phone)) {
      return errorResponse("Invalid phone number", 400);
    }

    if (!validatePincode(address.pincode)) {
      return errorResponse("Invalid pincode", 400);
    }

    if (!paymentType || !["COD", "ONLINE"].includes(paymentType)) {
      return errorResponse("Invalid payment type", 400);
    }

    const subtotalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (!coupon) {
        return errorResponse("Invalid or expired coupon", 400);
      }

      if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
        return errorResponse("Coupon usage limit exceeded", 400);
      }

      discountAmount =
        coupon.discountType === "PERCENTAGE"
          ? (subtotalAmount * coupon.discountValue) / 100
          : coupon.discountValue;
      discountAmount = Math.min(discountAmount, subtotalAmount);
    }

    const taxSettings = await getTaxSettings();
    const pricing = calculatePricingBreakdown({
      items,
      discountAmount,
      taxes: taxSettings.taxes,
      deliveryCharge: taxSettings.deliveryCharge,
    });

    // Check COD eligibility
    if (paymentType === "COD" && pricing.totalAmount >= 250) {
      return errorResponse("COD not available for orders above 250", 400);
    }

    const order = new Order({
      userId: decoded.userId,
      items,
      invoiceNumber: "",
      subtotalAmount: pricing.subtotalAmount,
      taxableAmount: pricing.taxableAmount,
      taxes: pricing.taxes,
      totalTaxAmount: pricing.totalTaxAmount,
      deliveryCharge: pricing.deliveryCharge,
      totalAmount: pricing.totalAmount,
      address,
      paymentType,
      couponCode: couponCode || null,
      discountAmount: pricing.discountAmount,
      status: "PENDING",
    });
    order.invoiceNumber = buildInvoiceNumber(order._id.toString());

    await order.save();

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usageCount: 1 } },
      );
    }

    return successResponse(
      {
        message: "Order placed successfully",
        order,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
