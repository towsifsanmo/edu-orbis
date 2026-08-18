import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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
      return errorResponse(
        "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
        401
      );
    }
    
    if (user.status !== "active") {
      return errorResponse(
        "আপনার অ্যাকাউন্ট বর্তমানে নিষ্ক্রিয় রয়েছে।",
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse(
        "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
        401
      );
    }

    // Login successful
    return successResponse(
      "সফলভাবে লগইন হয়েছে।",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        instituteName: user.instituteName,
        packageId: user.packageId,
        role: user.role,
        status: user.status,
        image: user.image,
      }
    );
  } catch (error) {
    console.error(
      "❌ লগইন করতে সমস্যা হয়েছে:",
      error
    );

    return errorResponse(
      "লগইন করতে একটি সমস্যা হয়েছে।",
      500
    );
  }
}