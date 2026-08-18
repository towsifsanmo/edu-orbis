import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import mongoose from "mongoose";

export async function PUT(req: Request) {
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

    const body = await req.json();

    const {
      name,
      price,
      discount,
      billingType,
      features,
    } = body;

    if (!name || !name.trim()) {
      return errorResponse(
        "প্যাকেজের নাম প্রদান করুন।"
      );
    }

    if (price === undefined || price === null) {
      return errorResponse(
        "প্যাকেজের মূল্য প্রদান করুন।"
      );
    }

    if (typeof price !== "number" || price < 0) {
      return errorResponse(
        "সঠিক প্যাকেজ মূল্য প্রদান করুন।"
      );
    }

    if (discount === undefined || discount === null) {
      return errorResponse(
        "ডিসকাউন্ট প্রদান করুন।"
      );
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
      return errorResponse(
        "বিলিং টাইপ নির্বাচন করুন।"
      );
    }

    if (
      ![
        "Monthly (মাসিক)",
        "Yearly (বার্ষিক)",
      ].includes(billingType)
    ) {
      return errorResponse(
        "সঠিক বিলিং টাইপ নির্বাচন করুন।"
      );
    }

    if (!features) {
      return errorResponse(
        "কমপক্ষে একটি ফিচার প্রদান করুন।"
      );
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
      if (
        typeof feature !== "string" ||
        !feature.trim()
      ) {
        return errorResponse(
          "প্রতিটি ফিচারের সঠিক তথ্য প্রদান করুন।"
        );
      }
    }

    const existingPricing = await Pricing.findById(id);

    if (!existingPricing) {
      return errorResponse(
        "প্রাইসিং প্ল্যানটি খুঁজে পাওয়া যায়নি।",
        404
      );
    }

    const duplicatePricing = await Pricing.findOne({
      _id: { $ne: id },
      name: name.trim(),
      billingType,
    });

    if (duplicatePricing) {
      return errorResponse(
        "এই নামে একই বিলিং টাইপের একটি প্যাকেজ ইতোমধ্যে রয়েছে।",
        409
      );
    }

    const discountPrice =
      price - (price * discount) / 100;

    const pricing = await Pricing.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price,
        discountPrice,
        discount,
        billingType,
        features: features.map(
          (feature: string) => feature.trim()
        ),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pricing) {
      return errorResponse(
        "প্রাইসিং প্ল্যান আপডেট করা যায়নি।",
        500
      );
    }

    return successResponse(
      "প্যাকেজ সফলভাবে আপডেট হয়েছে।",
      {
        id: pricing._id,
        name: pricing.name,
        price: pricing.price,
        discountPrice: pricing.discountPrice,
        discount: pricing.discount,
        billingType: pricing.billingType,
        features: pricing.features,
      }
    );
  } catch (error) {
    console.error(
      "❌ প্যাকেজ আপডেট করতে সমস্যা হয়েছে:",
      error
    );

    return errorResponse(
      "প্যাকেজ আপডেট করা যায়নি।",
      500
    );
  }
}