import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import { errorResponse, handleError, successResponse } from "@/lib/utils/response";
import { normalizeEmail, validateProfileInput } from "@/lib/utils/user-profile";
import { validatePhone } from "@/lib/utils/validation";

export async function GET(
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
    const user = await User.findById(id);

    if (!user) {
      return errorResponse("Customer not found", 404);
    }

    return successResponse({
      customer: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

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
    const validatedProfile = validateProfileInput(body);
    if ("error" in validatedProfile) {
      return errorResponse(validatedProfile.error || "Validation failed", 400);
    }

    const phone = (body.phone || "").trim();
    if (!validatePhone(phone)) {
      return errorResponse("Invalid phone number", 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse("Customer not found", 404);
    }

    const existingPhoneUser = await User.findOne({
      phone,
      _id: { $ne: user._id },
    });
    if (existingPhoneUser) {
      return errorResponse("Phone number already in use", 400);
    }

    const existingEmailUser = await User.findOne({
      email: normalizeEmail(validatedProfile.email),
      _id: { $ne: user._id },
    });
    if (existingEmailUser) {
      return errorResponse("Email already in use", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name: validatedProfile.name,
          gender: validatedProfile.gender,
          email: validatedProfile.email,
          phone,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return errorResponse("Customer not found", 404);
    }

    return successResponse({
      message: "Customer updated successfully",
      customer: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender,
        phone: updatedUser.phone,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
