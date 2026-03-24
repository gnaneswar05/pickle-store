import mongoose, { Document, Schema } from "mongoose";

export interface ITaxRate {
  _id?: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export interface ITaxSetting extends Document {
  taxes: ITaxRate[];
  deliveryCharge: number;
  codLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaxRateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const TaxSettingSchema = new Schema(
  {
    taxes: {
      type: [TaxRateSchema],
      default: [],
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    codLimit: {
      type: Number,
      default: 250,
      min: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.TaxSetting ||
  mongoose.model<ITaxSetting>("TaxSetting", TaxSettingSchema);
