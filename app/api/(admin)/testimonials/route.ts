import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Testimonial from "@/models/Testimonial";
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
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
    return successResponse("টেস্টিমোনিয়াল তালিকা পাওয়া গেছে।", testimonials);
  } catch (error: any) {
    return errorResponse("টেস্টিমোনিয়াল লোড করতে সমস্যা হয়েছে।", 500);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const body = await req.json();
    const { author, role, instituteName, quote, image, rating = 5 } = body;

    if (!author?.trim()) return errorResponse("লেখকের নাম প্রদান করুন।");
    if (!role?.trim()) return errorResponse("পদবি প্রদান করুন।");
    if (!quote?.trim()) return errorResponse("মন্তব্য প্রদান করুন।");

    const newTestimonial = await Testimonial.create({
      author: author.trim(),
      role: role.trim(),
      instituteName: instituteName?.trim() || "",
      quote: quote.trim(),
      image: image?.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(author)}`,
      rating: Number(rating) || 5,
    });

    return successResponse("টেস্টিমোনিয়াল সফলভাবে যুক্ত হয়েছে।", newTestimonial, 201);
  } catch (error: any) {
    return errorResponse("টেস্টিমোনিয়াল তৈরিতে সমস্যা হয়েছে।", 500);
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
      return errorResponse("সঠিক টেস্টিমোনিয়াল ID প্রদান করুন।", 400);
    }

    const body = await req.json();
    const { author, role, instituteName, quote, image, rating } = body;

    const updateData: any = {};
    if (author?.trim()) updateData.author = author.trim();
    if (role?.trim()) updateData.role = role.trim();
    if (instituteName !== undefined) updateData.instituteName = instituteName.trim();
    if (quote?.trim()) updateData.quote = quote.trim();
    if (image?.trim()) updateData.image = image.trim();
    if (rating !== undefined) updateData.rating = Number(rating);

    const updated = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return errorResponse("টেস্টিমোনিয়াল পাওয়া যায়নি।", 404);

    return successResponse("টেস্টিমোনিয়াল আপডেট হয়েছে।", updated);
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
      return errorResponse("সঠিক টেস্টিমোনিয়াল ID প্রদান করুন।", 400);
    }

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return errorResponse("টেস্টিমোনিয়াল পাওয়া যায়নি।", 404);

    return successResponse("টেস্টিমোনিয়াল মুছে ফেলা হয়েছে।", { id });
  } catch (error: any) {
    return errorResponse("মুছতে ব্যর্থ হয়েছে।", 500);
  }
}
