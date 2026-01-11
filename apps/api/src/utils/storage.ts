import { createClient } from "@supabase/supabase-js";
import path from "path";
import { env } from "./env";

function assertStorageConfigured() {
  const missing: string[] = [];
  if (!env.SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!env.SUPABASE_BUCKET) missing.push("SUPABASE_BUCKET");

  if (missing.length) {
    throw new Error(`Supabase storage is not configured. Missing: ${missing.join(", ")}`);
  }
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function buildObjectPath(file: Express.Multer.File, folder = "products") {
  const safeName = (file.originalname || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return path.posix.join(folder, `${unique}-${safeName}`);
}

function buildPublicUrl(objectPath: string) {
  if (env.SUPABASE_PUBLIC_BASE_URL) {
    return `${env.SUPABASE_PUBLIC_BASE_URL.replace(/\/$/, "")}/${objectPath}`;
  }
  const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function uploadImagesToSupabase(
  files: Express.Multer.File[] | undefined,
  folder = "products"
): Promise<string[]> {
  if (!files?.length) return [];

  assertStorageConfigured();

  async function uploadSingle(file: Express.Multer.File) {
    const objectPath = buildObjectPath(file, folder);

    // Retry transient network errors (e.g., Supabase fetch failed) a few times before bailing.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const { error } = await supabase.storage
        .from(env.SUPABASE_BUCKET)
        .upload(objectPath, file.buffer, {
          cacheControl: "31536000",
          contentType: file.mimetype || undefined,
          upsert: false,
        });

      if (!error) return buildPublicUrl(objectPath);

      const isLast = attempt === maxAttempts;
      const message = `Failed to upload ${file.originalname}: ${error.message}`;
      if (isLast) {
        throw new Error(message);
      }

      // Simple backoff to soften transient DNS/TLS hiccups in serverless environments.
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }

    throw new Error(`Failed to upload ${file.originalname}: unknown error`);
  }

  return Promise.all(files.map((file) => uploadSingle(file)));
}

export async function storageHealthCheck() {
  assertStorageConfigured();
  const bucket = env.SUPABASE_BUCKET;

  const { data, error } = await supabase.storage.from(bucket).list("", { limit: 1 });

  const host = (() => {
    try {
      const url = new URL(env.SUPABASE_URL);
      return url.host;
    } catch {
      return "invalid-supabase-url";
    }
  })();

  if (error) {
    return {
      ok: false,
      bucket,
      host,
      error: error.message,
      statusCode: (error as any)?.statusCode,
    };
  }

  return {
    ok: true,
    bucket,
    host,
    sample: data?.[0]?.name ?? null,
  };
}
