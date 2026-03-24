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
import { isPincodeServiceable } from "@/lib/utils/serviceable-pincodes";
import { getSiteSettings } from "@/lib/utils/site-settings";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.max(Number(searchParams.get("limit") || "10"), 1);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const admin = await verifyAdminFromRequest(request);
    if (admin) {
      const query: {
        status?: string;
        $or?: Array<Record<string, { $regex: string; $options: string }>>;
      } = {};

      if (status && status !== "ALL") {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { invoiceNumber: { $regex: search, $options: "i" } },
          { "address.name": { $regex: search, $options: "i" } },
          { "address.phone": { $regex: search, $options: "i" } },
          { shipperName: { $regex: search, $options: "i" } },
        ];
      }

      const total = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit);

      return successResponse({
        orders,
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
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

    const userQuery = { userId: decoded.userId };
    const total = await Order.countDocuments(userQuery);
    const orders = await Order.find(userQuery)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return successResponse({
      orders,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
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

    const siteSettings = await getSiteSettings();
    if (
      !isPincodeServiceable(address.pincode, siteSettings.serviceablePincodes)
    ) {
      return errorResponse(
        "We are not serving your city yet. We will start soon.",
        400,
      );
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
    if (paymentType === "COD" && pricing.totalAmount >= taxSettings.codLimit) {
      return errorResponse(
        `COD not available for orders above ${taxSettings.codLimit}`,
        400,
      );
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
