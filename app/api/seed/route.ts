import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    await dbConnect();

    // 1. Seed Pricing Plans
    const defaultPlans = [
      {
        name: "স্টার্টার (Starter)",
        price: 1200,
        discountPrice: 1020,
        discount: 15,
        billingType: "Yearly (বার্ষিক)" as const,
        features: [
          "সর্বোচ্চ ৫০০ শিক্ষার্থী",
          "বেসিক অ্যাটেনডেন্স",
          "রেজাল্ট প্রসেসিং",
          "এসএমএস নোটিফিকেশন",
        ],
      },
      {
        name: "প্রফেশনাল (Professional)",
        price: 2400,
        discountPrice: 1800,
        discount: 25,
        billingType: "Yearly (বার্ষিক)" as const,
        features: [
          "সর্বোচ্চ ২,০০০ শিক্ষার্থী",
          "বায়োমেট্রিক অ্যাটেনডেন্স",
          "অনলাইন পেমেন্ট গেটওয়ে",
          "অটোমেটেড একাউন্টিং",
          "লাইব্রেরি ও হোস্টেল ম্যানেজমেন্ট",
        ],
      },
      {
        name: "এন্টারপ্রাইজ (Enterprise)",
        price: 5000,
        discountPrice: 4500,
        discount: 10,
        billingType: "Monthly (মাসিক)" as const,
        features: [
          "আনলিমিটেড শিক্ষার্থী ও শিক্ষক",
          "মাল্টি-ব্রাঞ্চ ম্যানেজমেন্ট",
          "কাস্টম ডোমেইন ও ব্র্যান্ডিং",
          "কাস্টম মোবাইল অ্যাপ সাপোর্ট",
          "২৪/৭ ডেডিকেটেড সাপোর্ট",
        ],
      },
    ];

    const planDocs: Record<string, any> = {};

    for (const plan of defaultPlans) {
      let existingPlan = await Pricing.findOne({ name: plan.name });
      if (!existingPlan) {
        existingPlan = await Pricing.create(plan);
      }
      planDocs[plan.name] = existingPlan;
    }

    // 2. Hash default password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 3. Seed Default Users
    const defaultUsers = [
      {
        name: "সিস্টেম অ্যাডমিন (System Admin)",
        email: "admin@edusaas.com",
        mobile: "01700000000",
        instituteName: "এডুস্যাস সেন্ট্রাল",
        packageId: planDocs["এন্টারপ্রাইজ (Enterprise)"]._id,
        role: "admin" as const,
        status: "active" as const,
        image: "https://i.pravatar.cc/150?u=admin",
        password: hashedPassword,
      },
      {
        name: "করিম রহমান (Karim Rahman)",
        email: "user@edusaas.com",
        mobile: "01711223344",
        instituteName: "ঢাকা পাবলিক স্কুল",
        packageId: planDocs["প্রফেশনাল (Professional)"]._id,
        role: "user" as const,
        status: "active" as const,
        image: "https://i.pravatar.cc/150?u=1",
        password: hashedPassword,
      },
      {
        name: "শারমিন আক্তার (Sarmin Akter)",
        email: "sarmin@school.com",
        mobile: "01811223344",
        instituteName: "গ্রিনফিল্ড মডেল একাডেমি",
        packageId: planDocs["স্টার্টার (Starter)"]._id,
        role: "user" as const,
        status: "active" as const,
        image: "https://i.pravatar.cc/150?u=2",
        password: hashedPassword,
      },
      {
        name: "জামাল উদ্দিন (Jamal Uddin)",
        email: "jamal@college.com",
        mobile: "01911223344",
        instituteName: "রাজশাহী কলেজিয়েট",
        packageId: planDocs["এন্টারপ্রাইজ (Enterprise)"]._id,
        role: "user" as const,
        status: "inactive" as const,
        image: "https://i.pravatar.cc/150?u=3",
        password: hashedPassword,
      },
    ];

    const seededUsers = [];

    for (const userData of defaultUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
      } else {
        // Ensure role, status, package, and password match standard seed credentials
        user.name = userData.name;
        user.mobile = userData.mobile;
        user.instituteName = userData.instituteName;
        user.packageId = userData.packageId;
        user.role = userData.role;
        user.status = userData.status;
        user.image = userData.image;
        user.password = hashedPassword;
        await user.save();
      }
      seededUsers.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }

    return successResponse("ডাটাবেস সিডার সফলভাবে সম্পন্ন হয়েছে।", {
      plans: Object.keys(planDocs),
      users: seededUsers,
    });
  } catch (error: any) {
    console.error("❌ Database seeding error:", error);
    return errorResponse(
      `সিডার সম্পন্ন করতে ব্যর্থ হয়েছে: ${error?.message || "Server error"}`,
      500
    );
  }
}
