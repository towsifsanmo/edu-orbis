import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Billing from "@/models/Billing";
import Lead from "@/models/Lead";
import Pricing from "@/models/Pricing";
import Setting from "@/models/Setting";
import Testimonial from "@/models/Testimonial";
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

    const userDocs: Record<string, any> = {};

    for (const userData of defaultUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
      } else {
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
      userDocs[userData.email] = user;
    }

    // 4. Seed Billings / Invoices
    const defaultBillings = [
      {
        invoiceNo: "INV-2026-001",
        userId: userDocs["sarmin@school.com"]?._id,
        userName: "Sarmin Akter",
        userEmail: "sarmin@school.com",
        packageId: planDocs["স্টার্টার (Starter)"]._id,
        packageName: "স্টার্টার (Starter)",
        amount: 1020,
        billingMethod: "বিকাশ (bKash)",
        status: "Paid" as const,
        date: new Date("2026-08-01"),
      },
      {
        invoiceNo: "INV-2026-002",
        userId: userDocs["user@edusaas.com"]?._id,
        userName: "Karim Rahman",
        userEmail: "user@edusaas.com",
        packageId: planDocs["প্রফেশনাল (Professional)"]._id,
        packageName: "প্রফেশনাল (Professional)",
        amount: 1800,
        billingMethod: "SSLCommerz",
        status: "Paid" as const,
        date: new Date("2026-08-05"),
      },
      {
        invoiceNo: "INV-2026-003",
        userId: userDocs["user@edusaas.com"]?._id,
        userName: "Karim Rahman",
        userEmail: "user@edusaas.com",
        packageId: planDocs["প্রফেশনাল (Professional)"]._id,
        packageName: "প্রফেশনাল (Professional)",
        amount: 1800,
        billingMethod: "SSLCommerz (Card)",
        status: "Paid" as const,
        date: new Date("2026-07-05"),
      },
      {
        invoiceNo: "INV-2026-004",
        userId: userDocs["jamal@college.com"]?._id,
        userName: "Jamal Uddin",
        userEmail: "jamal@college.com",
        packageId: planDocs["এন্টারপ্রাইজ (Enterprise)"]._id,
        packageName: "এন্টারপ্রাইজ (Enterprise)",
        amount: 4500,
        billingMethod: "ব্যাংক ট্রান্সফার",
        status: "Pending" as const,
        date: new Date("2026-08-10"),
      },
    ];

    for (const b of defaultBillings) {
      const exists = await Billing.findOne({ invoiceNo: b.invoiceNo });
      if (!exists) {
        await Billing.create(b);
      }
    }

    // 5. Seed Leads
    const defaultLeads = [
      {
        name: "Rafiqul Islam",
        email: "rafiq@gmail.com",
        phone: "01711000000",
        message: "I need a full live demo for our 1500 students school.",
        status: "New" as const,
        date: new Date("2026-08-12"),
      },
      {
        name: "Nusrat Jahan",
        email: "nusrat@yahoo.com",
        phone: "01811000000",
        message: "Can we integrate existing biometric attendance machines?",
        status: "Contacted" as const,
        date: new Date("2026-08-13"),
      },
    ];

    for (const l of defaultLeads) {
      const exists = await Lead.findOne({ email: l.email });
      if (!exists) {
        await Lead.create(l);
      }
    }

    // 6. Seed Testimonials
    const defaultTestimonials = [
      {
        author: "ড. শফিকুল ইসলাম",
        role: "অধ্যক্ষ",
        instituteName: "ফিউচার প্রিপারেটরি স্কুল",
        quote: "এডুস্যাস প্রো আমাদের স্কুলের ব্যবস্থাপনা ও একাউন্টিং অনেক সহজ ও স্বচ্ছ করে দিয়েছে।",
        image: "https://i.pravatar.cc/150?u=14",
        rating: 5,
      },
      {
        author: "তাসনিম জাহান",
        role: "প্রধান শিক্ষক",
        instituteName: "আইডিয়াল একাডেমি",
        quote: "রেজাল্ট পাবলিকেশন এবং এসএমএস নোটিফিকেশন সিস্টেম সত্যিই অতুলনীয়।",
        image: "https://i.pravatar.cc/150?u=22",
        rating: 5,
      },
    ];

    for (const t of defaultTestimonials) {
      const exists = await Testimonial.findOne({ author: t.author });
      if (!exists) {
        await Testimonial.create(t);
      }
    }

    // 7. Seed Settings
    let setting = await Setting.findOne();
    if (!setting) {
      await Setting.create({
        siteName: "এডুস্যাস প্রো - স্কুল ম্যানেজমেন্ট",
        adminEmail: "admin@edusaas.com",
        supportPhone: "+880 1711223344",
        supportEmail: "support@edusaas.com",
      });
    }

    return successResponse("ডাটাবেস সিডার সম্পূর্ণ সফলভাবে সম্পন্ন হয়েছে।", {
      plans: Object.keys(planDocs),
      users: Object.keys(userDocs),
    });
  } catch (error: any) {
    console.error("❌ Database seeding error:", error);
    return errorResponse(
      `সিডার সম্পন্ন করতে ব্যর্থ হয়েছে: ${error?.message || "Server error"}`,
      500
    );
  }
}
