import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  image: string;
  title: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", BannerSchema);
