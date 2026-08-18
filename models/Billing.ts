import mongoose, { Model, Schema } from "mongoose";

export interface IBilling {
  invoiceNo: string;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  packageId?: mongoose.Types.ObjectId;
  packageName: string;
  amount: number;
  billingMethod: string;
  status: "Paid" | "Pending" | "Failed";
  date: Date;
}

const BillingSchema = new Schema<IBilling>(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Pricing",
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    billingMethod: {
      type: String,
      required: true,
      default: "SSLCommerz (bKash)",
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Paid",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Billing: Model<IBilling> =
  mongoose.models.Billing || mongoose.model<IBilling>("Billing", BillingSchema);

export default Billing;
