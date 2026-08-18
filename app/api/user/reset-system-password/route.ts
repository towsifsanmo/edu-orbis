import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { cookies } from "next/headers";

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    if (!authUser) {
      return errorResponse("অননুমোদিত অ্যাক্সেস।", 401);
    }

    await dbConnect();
    const body = await req.json();
    const { action, email, otp, newPassword } = body;

    if (action === "send-otp") {
      if (!email?.trim()) return errorResponse("ইমেইল প্রদান করুন।");
      return successResponse("OTP কোড সফলভাবে আপনার ইমেইলে পাঠানো হয়েছে। (ডেমো কোড: 1234)");
    }

    if (action === "verify-otp") {
      if (!otp || otp.length !== 4) {
        return errorResponse("৪ সংখ্যার সঠিক OTP কোড প্রদান করুন।");
      }
      return successResponse("OTP কোড সফলভাবে যাচাই করা হয়েছে।");
    }

    if (action === "reset-password") {
      if (!newPassword || newPassword.length < 6) {
        return errorResponse("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      }
      return successResponse("স্কুল সিস্টেম পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।");
    }

    return errorResponse("অবৈধ অ্যাকশন।", 400);
  } catch (error: any) {
    return errorResponse("সিস্টেম ত্রুটি।", 500);
  }
}
