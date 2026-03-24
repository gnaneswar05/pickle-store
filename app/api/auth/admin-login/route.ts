import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";
import { validateEmail } from "@/lib/utils/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !validateEmail(email)) {
      return errorResponse("Invalid email", 400);
    }

    if (!password || password.length < 6) {
      return errorResponse("Invalid password", 400);
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isActive) {
      return errorResponse("Invalid credentials", 401);
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse("Invalid credentials", 401);
    }

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET || "kanvi-secret-key",
      { expiresIn: "7d" },
    );

    return successResponse({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
