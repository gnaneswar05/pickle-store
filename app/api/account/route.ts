import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/utils/auth";
import { errorResponse, handleError, successResponse } from "@/lib/utils/response";
import { normalizeEmail, validateProfileInput } from "@/lib/utils/user-profile";
import { validatePhone } from "@/lib/utils/validation";

export async function GET(request: NextRequest) {
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse({
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        gender: user.gender,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
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
    const validatedProfile = validateProfileInput(body);
    if ("error" in validatedProfile) {
      return errorResponse(validatedProfile.error || "Validation failed", 400);
    }

    const phone = (body.phone || "").trim();
    if (!validatePhone(phone)) {
      return errorResponse("Invalid phone number", 400);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse("User not found", 404);
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
          phone,
          name: validatedProfile.name,
          gender: validatedProfile.gender,
          email: validatedProfile.email,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return successResponse({
      message: "Account updated successfully",
      user: {
        id: updatedUser._id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        gender: updatedUser.gender,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
