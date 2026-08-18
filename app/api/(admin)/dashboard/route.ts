import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Pricing from "@/models/Pricing";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const tab = searchParams.get("tab");

    if (!tab) {
      return errorResponse("Tab প্রদান করুন।", 400);
    }

    switch (tab) {
      // =========================
      // Pricing
      // =========================
      case "pricing": {
        const pricing = await Pricing.find({})
          .sort({ createdAt: -1 })
          .lean();

        return successResponse(
          "প্রাইসিং প্ল্যান সফলভাবে পাওয়া গেছে।",
          pricing
        );
      }

      // =========================
      // Users
      // =========================
      case "users": {
        const users = await User.find({})
          .sort({ createdAt: -1 })
          .lean();

        return successResponse(
          "Users data সফলভাবে পাওয়া গেছে।",
          users
        );
      }

      // =========================
      // Orders
      // =========================
      case "orders": {
        // const orders = await Order.find({})
        //   .sort({ createdAt: -1 })
        //   .lean();

        // return successResponse(
        //   "Orders data সফলভাবে পাওয়া গেছে।",
        //   orders
        // );

        return successResponse("Orders API এখনো তৈরি করা হয়নি।", []);
      }

      // =========================
      // Services
      // =========================
      case "services": {
        // const services = await Service.find({})
        //   .sort({ createdAt: -1 })
        //   .lean();

        // return successResponse(
        //   "Services data সফলভাবে পাওয়া গেছে।",
        //   services
        // );

        return successResponse("Services API এখনো তৈরি করা হয়নি।", []);
      }

      // =========================
      // Invalid tab
      // =========================
      default:
        return errorResponse("সঠিক tab প্রদান করুন।", 400);
    }
  } catch (error) {
    console.error("❌ Dashboard API error:", error);

    return errorResponse(
      "Dashboard data পাওয়া যায়নি।",
      500
    );
  }
}