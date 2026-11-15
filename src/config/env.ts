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
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(30).default(12),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(20).max(100),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(20).max(100),
  JWT_AUDINCE: z.string().min(10).default("AUTH_APPLICATION"),
  JWT_ISSUER: z.string().min(10).default("AUTH_APPLICATION"),
  JWT_ACCESS_TOKEN_EXPIRES_IN :z.string().default("15m"),
  JWT_REFRESH_TOKEN_EXPIRES_IN :z.string().default("7d"),
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
