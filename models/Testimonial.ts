import mongoose, { Model, Schema } from "mongoose";

export interface ITestimonial {
  author: string;
  role: string;
  instituteName?: string;
  quote: string;
  image?: string;
  rating?: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    instituteName: {
      type: String,
      trim: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
