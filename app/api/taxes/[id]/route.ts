import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  handleError,
  successResponse,
} from "@/lib/utils/response";
import { getTaxSettings } from "@/lib/utils/pricing";

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
    const { name, rate, isActive } = body;

    if (!name || rate === undefined || Number(rate) < 0) {
      return errorResponse("Invalid tax details", 400);
    }

    const settings = await getTaxSettings();
    const tax = settings.taxes.id(id);

    if (!tax) {
      return errorResponse("Tax not found", 404);
    }

    tax.set({
      name: String(name).trim(),
      rate: Number(rate),
      isActive: isActive ?? true,
    });

    await settings.save();

    return successResponse({
      message: "Tax updated successfully",
      taxes: settings.taxes,
      deliveryCharge: settings.deliveryCharge,
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
    const settings = await getTaxSettings();
    const tax = settings.taxes.id(id);

    if (!tax) {
      return errorResponse("Tax not found", 404);
    }

    tax.deleteOne();
    await settings.save();

    return successResponse({
      message: "Tax deleted successfully",
      taxes: settings.taxes,
      deliveryCharge: settings.deliveryCharge,
    });
  } catch (error) {
    return handleError(error);
  }
}
