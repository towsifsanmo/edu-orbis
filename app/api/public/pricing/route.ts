import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";

export async function GET() {
  try {
    await dbConnect();
    const plans = await Pricing.find({}).sort({ price: 1 }).lean();
    return successResponse("প্রাইসিং প্ল্যান তালিকা।", plans);
  } catch (error: any) {
    return errorResponse("প্ল্যান ডেটা লোড করতে ব্যর্থ হয়েছে।", 500);
  }
}
