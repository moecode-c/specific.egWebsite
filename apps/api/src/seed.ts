import { assertEnv, env } from "./utils/env";
import { connectDb } from "./utils/db";
import { User } from "./models/User";
import { Product } from "./models/Product";

async function seed() {
  assertEnv();
  await connectDb();

  const adminEmail = env.SEED_ADMIN_EMAIL.toLowerCase();

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: env.SEED_ADMIN_NAME,
      email: adminEmail,
      password: env.SEED_ADMIN_PASSWORD,
      role: "admin",
    });
  }

  const existingCount = await Product.countDocuments();
  if (existingCount === 0) {
    await Product.insertMany([
      {
        name: "Obsidian MagSafe Case",
        description: "Premium matte black with neon purple edge glow.",
        price: 24.99,
        images: [],
        phoneModels: ["13", "14 Pro", "15"],
        colors: ["Black", "Neon Purple"],
        isFeatured: true,
      },
      {
        name: "Aurora Clear Shield",
        description: "Crystal clear protection with luxury purple tint.",
        price: 19.99,
        images: [],
        phoneModels: ["14", "15", "17"],
        colors: ["Clear", "Purple Tint"],
        isFeatured: true,
      },
      {
        name: "Titan Armor Grip",
        description: "Shockproof armor with premium grip texture.",
        price: 29.99,
        images: [],
        phoneModels: ["15 Pro", "17"],
        colors: ["Black"],
        isFeatured: false,
      },
    ]);
  }

  // eslint-disable-next-line no-console
  console.log("Seed complete:", { adminEmail });
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
