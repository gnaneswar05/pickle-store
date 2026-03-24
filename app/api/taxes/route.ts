import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  handleError,
  successResponse,
} from "@/lib/utils/response";
import { getTaxSettings } from "@/lib/utils/pricing";
import type { ITaxRate } from "@/lib/models/TaxSetting";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const settings = await getTaxSettings();
    const admin = await verifyAdminFromRequest(request);
    const activeTaxes = settings.taxes.filter(
      (tax: ITaxRate) => tax.isActive,
    );

    return successResponse({
      taxes: admin ? settings.taxes : activeTaxes,
      deliveryCharge: settings.deliveryCharge,
      codLimit: settings.codLimit,
    });
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
    const { name, rate, isActive } = body;

    if (!name || rate === undefined) {
      return errorResponse("Missing required fields", 400);
    }

    if (Number(rate) < 0) {
      return errorResponse("Invalid tax rate", 400);
    }

    const settings = await getTaxSettings();
    settings.taxes.push({
      name: String(name).trim(),
      rate: Number(rate),
      isActive: isActive ?? true,
    });
    await settings.save();

    return successResponse(
      {
        message: "Tax added successfully",
        taxes: settings.taxes,
        deliveryCharge: settings.deliveryCharge,
        codLimit: settings.codLimit,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { deliveryCharge, codLimit } = body;

    if (
      deliveryCharge !== undefined &&
      Number.isNaN(Number(deliveryCharge))
    ) {
      return errorResponse("Invalid delivery charge", 400);
    }

    if (deliveryCharge !== undefined && Number(deliveryCharge) < 0) {
      return errorResponse("Invalid delivery charge", 400);
    }

    if (codLimit !== undefined && Number.isNaN(Number(codLimit))) {
      return errorResponse("Invalid COD limit", 400);
    }

    if (codLimit !== undefined && Number(codLimit) < 0) {
      return errorResponse("Invalid COD limit", 400);
    }

    const settings = await getTaxSettings();
    if (deliveryCharge !== undefined) {
      settings.deliveryCharge = Number(deliveryCharge);
    }
    if (codLimit !== undefined) {
      settings.codLimit = Number(codLimit);
    }
    await settings.save();

    return successResponse({
      message: "Settings updated successfully",
      taxes: settings.taxes,
      deliveryCharge: settings.deliveryCharge,
      codLimit: settings.codLimit,
    });
  } catch (error) {
    return handleError(error);
  }
}
