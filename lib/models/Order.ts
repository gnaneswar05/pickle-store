import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  invoiceNumber: string;
  subtotalAmount: number;
  taxableAmount: number;
  totalTaxAmount: number;
  taxes: Array<{
    name: string;
    rate: number;
    amount: number;
  }>;
  deliveryCharge: number;
  totalAmount: number;
  address: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  paymentType: "COD" | "ONLINE";
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERED";
  couponCode?: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    subtotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTaxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxes: [
      {
        name: String,
        rate: Number,
        amount: Number,
      },
    ],
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    address: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
      pincode: { type: String },
    },
    paymentType: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED"],
      default: "PENDING",
    },
    couponCode: String,
    discountAmount: {
      type: Number,
      default: 0,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
