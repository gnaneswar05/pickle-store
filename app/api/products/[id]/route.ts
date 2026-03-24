import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import { verifyAdminFromRequest } from "@/lib/utils/auth";
import {
  errorResponse,
  successResponse,
  handleError,
} from "@/lib/utils/response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    const admin = await verifyAdminFromRequest(request);
    if (!admin && !product.isActive) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ product });
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
    const {
      name,
      price,
      description,
      image,
      isTrending,
      isSeasonal,
      isActive,
    } = body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        image,
        isTrending,
        isSeasonal,
        isActive,
      },
      { new: true },
    );

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({
      message: "Product updated successfully",
      product,
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
