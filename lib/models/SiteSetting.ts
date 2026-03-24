import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSetting extends Document {
  brandName: string;
  logoUrl: string;
  manufacturerName: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
  manufacturerGstin: string;
  manufacturerAddressLine1: string;
  manufacturerAddressLine2: string;
  manufacturerCity: string;
  manufacturerState: string;
  manufacturerPincode: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema(
  {
    brandName: {
      type: String,
      default: "Kanvi",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "/logo.jpeg",
      trim: true,
    },
    manufacturerName: {
      type: String,
      default: "Kanvi Homemade Pickles",
      trim: true,
    },
    manufacturerPhone: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerEmail: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerGstin: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerAddressLine1: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerAddressLine2: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerCity: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerState: {
      type: String,
      default: "",
      trim: true,
    },
    manufacturerPincode: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);
