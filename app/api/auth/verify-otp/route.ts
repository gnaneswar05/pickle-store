import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";
import {
  isProfileComplete,
  validateProfileInput,
} from "@/lib/utils/user-profile";
import { validatePhone } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { phone, otp, name, gender, email } = await request.json();

    // Validation
    if (!phone || !validatePhone(phone)) {
      return errorResponse("Invalid phone number", 400);
    }

    if (!otp || otp.length !== 6) {
      return errorResponse("Invalid OTP", 400);
    }

    // Find user
    const user = await User.findOne({ phone });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Check OTP expiry
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return errorResponse("OTP expired", 400);
    }

    // Verify OTP
    if (user.otp !== otp) {
      return errorResponse("Invalid OTP", 400);
    }

    const updatePayload: {
      isVerified: boolean;
      otp: null;
      otpExpiry: null;
      name?: string;
      gender?: "male" | "female" | "other";
      email?: string;
    } = {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    };

    if (!isProfileComplete(user)) {
      const validatedProfile = validateProfileInput({ name, gender, email });

      if ("error" in validatedProfile) {
        return errorResponse(validatedProfile.error, 400);
      }

      const existingEmailUser = await User.findOne({
        email: validatedProfile.email,
        _id: { $ne: user._id },
      });

      if (existingEmailUser) {
        return errorResponse("Email already in use", 400);
      }

      updatePayload.name = validatedProfile.name;
      updatePayload.gender = validatedProfile.gender;
      updatePayload.email = validatedProfile.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    // Generate JWT token
    const token = generateToken(updatedUser._id.toString());

    return successResponse({
      message: "Login successful",
      token,
      user: {
        id: updatedUser._id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        gender: updatedUser.gender,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
