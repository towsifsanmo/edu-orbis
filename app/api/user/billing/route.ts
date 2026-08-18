import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Billing from "@/models/Billing";
import { cookies } from "next/headers";

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function GET() {
  try {
    const authUser = await requireUser();
    if (!authUser) {
      return errorResponse("অননুমোদিত অ্যাক্সেস।", 401);
    }

    await dbConnect();
    // Retrieve only this user's invoices
    const billings = await Billing.find({
      $or: [{ userId: authUser.id }, { userEmail: authUser.email }],
    })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return successResponse("বিলিং ইতিহাস পাওয়া গেছে।", billings);
  } catch (error: any) {
    return errorResponse("বিলিং ইতিহাস লোড করতে সমস্যা হয়েছে।", 500);
  }
}
