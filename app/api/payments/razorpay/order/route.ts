import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";
import { calculatePricingBreakdown, getTaxSettings } from "@/lib/utils/pricing";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const publicKeyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return errorResponse("Razorpay server keys are missing", 500);
    }

    if (!publicKeyId) {
      return errorResponse("Razorpay public key is missing", 500);
    }

    const { items, couponCode } = await request.json();

    if (!items || items.length === 0) {
      return errorResponse("No items in order", 400);
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

    if (pricing.totalAmount <= 0) {
      return errorResponse("Invalid amount", 400);
    }

    const options = {
      amount: Math.round(pricing.totalAmount * 100), // convert to paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return successResponse({
      razorpayOrder: order,
      keyId: publicKeyId,
      pricing,
    });
  } catch (error) {
    return handleError(error);
  }
}
