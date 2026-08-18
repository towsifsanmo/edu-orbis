import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword) {
      return errorResponse("বর্তমান পাসওয়ার্ড প্রদান করুন।");
    }

    if (!newPassword || newPassword.length < 6) {
      return errorResponse("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return errorResponse("নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।");
    }

    const user = await User.findById(authUser.id).select("+password");
    if (!user) {
      return errorResponse("ব্যবহারকারী অ্যাকাউন্ট পাওয়া যায়নি।", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse("বর্তমান পাসওয়ার্ড সঠিক নয়।", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।");
  } catch (error: any) {
    return errorResponse("পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।", 500);
  }
}
