import { dbConnect } from "@/lib/db";
import { errorResponse } from "@/lib/response";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, signJWT } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { email, password } = body;

    if (!email || !email.trim()) {
      return errorResponse("ইমেইল প্রদান করুন।", 400);
    }

    if (!password) {
      return errorResponse("পাসওয়ার্ড প্রদান করুন।", 400);
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return errorResponse("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।", 401);
    }

    if (user.status !== "active") {
      return errorResponse(
        "আপনার অ্যাকাউন্ট বর্তমানে নিষ্ক্রিয় রয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।",
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।", 401);
    }

    // Generate JWT token
    const token = await signJWT({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      instituteName: user.instituteName,
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      instituteName: user.instituteName,
      packageId: user.packageId,
      role: user.role,
      status: user.status,
      image: user.image,
    };

    // Create JSON response
    const response = NextResponse.json(
      {
        success: true,
        message: "সফলভাবে লগইন হয়েছে।",
        data: userData,
      },
      { status: 200 }
    );

    // Set secure HttpOnly cookie
    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("❌ লগইন করতে সমস্যা হয়েছে:", error);

    return errorResponse("লগইন করতে একটি সমস্যা হয়েছে।", 500);
  }
}