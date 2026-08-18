import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import User from "@/models/User";
import { cookies } from "next/headers";

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function PUT(req: Request) {
  try {
    const authUser = await requireUser();
    if (!authUser) {
      return errorResponse("অননুমোদিত অ্যাক্সেস।", 401);
    }

    await dbConnect();
    const body = await req.json();
    const { name, mobile, instituteName, image } = body;

    const updateData: any = {};
    if (name?.trim()) updateData.name = name.trim();
    if (mobile?.trim()) updateData.mobile = mobile.trim();
    if (instituteName?.trim()) updateData.instituteName = instituteName.trim();
    if (image?.trim()) updateData.image = image.trim();

    const updatedUser = await User.findByIdAndUpdate(authUser.id, updateData, {
      new: true,
    })
      .select("-password")
      .populate("packageId")
      .lean();

    if (!updatedUser) {
      return errorResponse("ইউজার পাওয়া যায়নি।", 404);
    }

    return successResponse("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে।", updatedUser);
  } catch (error: any) {
    return errorResponse("প্রোফাইল আপডেট করতে সমস্যা হয়েছে।", 500);
  }
}
