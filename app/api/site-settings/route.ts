import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  APIError,
  errorResponse,
  handleError,
  successResponse,
} from "@/lib/utils/response";
import { parseServiceablePincodes } from "@/lib/utils/serviceable-pincodes";
import { getSiteSettings } from "@/lib/utils/site-settings";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const settings = await getSiteSettings();
    const admin = await verifyAdminFromRequest(request);

    if (!admin) {
      return successResponse({
        brandName: settings.brandName,
        logoUrl: settings.logoUrl,
        manufacturerName: settings.manufacturerName,
        manufacturerPhone: settings.manufacturerPhone,
        manufacturerEmail: settings.manufacturerEmail,
        manufacturerGstin: settings.manufacturerGstin,
        manufacturerAddressLine1: settings.manufacturerAddressLine1,
        manufacturerAddressLine2: settings.manufacturerAddressLine2,
        manufacturerCity: settings.manufacturerCity,
        manufacturerState: settings.manufacturerState,
        manufacturerPincode: settings.manufacturerPincode,
        serviceablePincodes: settings.serviceablePincodes,
      });
    }

    return successResponse({ settings });
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
    const settings = await getSiteSettings();
    let serviceablePincodes = settings.serviceablePincodes;
    if (body.serviceablePincodes !== undefined) {
      try {
        serviceablePincodes = parseServiceablePincodes(body.serviceablePincodes);
      } catch (error) {
        throw new APIError(
          400,
          error instanceof Error ? error.message : "Invalid serviceable pincodes",
        );
      }
    }

    settings.set({
      brandName: body.brandName ?? settings.brandName,
      logoUrl: body.logoUrl ?? settings.logoUrl,
      manufacturerName: body.manufacturerName ?? settings.manufacturerName,
      manufacturerPhone: body.manufacturerPhone ?? settings.manufacturerPhone,
      manufacturerEmail: body.manufacturerEmail ?? settings.manufacturerEmail,
      manufacturerGstin: body.manufacturerGstin ?? settings.manufacturerGstin,
      manufacturerAddressLine1:
        body.manufacturerAddressLine1 ?? settings.manufacturerAddressLine1,
      manufacturerAddressLine2:
        body.manufacturerAddressLine2 ?? settings.manufacturerAddressLine2,
      manufacturerCity: body.manufacturerCity ?? settings.manufacturerCity,
      manufacturerState: body.manufacturerState ?? settings.manufacturerState,
      manufacturerPincode:
        body.manufacturerPincode ?? settings.manufacturerPincode,
      serviceablePincodes,
    });

    await settings.save();

    return successResponse({
      message: "Site settings updated successfully",
      settings,
    });
  } catch (error) {
    return handleError(error);
  }
}
