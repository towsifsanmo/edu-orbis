import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "MongoDB সফলভাবে সংযুক্ত হয়েছে।",
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB-এর সাথে সংযোগ স্থাপন করা যায়নি।",
      },
      { status: 500 }
    );
  }
}