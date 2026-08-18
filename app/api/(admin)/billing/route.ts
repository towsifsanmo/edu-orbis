import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Billing from "@/models/Billing";
import mongoose from "mongoose";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const billings = await Billing.find({}).sort({ date: -1, createdAt: -1 }).lean();
    return successResponse("বিলিং তালিকা পাওয়া গেছে।", billings);
  } catch (error: any) {
    return errorResponse("বিলিং লোড করতে সমস্যা হয়েছে।", 500);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const body = await req.json();
    const {
      invoiceNo,
      userName,
      userEmail,
      packageName,
      amount,
      billingMethod = "SSLCommerz",
      status = "Paid",
      date,
    } = body;

    if (!userName?.trim()) return errorResponse("ইউজারের নাম প্রদান করুন।");
    if (!packageName?.trim()) return errorResponse("প্যাকেজের নাম প্রদান করুন।");
    if (!amount || isNaN(Number(amount))) return errorResponse("সঠিক মূল্য প্রদান করুন।");

    const invNo =
      invoiceNo?.trim() ||
      `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newBilling = await Billing.create({
      invoiceNo: invNo,
      userName: userName.trim(),
      userEmail: userEmail?.trim() || "user@school.com",
      packageName: packageName.trim(),
      amount: Number(amount),
      billingMethod,
      status: status || "Paid",
      date: date ? new Date(date) : new Date(),
    });

    return successResponse("ইনভয়েস সফলভাবে তৈরি হয়েছে।", newBilling, 201);
  } catch (error: any) {
    return errorResponse(`ইনভয়েস তৈরিতে ত্রুটি: ${error.message}`, 500);
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("সঠিক ইনভয়েস ID প্রদান করুন।", 400);
    }

    const body = await req.json();
    const { status, billingMethod, amount } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (billingMethod) updateData.billingMethod = billingMethod;
    if (amount !== undefined) updateData.amount = Number(amount);

    const updated = await Billing.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return errorResponse("ইনভয়েস পাওয়া যায়নি।", 404);

    return successResponse("ইনভয়েস স্ট্যাটাস আপডেট হয়েছে।", updated);
  } catch (error: any) {
    return errorResponse("আপডেট ব্যর্থ হয়েছে।", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse("সঠিক ইনভয়েস ID প্রদান করুন।", 400);
    }

    const deleted = await Billing.findByIdAndDelete(id);
    if (!deleted) return errorResponse("ইনভয়েস পাওয়া যায়নি।", 404);

    return successResponse("ইনভয়েস মুছে ফেলা হয়েছে।", { id });
  } catch (error: any) {
    return errorResponse("মুছতে সমস্যা হয়েছে।", 500);
  }
}
