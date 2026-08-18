import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return errorResponse("লগইন করা নেই।", 401);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return errorResponse("টোকেন অবৈধ বা মেয়াদোত্তীর্ণ।", 401);
    }

    await dbConnect();
    const user = await User.findById(payload.id).select("-password").populate("packageId");

    if (!user) {
      return errorResponse("ইউজার পাওয়া যায়নি।", 404);
    }

    if (user.status !== "active") {
      return errorResponse("অ্যাকাউন্ট নিষ্ক্রিয়।", 403);
    }

    return successResponse("ইউজার তথ্য পাওয়া গেছে।", user);
  } catch (error: any) {
    console.error("❌ Profile API error:", error);
    return errorResponse("সার্ভার ত্রুটি।", 500);
  }
}
