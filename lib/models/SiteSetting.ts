import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSetting extends Document {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  homeTrendingEyebrow: string;
  homeTrendingTitle: string;
  homeTrendingDescription: string;
  homeTrendingButtonLabel: string;
  homeSeasonalEyebrow: string;
  homeSeasonalTitle: string;
  homeSeasonalDescription: string;
  homeSeasonalButtonLabel: string;
  manufacturerName: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
  manufacturerGstin: string;
  manufacturerAddressLine1: string;
  manufacturerAddressLine2: string;
  manufacturerCity: string;
  manufacturerState: string;
  manufacturerPincode: string;
  serviceablePincodes: string[];
  aboutUsTitle: string;
  aboutUsContent: string;
  aboutUsImage: string;
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
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
    brandTagline: {
      type: String,
      default: "Small Batch Pickles",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "/logo.jpeg",
      trim: true,
    },
    homeTrendingEyebrow: {
      type: String,
      default: "Most Loved",
      trim: true,
    },
    homeTrendingTitle: {
      type: String,
      default: "Fan-favourite jars with a premium shelf feel",
      trim: true,
    },
    homeTrendingDescription: {
      type: String,
      default:
        "This row is styled like a curated collection instead of a plain list, so customers get a more premium browse experience.",
      trim: true,
    },
    homeTrendingButtonLabel: {
      type: String,
      default: "View all products",
      trim: true,
    },
    homeSeasonalEyebrow: {
      type: String,
      default: "Seasonal Spotlight",
      trim: true,
    },
    homeSeasonalTitle: {
      type: String,
      default: "Limited runs worth catching before they disappear",
      trim: true,
    },
    homeSeasonalDescription: {
      type: String,
      default:
        "A softer editorial section that feels distinct from the main best-seller shelf while still keeping the premium rhythm.",
      trim: true,
    },
    homeSeasonalButtonLabel: {
      type: String,
      default: "Browse collection",
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
    serviceablePincodes: {
      type: [String],
      default: [],
    },
    aboutUsTitle: {
      type: String,
      default: "Who We Are",
      trim: true,
    },
    aboutUsContent: {
      type: String,
      default: "We make small-batch pickles with real spice, real oil, and no factory feel.",
      trim: true,
    },
    aboutUsImage: {
      type: String,
      default: "/logo.jpeg",
      trim: true,
    },
    termsAndConditions: {
      type: String,
      default: "Terms and conditions go here.",
    },
    privacyPolicy: {
      type: String,
      default: "Privacy policy goes here.",
    },
    refundPolicy: {
      type: String,
      default: "Refund policy goes here.",
    },
  },
  { timestamps: true },
);

export default mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);
