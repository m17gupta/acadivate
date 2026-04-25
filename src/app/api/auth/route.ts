import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/src/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('kalp_tenant_acadivate');
    const users = db.collection("users");

    // Check both userName and email for flexible login
    const user = await users.findOne({ 
      $or: [
        { userName: userName },
        { email: userName }
      ]
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Basic password check (Note: Recommend using bcrypt for production)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return success (excluding sensitive data)
    console.log("useess", user)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "Login successful",
      user: {
        userId: userWithoutPassword._id,
        userName: userWithoutPassword.userName,
        role: userWithoutPassword.role,
      },
      status: 200,
  
    });

  } catch (error: any) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
