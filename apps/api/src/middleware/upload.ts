import multer from "multer";

// Use in-memory storage so we can stream directly to Supabase Storage.
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});
