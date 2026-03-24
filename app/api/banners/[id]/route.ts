import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/lib/models/Banner";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";

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
    const { image, title, isActive, order } = body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        image,
        title,
        isActive,
        order,
      },
      { new: true },
    );

    if (!banner) {
      return errorResponse("Banner not found", 404);
    }

    return successResponse({
      message: "Banner updated successfully",
      banner,
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

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return errorResponse("Banner not found", 404);
    }

    return successResponse({
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
