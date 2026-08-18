import mongoose, { Model, Schema } from "mongoose";

export interface ISetting {
  siteName: string;
  adminEmail: string;
  supportPhone: string;
  supportEmail: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    siteName: {
      type: String,
      default: "এডুস্যাস প্রো - স্কুল ম্যানেজমেন্ট",
    },
    adminEmail: {
      type: String,
      default: "admin@edusaas.com",
    },
    supportPhone: {
      type: String,
      default: "+880 1711223344",
    },
    supportEmail: {
      type: String,
      default: "support@edusaas.com",
    },
  },
  {
    timestamps: true,
  }
);

const Setting: Model<ISetting> =
  mongoose.models.Setting ||
  mongoose.model<ISetting>("Setting", SettingSchema);

export default Setting;
