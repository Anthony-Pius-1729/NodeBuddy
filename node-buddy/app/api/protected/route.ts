import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types/auth";

export async function GET(request: NextRequest) {
  try {
    // Extract user info from headers (set by middleware)
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");
    const userName = request.headers.get("x-user-name");

    if (!userId || !userEmail || !userName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: "This is a protected route",
        user: {
          id: userId,
          email: userEmail,
          name: userName,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Protected route error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract user info from headers (set by middleware)
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");
    const userName = request.headers.get("x-user-name");

    if (!userId || !userEmail || !userName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: "Data received successfully",
        user: {
          id: userId,
          email: userEmail,
          name: userName,
        },
        receivedData: body,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Protected route error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
