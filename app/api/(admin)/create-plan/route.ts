import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      name,
      price,
      discount,
      billingType,
      features,
    } = body;

    if (!name || !name.trim()) {
      return errorResponse("প্রাইসিং প্ল্যানের নাম প্রদান করুন।");
    }

    if (price === undefined || price === null) {
      return errorResponse("প্রাইসিং প্ল্যানের মূল্য প্রদান করুন।");
    }

    if (typeof price !== "number" || price < 0) {
      return errorResponse("সঠিক প্রাইসিং প্ল্যানের মূল্য প্রদান করুন।");
    }

    if (discount === undefined || discount === null) {
      return errorResponse("ডিসকাউন্ট প্রদান করুন।");
    }

    if (
      typeof discount !== "number" ||
      discount < 0 ||
      discount > 100
    ) {
      return errorResponse(
        "ডিসকাউন্ট 0 থেকে 100 এর মধ্যে হতে হবে।"
      );
    }

    if (!billingType) {
      return errorResponse("বিলিং টাইপ নির্বাচন করুন।");
    }

    if (!["Monthly (মাসিক)", "Yearly (বার্ষিক)"].includes(billingType)) {
      return errorResponse("সঠিক বিলিং টাইপ নির্বাচন করুন।");
    }

    if (!features) {
      return errorResponse("কমপক্ষে একটি ফিচার প্রদান করুন।");
    }

    if (!Array.isArray(features)) {
      return errorResponse(
        "ফিচার অবশ্যই একটি তালিকা হতে হবে।"
      );
    }

    if (features.length === 0) {
      return errorResponse(
        "কমপক্ষে একটি ফিচার প্রদান করুন।"
      );
    }

    for (const feature of features) {
      if (typeof feature !== "string" || !feature.trim()) {
        return errorResponse(
          "প্রতিটি ফিচারের সঠিক তথ্য প্রদান করুন।"
        );
      }
    }
    const discountPrice =
      price - (price * discount) / 100;

    const existingPricing = await Pricing.findOne({
      name: name.trim(),
      billingType,
    });

    if (existingPricing) {
      return errorResponse(
        "এই নামে একই বিলিং টাইপের একটি প্রাইসিং প্ল্যান ইতোমধ্যে রয়েছে।",
        409
      );
    }

    const pricing = await Pricing.create({
      name: name.trim(),
      price,
      discountPrice,
      discount,
      billingType,
      features: features.map(
        (feature: string) => feature.trim()
      ),
    });

    return successResponse(
      "প্রাইসিং প্ল্যান সফলভাবে তৈরি হয়েছে।",
      {
        id: pricing._id,
        name: pricing.name,
        price: pricing.price,
        discountPrice: pricing.discountPrice,
        discount: pricing.discount,
        billingType: pricing.billingType,
        features: pricing.features,
      },
      201
    );
  } catch (error) {
    console.error(
      "❌ প্রাইসিং প্ল্যান তৈরি করতে সমস্যা হয়েছে:",
      error
    );

    return errorResponse(
      "প্রাইসিং প্ল্যান তৈরি করা যায়নি।",
      500
    );
  }
}