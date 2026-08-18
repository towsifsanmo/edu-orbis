import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Billing from "@/models/Billing";
import Pricing from "@/models/Pricing";
import User from "@/models/User";
import mongoose from "mongoose";
import { cookies } from "next/headers";

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function GET() {
  try {
    await dbConnect();
    const plans = await Pricing.find({}).sort({ price: 1 }).lean();
    return successResponse("প্রাইসিং প্ল্যান লোড হয়েছে।", plans);
  } catch (error: any) {
    return errorResponse("প্ল্যান লোড করতে সমস্যা হয়েছে।", 500);
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await requireUser();
    if (!authUser) {
      return errorResponse("অননুমোদিত অ্যাক্সেস।", 401);
    }

    await dbConnect();
    const body = await req.json();
    const { packageId, billingMethod = "SSLCommerz (bKash)" } = body;

    if (!packageId || !mongoose.Types.ObjectId.isValid(packageId)) {
      return errorResponse("সঠিক প্যাকেজ নির্বাচন করুন।");
    }

    const selectedPackage = await Pricing.findById(packageId);
    if (!selectedPackage) {
      return errorResponse("নির্বাচিত প্যাকেজটি পাওয়া যায়নি।", 404);
    }

    const user = await User.findById(authUser.id);
    if (!user) {
      return errorResponse("ইউজার অ্যাকাউন্ট পাওয়া যায়নি।", 404);
    }

    user.packageId = selectedPackage._id;
    await user.save();

    // Create an invoice record
    const amount = selectedPackage.discountPrice || selectedPackage.price;
    const invNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newInvoice = await Billing.create({
      invoiceNo: invNo,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      packageId: selectedPackage._id,
      packageName: selectedPackage.name,
      amount,
      billingMethod,
      status: "Paid",
      date: new Date(),
    });

    return successResponse("প্যাকেজ সফলভাবে আপগ্রেড করা হয়েছে।", {
      package: selectedPackage,
      invoice: newInvoice,
    });
  } catch (error: any) {
    return errorResponse("প্যাকেজ আপগ্রেড ব্যর্থ হয়েছে।", 500);
  }
}
