import crypto from "crypto";
import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import { getTokenFromRequest, verifyToken } from "@/lib/utils/auth";
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
import { isPincodeServiceable } from "@/lib/utils/serviceable-pincodes";
import { getSiteSettings } from "@/lib/utils/site-settings";

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

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      address,
      couponCode,
    } = await request.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return errorResponse("Missing payment details", 400);
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return errorResponse("Payment verification failed", 400);
    }

    // Validate order data
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

    const siteSettings = await getSiteSettings();
    if (
      !isPincodeServiceable(address.pincode, siteSettings.serviceablePincodes)
    ) {
      return errorResponse(
        "We are not serving your city yet. We will start soon.",
        400,
      );
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
      paymentType: "ONLINE",
      couponCode: couponCode || null,
      discountAmount: pricing.discountAmount,
      status: "CONFIRMED",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
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
        message: "Payment verified and order created",
        order,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
