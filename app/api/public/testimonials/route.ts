import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
    return successResponse("টেস্টিমোনিয়াল তালিকা।", testimonials);
  } catch (error: any) {
    return errorResponse("টেস্টিমোনিয়াল ডেটা লোড করতে ব্যর্থ হয়েছে।", 500);
  }
}
