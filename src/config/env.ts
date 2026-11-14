import "dotenv/config";
import z from "zod";
const shcema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(2).max(65000),
  API_PREFIX: z.string().min(3).default("/api/v1"),
  APP_NAME: z.string().min(2).max(100),
  DATABASE_URL: z
    .string()
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      { error: "Invalid DATABASE_URL" },
    ),
});

const pasered = shcema.safeParse(process.env);

if (!pasered.success) {
  console.log("\nInvalid environment configration.");

  const issuses = pasered.error.issues;
  for (const i of issuses) {
    console.log(`${i.path.join(".") || "(root)"}: ${i.message}`);
  }

  process.exit(1);
}

export const env = Object.freeze(pasered.data);
export const Env = typeof env;
