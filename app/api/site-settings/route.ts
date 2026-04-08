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
        brandTagline: settings.brandTagline,
        logoUrl: settings.logoUrl,
        homeTrendingEyebrow: settings.homeTrendingEyebrow,
        homeTrendingTitle: settings.homeTrendingTitle,
        homeTrendingDescription: settings.homeTrendingDescription,
        homeTrendingButtonLabel: settings.homeTrendingButtonLabel,
        homeSeasonalEyebrow: settings.homeSeasonalEyebrow,
        homeSeasonalTitle: settings.homeSeasonalTitle,
        homeSeasonalDescription: settings.homeSeasonalDescription,
        homeSeasonalButtonLabel: settings.homeSeasonalButtonLabel,
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
        aboutUsTitle: settings.aboutUsTitle,
        aboutUsContent: settings.aboutUsContent,
        aboutUsImage: settings.aboutUsImage,
        termsAndConditions: settings.termsAndConditions,
        privacyPolicy: settings.privacyPolicy,
        refundPolicy: settings.refundPolicy,
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
      brandTagline: body.brandTagline ?? settings.brandTagline,
      logoUrl: body.logoUrl ?? settings.logoUrl,
      homeTrendingEyebrow:
        body.homeTrendingEyebrow ?? settings.homeTrendingEyebrow,
      homeTrendingTitle: body.homeTrendingTitle ?? settings.homeTrendingTitle,
      homeTrendingDescription:
        body.homeTrendingDescription ?? settings.homeTrendingDescription,
      homeTrendingButtonLabel:
        body.homeTrendingButtonLabel ?? settings.homeTrendingButtonLabel,
      homeSeasonalEyebrow:
        body.homeSeasonalEyebrow ?? settings.homeSeasonalEyebrow,
      homeSeasonalTitle: body.homeSeasonalTitle ?? settings.homeSeasonalTitle,
      homeSeasonalDescription:
        body.homeSeasonalDescription ?? settings.homeSeasonalDescription,
      homeSeasonalButtonLabel:
        body.homeSeasonalButtonLabel ?? settings.homeSeasonalButtonLabel,
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
      aboutUsTitle: body.aboutUsTitle ?? settings.aboutUsTitle,
      aboutUsContent: body.aboutUsContent ?? settings.aboutUsContent,
      aboutUsImage: body.aboutUsImage ?? settings.aboutUsImage,
      termsAndConditions: body.termsAndConditions ?? settings.termsAndConditions,
      privacyPolicy: body.privacyPolicy ?? settings.privacyPolicy,
      refundPolicy: body.refundPolicy ?? settings.refundPolicy,
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
