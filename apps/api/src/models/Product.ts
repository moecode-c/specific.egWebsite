import mongoose, { Schema, Types } from "mongoose";

export type ProductDoc = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  images: string[];
  phoneModels: string[];
  colors: string[];
  isFeatured: boolean;
  createdAt: Date;
};

const productSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    phoneModels: { type: [String], required: true, default: [] },
    colors: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

productSchema.index({ name: "text" });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ phoneModels: 1 });
productSchema.index({ colors: 1 });

export const Product =
  mongoose.models.Product || mongoose.model<ProductDoc>("Product", productSchema);
