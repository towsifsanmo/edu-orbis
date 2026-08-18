import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import User from "@/models/User";
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
      return errorResponse("অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।", 401);
    }

    await dbConnect();
    const user = await User.findById(authUser.id)
      .select("-password")
      .populate("packageId")
      .lean();

    if (!user) {
      return errorResponse("ব্যবহারকারী অ্যাকাউন্ট পাওয়া যায়নি।", 404);
    }

    // Default package fallback if not set
    let packageInfo: any = user.packageId;
    if (!packageInfo) {
      packageInfo = await Pricing.findOne().lean();
    }

    const overviewData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        instituteName: user.instituteName,
        role: user.role,
        status: user.status,
        image: user.image,
        createdAt: user.createdAt,
      },
      activePlan: {
        id: packageInfo?._id,
        name: packageInfo?.name || "প্রফেশনাল প্ল্যান",
        status: user.status === "active" ? "Active" : "Inactive",
        price: packageInfo?.discountPrice || packageInfo?.price || 2400,
        billingCycle: packageInfo?.billingType?.includes("মাসিক") ? "মাসিক" : "বার্ষিক",
        features: packageInfo?.features || [],
        usage: {
          students: { current: 1850, limit: 2000 },
          sms: { current: 4500, limit: 5000 },
        },
      },
      systemCredentials: {
        portalUrl: "https://edusaas.pro/school-portal",
        systemId: `EDU-${user.mobile?.slice(-4) || "2026"}`,
        username: user.email,
      },
    };

    return successResponse("ড্যাশবোর্ড ওভারভিউ লোড হয়েছে।", overviewData);
  } catch (error: any) {
    console.error("User overview error:", error);
    return errorResponse("ড্যাশবোর্ড তথ্য লোড করতে সমস্যা হয়েছে।", 500);
  }
}
