import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
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

    const { searchParams } = new URL(request.url);
    const trending = searchParams.get("trending");
    const seasonal = searchParams.get("seasonal");

    const query: Record<string, unknown> = admin ? {} : { isActive: true };

    if (trending === "true") {
      query.isTrending = true;
    }

    if (seasonal === "true") {
      query.isSeasonal = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return successResponse({
      products,
      total: products.length,
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
    const {
      name,
      price,
      description,
      image,
      isTrending,
      isSeasonal,
      isActive,
    } = body;

    // Validation
    if (!name || !price || !description || !image) {
      return errorResponse("Missing required fields", 400);
    }

    if (typeof price !== "number" || price < 0) {
      return errorResponse("Invalid price", 400);
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      isTrending: isTrending || false,
      isSeasonal: isSeasonal || false,
      isActive: isActive ?? true,
    });

    await product.save();

    return successResponse(
      {
        message: "Product created successfully",
        product,
      },
      201,
    );
  } catch (error) {
    return handleError(error);
  }
}
