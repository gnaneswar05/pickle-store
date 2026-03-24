import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function successResponse(data: unknown, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode },
  );
}

export function errorResponse(message: string, statusCode = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: statusCode },
  );
}

export function handleError(error: unknown) {
  if (error instanceof APIError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("Internal server error", 500);
}
