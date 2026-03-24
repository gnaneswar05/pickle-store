import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
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

    const banners = await Banner.find(admin ? {} : { isActive: true }).sort({
      order: 1,
    });

    return successResponse({
      banners,
      total: banners.length,
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
    const { image, title, isActive } = body;

    // Validation
    if (!image || !title) {
      return errorResponse("Missing required fields", 400);
    }

    // Get the next order number
    const lastBanner = await Banner.findOne().sort({ order: -1 });
    const order = (lastBanner?.order || 0) + 1;

    const banner = new Banner({
      image,
      title,
      isActive: isActive ?? true,
      order,
    });

    await banner.save();

    return successResponse(
      {
        message: "Banner created successfully",
        banner,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
