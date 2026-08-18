import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
    const users = await User.find({}).sort({ createdAt: -1 }).populate("packageId").lean();
    return successResponse("ইউজার তালিকা পাওয়া গেছে।", users);
  } catch (error: any) {
    return errorResponse("ইউজার ডেটা লোড করতে ব্যর্থ হয়েছে।", 500);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const body = await req.json();
    const {
      name,
      email,
      mobile,
      instituteName,
      packageId,
      role = "user",
      status = "active",
      image,
      password,
    } = body;

    if (!name?.trim()) return errorResponse("নাম প্রদান করুন।");
    if (!email?.trim()) return errorResponse("ইমেইল প্রদান করুন।");
    if (!mobile?.trim()) return errorResponse("মোবাইল নম্বর প্রদান করুন।");
    if (!instituteName?.trim()) return errorResponse("প্রতিষ্ঠানের নাম প্রদান করুন।");
    if (!password || password.length < 6)
      return errorResponse("কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড প্রদান করুন।");

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return errorResponse("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে।", 409);

    let pkgId = packageId;
    if (!pkgId || !mongoose.Types.ObjectId.isValid(pkgId)) {
      const defaultPkg = await Pricing.findOne();
      pkgId = defaultPkg?._id;
    }

    if (!pkgId) {
      return errorResponse("কোনো প্রাইসিং প্ল্যান পাওয়া যায়নি। প্রথমে প্ল্যান তৈরি করুন।");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      instituteName: instituteName.trim(),
      packageId: pkgId,
      role: role || "user",
      status: status || "active",
      image: image?.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      password: hashedPassword,
    });

    const populatedUser = await User.findById(newUser._id).populate("packageId").lean();
    return successResponse("ব্যবহারকারী সফলভাবে তৈরি হয়েছে।", populatedUser, 201);
  } catch (error: any) {
    console.error("User creation error:", error);
    return errorResponse(`ইউজার তৈরি করতে সমস্যা হয়েছে: ${error.message}`, 500);
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
      return errorResponse("সঠিক ইউজার ID প্রদান করুন।", 400);
    }

    const body = await req.json();
    const {
      name,
      email,
      mobile,
      instituteName,
      packageId,
      role,
      status,
      image,
      password,
    } = body;

    const updateData: any = {};
    if (name?.trim()) updateData.name = name.trim();
    if (email?.trim()) {
      const existing = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: id },
      });
      if (existing) return errorResponse("এই ইমেইল অন্য অ্যাকাউন্টে ব্যবহৃত হচ্ছে।", 409);
      updateData.email = email.trim().toLowerCase();
    }
    if (mobile?.trim()) updateData.mobile = mobile.trim();
    if (instituteName?.trim()) updateData.instituteName = instituteName.trim();
    if (packageId && mongoose.Types.ObjectId.isValid(packageId)) updateData.packageId = packageId;
    if (role && ["admin", "user"].includes(role)) updateData.role = role;
    if (status && ["active", "inactive"].includes(status)) updateData.status = status;
    if (image?.trim()) updateData.image = image.trim();
    if (password && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .populate("packageId")
      .lean();

    if (!updatedUser) return errorResponse("ইউজার পাওয়া যায়নি।", 404);

    return successResponse("ইউজার তথ্য সফলভাবে আপডেট হয়েছে।", updatedUser);
  } catch (error: any) {
    return errorResponse("ইউজার আপডেট ব্যর্থ হয়েছে।", 500);
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
      return errorResponse("সঠিক ইউজার ID প্রদান করুন।", 400);
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return errorResponse("ইউজার পাওয়া যায়নি।", 404);

    return successResponse("ইউজার সফলভাবে মুছে ফেলা হয়েছে।", { id });
  } catch (error: any) {
    return errorResponse("ইউজার মুছতে সমস্যা হয়েছে।", 500);
  }
}
