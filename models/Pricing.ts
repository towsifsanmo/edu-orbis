import mongoose, { Model, Schema } from "mongoose";

export interface IPricing {
  name: string;
  price: number;
  discountPrice: number;
  discount: number;
  billingType: "Monthly (মাসিক)" | "Yearly (বার্ষিক)";
  features: string[];
}

const PricingSchema = new Schema<IPricing>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    billingType: {
      type: String,
      enum: ["Monthly (মাসিক)", "Yearly (বার্ষিক)"],
      default:"Monthly (মাসিক)",
    },

    features: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Pricing: Model<IPricing> =
  mongoose.models.Pricing ||
  mongoose.model<IPricing>("Pricing", PricingSchema);

export default Pricing;