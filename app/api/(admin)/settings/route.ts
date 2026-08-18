import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Setting from "@/models/Setting";
import User from "@/models/User";
import bcrypt from "bcryptjs";
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
    let setting = await Setting.findOne().lean();
    if (!setting) {
      setting = await Setting.create({
        siteName: "এডুস্যাস প্রো - স্কুল ম্যানেজমেন্ট",
        adminEmail: "admin@edusaas.com",
        supportPhone: "+880 1711223344",
        supportEmail: "support@edusaas.com",
      });
    }

    return successResponse("সেটিংস ডেটা পাওয়া গেছে।", setting);
  } catch (error: any) {
    return errorResponse("সেটিংস লোড করতে সমস্যা হয়েছে।", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return errorResponse("অননুমোদিত অ্যাক্সেস।", 403);

    await dbConnect();
    const body = await req.json();
    const {
      siteName,
      adminEmail,
      supportPhone,
      supportEmail,
      currentPassword,
      newPassword,
    } = body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    if (siteName?.trim()) setting.siteName = siteName.trim();
    if (adminEmail?.trim()) setting.adminEmail = adminEmail.trim();
    if (supportPhone?.trim()) setting.supportPhone = supportPhone.trim();
    if (supportEmail?.trim()) setting.supportEmail = supportEmail.trim();
    await setting.save();

    // Password change logic for Admin
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return errorResponse("পাসওয়ার্ড পরিবর্তন করতে বর্তমান পাসওয়ার্ড প্রদান করুন।");
      }
      if (newPassword.trim().length < 6) {
        return errorResponse("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      }

      const adminUser = await User.findById(admin.id).select("+password");
      if (!adminUser) return errorResponse("অ্যাডমিন ইউজার পাওয়া যায়নি।", 404);

      const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
      if (!isMatch) {
        return errorResponse("বর্তমান পাসওয়ার্ড সঠিক নয়।", 400);
      }

      adminUser.password = await bcrypt.hash(newPassword.trim(), 10);
      await adminUser.save();
    }

    return successResponse("সেটিংস সফলভাবে সংরক্ষিত হয়েছে।", setting);
  } catch (error: any) {
    return errorResponse("সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।", 500);
  }
}
