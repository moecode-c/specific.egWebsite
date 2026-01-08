import type { Request, Response } from "express";
import { HttpError } from "../middleware/errorHandler";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) throw new HttpError(400, "Missing fields");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new HttpError(409, "Email already in use");

  const user = await User.create({ name, email, password, role: "user" });
  const token = signToken({ userId: user._id.toString(), role: user.role });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) throw new HttpError(400, "Missing fields");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  const token = signToken({ userId: user._id.toString(), role: user.role });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
