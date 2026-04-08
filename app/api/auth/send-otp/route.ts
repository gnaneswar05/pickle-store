import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";
import { isProfileComplete } from "@/lib/utils/user-profile";
import { validatePhone } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { phone } = await request.json();

    // Validation
    if (!phone || !validatePhone(phone)) {
      return errorResponse("Invalid phone number", 400);
    }

    // Check if user exists
    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
    }

    // Generate OTP
    const otp = "123456";
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isVerified = false;

    await user.save();

    console.log(`OTP for ${phone}: ${otp}`);

    return successResponse({
      message: "OTP sent successfully",
      phone,
      requiresProfile: !isProfileComplete(user),
    });
  } catch (error) {
    return handleError(error);
  }
}
