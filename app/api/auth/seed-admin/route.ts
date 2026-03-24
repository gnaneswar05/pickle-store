import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import {
  successResponse,
  errorResponse,
  handleError,
} from "@/lib/utils/response";

export async function POST() {
  try {
    await connectDB();

    if (process.env.NODE_ENV === "production") {
      return errorResponse("Seed endpoint not allowed in production", 403);
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return errorResponse(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local",
        500,
      );
    }

    const existingAdmin = await Admin.findOne({
      email: adminEmail.toLowerCase().trim(),
    });

    if (existingAdmin) {
      return successResponse({
        message: "Admin already exists",
        admin: { email: existingAdmin.email, name: existingAdmin.name },
      });
    }

    const newAdmin = new Admin({
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      name: "Kanvi Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    });

    await newAdmin.save();

    return successResponse({
      message: "Admin user seeded successfully",
      admin: { email: newAdmin.email, name: newAdmin.name },
    });
  } catch (error) {
    return handleError(error);
  }
}
