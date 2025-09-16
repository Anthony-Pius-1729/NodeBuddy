import { NextRequest, NextResponse } from "next/server";
import { comparePassword, generateToken, isValidEmail } from "@/lib/auth";
import { AuthRequest, ApiResponse, AuthResponse } from "@/lib/types/auth";
import { findUserByEmail } from "@/lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<AuthResponse>>({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
