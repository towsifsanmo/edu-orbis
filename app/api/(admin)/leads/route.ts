import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Lead from "@/models/Lead";
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
    const leads = await Lead.find({}).sort({ date: -1, createdAt: -1 }).lean();
    return successResponse("লিড তালিকা পাওয়া গেছে।", leads);
  } catch (error: any) {
    return errorResponse("লিড ডেটা লোড করতে ব্যর্থ হয়েছে।", 500);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name?.trim()) return errorResponse("নাম প্রদান করুন।");
    if (!email?.trim()) return errorResponse("ইমেইল প্রদান করুন।");
    if (!phone?.trim()) return errorResponse("ফোন নম্বর প্রদান করুন।");
    if (!message?.trim()) return errorResponse("বার্তা প্রদান করুন।");

    const newLead = await Lead.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      status: "New",
      date: new Date(),
    });

    return successResponse("লিড সফলভাবে জমা হয়েছে।", newLead, 201);
  } catch (error: any) {
    return errorResponse("লিড জমা দিতে ব্যর্থ হয়েছে।", 500);
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
      return errorResponse("সঠিক লিড ID প্রদান করুন।", 400);
    }

    const body = await req.json();
    const { status } = body;

    const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return errorResponse("লিড পাওয়া যায়নি।", 404);

    return successResponse("লিড স্ট্যাটাস আপডেট হয়েছে।", updated);
  } catch (error: any) {
    return errorResponse("লিড আপডেট ব্যর্থ হয়েছে।", 500);
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
      return errorResponse("সঠিক লিড ID প্রদান করুন।", 400);
    }

    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return errorResponse("লিড পাওয়া যায়নি।", 404);

    return successResponse("লিড সফলভাবে মুছে ফেলা হয়েছে।", { id });
  } catch (error: any) {
    return errorResponse("মুছতে সমস্যা হয়েছে।", 500);
  }
}
