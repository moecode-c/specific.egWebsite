import mongoose, { Schema, Types } from "mongoose";

export type ReviewDoc = {
  _id: Types.ObjectId;
  name: string;
  rating: number;
  title: string;
  body: string;
  isFeatured: boolean;
  createdAt: Date;
};

const reviewSchema = new Schema<ReviewDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 1200 },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

reviewSchema.index({ isFeatured: 1, createdAt: -1 });

export const Review =
  mongoose.models.Review || mongoose.model<ReviewDoc>("Review", reviewSchema);
