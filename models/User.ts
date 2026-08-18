import mongoose, { Model, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  mobile: string;
  instituteName: string;
  packageId:mongoose.Types.ObjectId;
  role: "admin" | "user";
  status: "active" | "inactive";
  image: string;
  password: string;

}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    instituteName: {
      type: String,
      required: true,
      trim: true,
    },

    packageId:{
      type: Schema.Types.ObjectId,
      ref: "Pricing",
      required: true,
    },
  

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;