import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";
import { validatePhone } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { phone, otp } = await request.json();

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

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    return successResponse({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        phone: user.phone,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
