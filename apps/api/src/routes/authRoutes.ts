import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { login, register } from "../controllers/authController";

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler(register));
authRoutes.post("/login", asyncHandler(login));
