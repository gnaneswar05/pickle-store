import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name: string;
  gender: "male" | "female" | "other" | "";
  email?: string;
  otp: string | null;
  otpExpiry: Date | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userDefinition = {
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[0-9]{10}$/,
  },
  name: {
    type: String,
    default: "",
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", ""],
    default: "",
  },
  email: {
    type: String,
    default: undefined,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
} satisfies Record<string, unknown>;

const UserSchema = new Schema(userDefinition, { timestamps: true });

const existingModel = mongoose.models.User as Model<IUser> | undefined;

if (existingModel) {
  const existingSchema = existingModel.schema;

  for (const [pathName, pathDefinition] of Object.entries(userDefinition)) {
    if (!existingSchema.path(pathName)) {
      existingSchema.add({ [pathName]: pathDefinition });
    }
  }
}

const User =
  existingModel || mongoose.model<IUser>("User", UserSchema);

export default User;
