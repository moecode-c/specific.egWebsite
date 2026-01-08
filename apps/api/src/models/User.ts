import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "admin";

export type UserDoc = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  wishlist: Types.ObjectId[];
  createdAt: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
};

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User =
  mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);
