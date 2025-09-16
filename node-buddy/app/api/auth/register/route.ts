import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  hashPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
} from "@/lib/auth";
import {
  RegisterRequest,
  User,
  ApiResponse,
  AuthResponse,
} from "@/lib/types/auth";
import { addUser, findUserByEmail } from "@/lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email, password, and name are required",
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

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: passwordValidation.message,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save user (in production, save to database)
    addUser(user);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse<AuthResponse>>(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
