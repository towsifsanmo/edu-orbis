import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      name,
      email,
      mobile,
      instituteName,
      packageId,
      status,
      image,
      password,
    } = body;

    if (!name || !name.trim()) {
      return errorResponse("নাম প্রদান করুন।");
    }

    if (!email || !email.trim()) {
      return errorResponse("ইমেইল প্রদান করুন।");
    }

    if (!mobile || !mobile.trim()) {
      return errorResponse("মোবাইল নম্বর প্রদান করুন।");
    }

    if (!instituteName || !instituteName.trim()) {
      return errorResponse("প্রতিষ্ঠানের নাম প্রদান করুন।");
    }
    if (!packageId) {
      return errorResponse("একটি প্যাকেজ নির্বাচন করুন।");
    }

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return errorResponse("প্যাকেজ আইডি সঠিক নয়।");
    }

    if (!password) {
      return errorResponse("পাসওয়ার্ড প্রদান করুন।");
    }

    if (password.length < 6) {
      return errorResponse("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
    }

    if (password.length > 20) {
      return errorResponse("পাসওয়ার্ড সর্বোচ্চ ২০ অক্ষরের হতে হবে।");
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return errorResponse(
        "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।",
        409,
      );
    }

    const selectedPackage = await Pricing.findById(packageId);
    if (!selectedPackage) {
      return errorResponse("নির্বাচিত প্যাকেজটি পাওয়া যায়নি।", 404);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      instituteName: instituteName.trim(),
      packageId,
      password: hashedPassword,
      image: image?.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(cleanEmail)}`,
      role: "user", // STRICT: Only user role allowed
      status: status === "inactive" ? "inactive" : "active",
    });

    return successResponse(
      "ব্যবহারকারী সফলভাবে তৈরি হয়েছে।",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        instituteName: user.instituteName,
        package: user.package,
        role: user.role,
        status: user.status,
        image: user.image,
      },
      201,
    );
  } catch (error) {
    console.error("❌ ব্যবহারকারী তৈরি করতে সমস্যা হয়েছে:", error);
    return errorResponse("ব্যবহারকারী তৈরি করতে একটি সমস্যা হয়েছে।", 500);
  }
}
