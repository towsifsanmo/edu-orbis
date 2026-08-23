import { AUTH_COOKIE_NAME, verifyJWT } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Billing from "@/models/Billing";
import Lead from "@/models/Lead";
import Pricing from "@/models/Pricing";
import Setting from "@/models/Setting";
import Testimonial from "@/models/Testimonial";
import User from "@/models/User";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return errorResponse(
        "অননুমোদিত অ্যাক্সেস। শুধুমাত্র অ্যাডমিনদের জন্য।",
        403,
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "overview";

    switch (tab) {
      case "overview":
      case "dashboard": {
        const [
          totalUsersCount,
          activeSubscribersCount,
          totalLeadsCount,
          allBillings,
          recentUsers,
          recentBillings,
        ] = await Promise.all([
          User.countDocuments({ role: { $ne: "admin" } }),
          User.countDocuments({ role: { $ne: "admin" }, status: "active" }),
          Lead.countDocuments({}),
          Billing.find({ status: "Paid" }).lean(),
          User.find({ role: { $ne: "admin" } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("packageId")
            .lean(),
          Billing.find({}).sort({ date: -1 }).limit(5).lean(),
        ]);

        const totalRevenue = allBillings.reduce(
          (sum, b) => sum + (b.amount || 0),
          0,
        );

        const notifications = [
          {
            id: "1",
            title: `নতুন সাবস্ক্রিপশন পেমেন্ট সম্পন্ন হয়েছে`,
            time: "১০ মিনিট আগে",
            read: false,
          },
          {
            id: "2",
            title: `মোট ${totalLeadsCount} টি ডেমো রিকোয়েস্ট জমা রয়েছে`,
            time: "১ ঘণ্টা আগে",
            read: false,
          },
          {
            id: "3",
            title: `সর্বমোট ${totalUsersCount} জন ইউজার নিবন্ধিত`,
            time: "৩ ঘণ্টা আগে",
            read: true,
          },
        ];

        return successResponse("ড্যাশবোর্ড ওভারভিউ ডেটা পাওয়া গেছে।", {
          stats: {
            totalUsers: totalUsersCount,
            activeSubscribers: activeSubscribersCount,
            totalRevenue,
            totalLeads: totalLeadsCount,
          },
          recentUsers,
          recentBillings,
          notifications,
        });
      }

      // =========================
      // Users (Exclude single admin)
      // =========================
      case "users": {
        const users = await User.find({ role: { $ne: "admin" } })
          .sort({ createdAt: -1 })
          .populate("packageId")
          .lean();

        return successResponse("Users data সফলভাবে পাওয়া গেছে।", users);
      }

      // =========================
      // Subscribers
      // =========================
      case "subscribers": {
        const subscribers = await User.find({ role: { $ne: "admin" } })
          .sort({ createdAt: -1 })
          .populate("packageId")
          .lean();

        return successResponse(
          "Subscribers data সফলভাবে পাওয়া গেছে।",
          subscribers,
        );
      }

      // =========================
      // Pricing
      // =========================
      case "pricing": {
        const pricing = await Pricing.find({}).sort({ createdAt: -1 }).lean();

        return successResponse(
          "প্রাইসিং প্ল্যান সফলভাবে পাওয়া গেছে।",
          pricing,
        );
      }

      // =========================
      // Billing & Invoices
      // =========================
      case "billing": {
        const billings = await Billing.find({})
          .sort({ date: -1, createdAt: -1 })
          .lean();

        return successResponse("বিলিং ডেটা সফলভাবে পাওয়া গেছে।", billings);
      }

      // =========================
      // Leads
      // =========================
      case "leads": {
        const leads = await Lead.find({})
          .sort({ date: -1, createdAt: -1 })
          .lean();

        return successResponse("লিড ডেটা সফলভাবে পাওয়া গেছে।", leads);
      }

      // =========================
      // Testimonials
      // =========================
      case "testimonials": {
        const testimonials = await Testimonial.find({})
          .sort({ createdAt: -1 })
          .lean();

        return successResponse(
          "টেস্টিমোনিয়াল ডেটা সফলভাবে পাওয়া গেছে।",
          testimonials,
        );
      }

      // =========================
      // Settings
      // =========================
      case "settings": {
        let setting = await Setting.findOne().lean();

        if (!setting) {
          const createdSetting = await Setting.create({
            siteName: "",
            adminEmail: "",
            supportPhone: "+",
            supportEmail: "",
          });

          setting = createdSetting.toObject();
        }

        return successResponse("সেটিংস ডেটা সফলভাবে পাওয়া গেছে।", setting);
      }

      default:
        return errorResponse("সঠিক tab প্রদান করুন।", 400);
    }
  } catch (error: any) {
    console.error("❌ Dashboard API error:", error);
    return errorResponse("Dashboard data পাওয়া যায়নি।", 500);
  }
}
