import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import mongoose from "mongoose";

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return errorResponse(
        "প্রাইসিং প্ল্যানের ID প্রদান করুন।",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(
        "সঠিক প্রাইসিং প্ল্যানের ID প্রদান করুন।",
        400
      );
    }

    const pricing = await Pricing.findById(id);

    if (!pricing) {
      return errorResponse(
        "প্রাইসিং প্ল্যানটি খুঁজে পাওয়া যায়নি।",
        404
      );
    }

    await Pricing.findByIdAndDelete(id);
    return successResponse(
      "প্রাইসিং প্ল্যান সফলভাবে মুছে ফেলা হয়েছে।",
      {
        id: pricing._id,
        name: pricing.name,
      }
    );
  } catch (error) {
    console.error(
      "❌ প্রাইসিং প্ল্যান মুছে ফেলতে সমস্যা হয়েছে:",
      error
    );

    return errorResponse(
      "প্রাইসিং প্ল্যান মুছে ফেলা যায়নি।",
      500
    );
  }
}