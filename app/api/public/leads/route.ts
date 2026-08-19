import { dbConnect } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name?.trim()) return errorResponse("আপনার নাম প্রদান করুন।");
    if (!email?.trim()) return errorResponse("ইমেইল এড্রেস প্রদান করুন।");
    if (!phone?.trim()) return errorResponse("মোবাইল নম্বর প্রদান করুন।");
    if (!message?.trim()) return errorResponse("বার্তা বা জিজ্ঞাসা প্রদান করুন।");

    const newLead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      status: "New",
      date: new Date(),
    });

    return successResponse(
      "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।",
      newLead,
      201
    );
  } catch (error: any) {
    return errorResponse("বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।", 500);
  }
}
