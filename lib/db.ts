import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

global.mongoose = cached;

function getMongoDBUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(".env.local ফাইলে MONGODB_URI পাওয়া যায়নি।");
  }

  return uri;
}

export async function dbConnect() {
  if (cached.conn) {
    console.log("✅ MongoDB ইতোমধ্যে সংযুক্ত রয়েছে।");
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = getMongoDBUri();

    console.log("🔄 MongoDB-এর সাথে সংযোগ স্থাপন করা হচ্ছে...");

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;

    console.log("✅ MongoDB সফলভাবে সংযুক্ত হয়েছে।");

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("❌ MongoDB-এর সাথে সংযোগ স্থাপন ব্যর্থ হয়েছে:", error);

    throw error;
  }
}