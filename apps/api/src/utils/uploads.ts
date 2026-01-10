import fs from "fs";
import path from "path";

export function getUploadsDir() {
  // Vercel serverless functions have a read-only filesystem except for /tmp.
  if (process.env.VERCEL === "1") {
    return path.posix.join("/tmp", "uploads");
  }

  // Local/dev (and traditional servers): keep uploads alongside the API app.
  return path.resolve(__dirname, "..", "..", "uploads");
}

export function ensureUploadsDir(dir = getUploadsDir()) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
